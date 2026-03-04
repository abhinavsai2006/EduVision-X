/* ═══════════════════════════════════════════════════════
   Export Utilities — HTML, PDF, PNG, ISL, ISLT, Markdown import
   ═══════════════════════════════════════════════════════ */
import { Presentation, Slide, SlideElement, THEMES, ThemeKey } from '@/types/slide';
import { createElement, slideUid, uid } from './elements';

function fileExt(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx).toLowerCase() : '';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createImportedBinaryPresentation(file: File, objectUrl: string, extension: string): Presentation {
  const now = new Date().toISOString();
  const safeName = escapeHtml(file.name);

  const slide: Slide = {
    id: slideUid(),
    order: 0,
    layout: 'blank',
    background: { type: 'solid', value: '#ffffff' },
    elements: [],
    notes: '',
    transition: 'none',
    animations: [],
  };

  if (extension === '.pdf') {
    slide.elements = [
      createElement('heading', { x: 40, y: 24, width: 880, content: file.name }),
      createElement('embed', {
        x: 40,
        y: 94,
        width: 880,
        height: 410,
        html: `<iframe src="${objectUrl}" title="${safeName}" style="width:100%;height:100%;border:0;border-radius:8px;background:#fff"></iframe>`,
      }),
    ];
  } else {
    slide.elements = [
      createElement('heading', { x: 40, y: 24, width: 880, content: file.name }),
      createElement('text', {
        x: 40,
        y: 110,
        width: 880,
        height: 80,
        content: 'PowerPoint file imported. Use the link below to open/download the source file.',
      }),
      createElement('embed', {
        x: 40,
        y: 210,
        width: 880,
        height: 120,
        html: `<div style="display:flex;align-items:center;justify-content:center;height:100%;border:1px solid #ddd;border-radius:10px;background:#f8fafc"><a href="${objectUrl}" download="${safeName}" target="_blank" rel="noopener noreferrer" style="font-size:16px;color:#2563eb;text-decoration:none">Open ${safeName}</a></div>`,
      }),
    ];
  }

  return {
    meta: {
      title: file.name,
      author: '',
      createdAt: now,
      updatedAt: now,
      version: '3.0',
      theme: 'default',
      aspectRatio: '16:9',
    },
    slides: [slide],
    settings: {
      transition: 'fade',
      transitionDuration: 500,
      autoPlay: false,
      autoPlayInterval: 5000,
      showSlideNumbers: true,
      enableAI: true,
      enableInteractive: true,
    },
  };
}

function parseSlideNumber(path: string): number {
  const match = path.match(/slide(\d+)\.xml$/i);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function getElementsByLocalName(root: Document | Element, name: string): Element[] {
  return Array.from(root.getElementsByTagName('*')).filter(node => node.localName === name);
}

function getAttr(node: Element, attrName: string): string | null {
  if (node.hasAttribute(attrName)) return node.getAttribute(attrName);
  const direct = node.getAttributeNS('*', attrName);
  if (direct) return direct;
  for (const attr of Array.from(node.attributes)) {
    if (attr.localName === attrName) return attr.value;
  }
  return null;
}

function resolvePptTarget(basePath: string, target: string): string {
  if (!target) return '';
  const normalizedTarget = target.replace(/\\/g, '/');
  if (normalizedTarget.startsWith('/')) return normalizedTarget.replace(/^\//, '');

  const baseParts = basePath.split('/').slice(0, -1);
  const targetParts = normalizedTarget.split('/');
  const out = [...baseParts];

  for (const part of targetParts) {
    if (!part || part === '.') continue;
    if (part === '..') {
      out.pop();
      continue;
    }
    out.push(part);
  }
  return out.join('/');
}

function buildImportedPresentation(slides: Slide[], title: string): Presentation {
  const now = new Date().toISOString();
  return {
    meta: {
      title,
      author: '',
      createdAt: now,
      updatedAt: now,
      version: '3.0',
      theme: 'default',
      aspectRatio: '16:9',
    },
    slides,
    settings: {
      transition: 'fade',
      transitionDuration: 500,
      autoPlay: false,
      autoPlayInterval: 5000,
      showSlideNumbers: true,
      enableAI: true,
      enableInteractive: true,
    },
  };
}

const POWERPOINT_EXTENSIONS = new Set(['.ppt', '.pptx', '.pptm', '.pps', '.ppsx', '.pot', '.potx']);
let lastImportError = '';

export function getLastImportError(): string {
  return lastImportError;
}

function setLastImportError(message: string) {
  lastImportError = message;
}

async function convertPowerPointToPdf(file: File): Promise<Blob | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/import/convert-ppt', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      try {
        const errorData = await response.json();
        setLastImportError(errorData?.detail || errorData?.error || 'PowerPoint conversion failed');
      } catch {
        setLastImportError('PowerPoint conversion failed');
      }
      return null;
    }
    return await response.blob();
  } catch {
    setLastImportError('Unable to reach conversion service.');
    return null;
  }
}

async function importPdfBlobAsSlides(pdfBlob: Blob, title: string): Promise<Presentation | null> {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const workerUrl = new URL('pdfjs-dist/legacy/build/pdf.worker.mjs', import.meta.url).toString();
    (pdfjs as any).GlobalWorkerOptions.workerSrc = workerUrl;

    const pdfBytes = await pdfBlob.arrayBuffer();
    const loadingTask = (pdfjs as any).getDocument({ data: pdfBytes });
    const pdf = await loadingTask.promise;

    const slides: Slide[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(PPTX_CANVAS_WIDTH / baseViewport.width, PPTX_CANVAS_HEIGHT / baseViewport.height);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) continue;

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvasContext: context, viewport }).promise;

      const src = canvas.toDataURL('image/png');
      const imageWidth = Math.min(PPTX_CANVAS_WIDTH, canvas.width);
      const imageHeight = Math.min(PPTX_CANVAS_HEIGHT, canvas.height);
      const x = Math.round((PPTX_CANVAS_WIDTH - imageWidth) / 2);
      const y = Math.round((PPTX_CANVAS_HEIGHT - imageHeight) / 2);

      const slide: Slide = {
        id: slideUid(),
        order: pageNumber - 1,
        layout: 'blank',
        background: { type: 'solid', value: '#ffffff' },
        elements: [
          createElement('image', {
            x,
            y,
            width: imageWidth,
            height: imageHeight,
            src,
            alt: `Slide ${pageNumber}`,
            objectFit: 'contain',
          }),
        ],
        notes: '',
        transition: 'none',
        animations: [],
      };

      slides.push(slide);
    }

    if (slides.length === 0) return null;
    return buildImportedPresentation(slides, title);
  } catch {
    return null;
  }
}

const PPTX_CANVAS_WIDTH = 960;
const PPTX_CANVAS_HEIGHT = 540;
const DEFAULT_PPTX_CX = 9144000;
const DEFAULT_PPTX_CY = 6858000;

function toNumber(value: string | null | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function emuToCanvas(value: number, fullEmu: number, fullCanvas: number): number {
  if (!fullEmu) return 0;
  return Math.round((value / fullEmu) * fullCanvas);
}

function clampRect(x: number, y: number, width: number, height: number) {
  const safeX = Math.max(0, Math.min(PPTX_CANVAS_WIDTH - 20, x));
  const safeY = Math.max(0, Math.min(PPTX_CANVAS_HEIGHT - 20, y));
  const maxWidth = PPTX_CANVAS_WIDTH - safeX;
  const maxHeight = PPTX_CANVAS_HEIGHT - safeY;
  return {
    x: safeX,
    y: safeY,
    width: Math.max(60, Math.min(maxWidth, width)),
    height: Math.max(30, Math.min(maxHeight, height)),
  };
}

function getNodeRect(node: Element, slideCx: number, slideCy: number, fallbackIndex: number) {
  const xfrm = getElementsByLocalName(node, 'xfrm')[0];
  if (!xfrm) {
    return {
      x: 60,
      y: 50 + (fallbackIndex * 60),
      width: 840,
      height: 54,
    };
  }

  const off = getElementsByLocalName(xfrm, 'off')[0];
  const ext = getElementsByLocalName(xfrm, 'ext')[0];

  const xEmu = toNumber(off ? getAttr(off, 'x') : null, 0);
  const yEmu = toNumber(off ? getAttr(off, 'y') : null, 0);
  const cxEmu = toNumber(ext ? getAttr(ext, 'cx') : null, DEFAULT_PPTX_CX / 2);
  const cyEmu = toNumber(ext ? getAttr(ext, 'cy') : null, DEFAULT_PPTX_CY / 8);

  return clampRect(
    emuToCanvas(xEmu, slideCx, PPTX_CANVAS_WIDTH),
    emuToCanvas(yEmu, slideCy, PPTX_CANVAS_HEIGHT),
    emuToCanvas(cxEmu, slideCx, PPTX_CANVAS_WIDTH),
    emuToCanvas(cyEmu, slideCy, PPTX_CANVAS_HEIGHT),
  );
}

type PptxParagraphStyle = {
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  color?: string;
  textAlign?: string;
};

function parseRunStyle(paragraph: Element): PptxParagraphStyle {
  const style: PptxParagraphStyle = {};
  const firstRun = getElementsByLocalName(paragraph, 'r')[0];
  const runProps = firstRun ? getElementsByLocalName(firstRun, 'rPr')[0] : undefined;
  const paraProps = getElementsByLocalName(paragraph, 'pPr')[0];
  const defaultRunProps = paraProps ? getElementsByLocalName(paraProps, 'defRPr')[0] : undefined;
  const source = runProps || defaultRunProps;

  if (source) {
    const sz = toNumber(getAttr(source, 'sz'), 0);
    if (sz > 0) {
      const px = Math.max(10, Math.round(sz / 75));
      style.fontSize = `${px}px`;
    }
    if (getAttr(source, 'b') === '1') style.fontWeight = 'bold';
    if (getAttr(source, 'i') === '1') style.fontStyle = 'italic';

    const solidFill = getElementsByLocalName(source, 'solidFill')[0];
    const srgb = solidFill ? getElementsByLocalName(solidFill, 'srgbClr')[0] : undefined;
    const rgb = srgb ? getAttr(srgb, 'val') : null;
    if (rgb && /^[0-9a-fA-F]{6}$/.test(rgb)) {
      style.color = `#${rgb}`;
    }
  }

  if (paraProps) {
    const alignRaw = getAttr(paraProps, 'algn');
    if (alignRaw === 'ctr') style.textAlign = 'center';
    else if (alignRaw === 'r') style.textAlign = 'right';
    else if (alignRaw === 'just') style.textAlign = 'justify';
    else if (alignRaw === 'l') style.textAlign = 'left';
  }

  return style;
}

function mergeParagraphStyles(paragraphs: Array<{ style: PptxParagraphStyle }>): PptxParagraphStyle {
  const merged: PptxParagraphStyle = {};
  for (const paragraph of paragraphs) {
    const style = paragraph.style;
    if (!merged.fontSize && style.fontSize) merged.fontSize = style.fontSize;
    if (!merged.fontWeight && style.fontWeight) merged.fontWeight = style.fontWeight;
    if (!merged.fontStyle && style.fontStyle) merged.fontStyle = style.fontStyle;
    if (!merged.color && style.color) merged.color = style.color;
    if (!merged.textAlign && style.textAlign) merged.textAlign = style.textAlign;
  }
  return merged;
}

function applyImportedStyle(target: SlideElement, style: PptxParagraphStyle) {
  target.style = {
    ...target.style,
    ...(style.fontSize ? { fontSize: style.fontSize } : {}),
    ...(style.fontWeight ? { fontWeight: style.fontWeight } : {}),
    ...(style.fontStyle ? { fontStyle: style.fontStyle } : {}),
    ...(style.color ? { color: style.color } : {}),
    ...(style.textAlign ? { textAlign: style.textAlign } : {}),
  };
}

function getParagraphsFromShape(shape: Element): Array<{ text: string; level: number; bulleted: boolean; style: PptxParagraphStyle }> {
  const paragraphs = getElementsByLocalName(shape, 'p');
  const output: Array<{ text: string; level: number; bulleted: boolean; style: PptxParagraphStyle }> = [];

  for (const paragraph of paragraphs) {
    const line = getElementsByLocalName(paragraph, 't')
      .map(node => node.textContent?.trim() || '')
      .filter(Boolean)
      .join(' ')
      .trim();

    if (!line) continue;

    const pPr = getElementsByLocalName(paragraph, 'pPr')[0];
    const level = Math.max(0, Math.min(5, toNumber(pPr ? getAttr(pPr, 'lvl') : null, 0)));
    const bulleted =
      !!getElementsByLocalName(paragraph, 'buChar')[0] ||
      !!getElementsByLocalName(paragraph, 'buAutoNum')[0] ||
      !!getElementsByLocalName(paragraph, 'buBlip')[0] ||
      level > 0;

    output.push({ text: line, level, bulleted, style: parseRunStyle(paragraph) });
  }

  return output;
}

async function importPptxFromFile(file: File): Promise<Presentation | null> {
  try {
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const parser = new DOMParser();

    let slideCx = DEFAULT_PPTX_CX;
    let slideCy = DEFAULT_PPTX_CY;
    const presentationXml = await zip.file('ppt/presentation.xml')?.async('string');
    if (presentationXml) {
      const presentationDoc = parser.parseFromString(presentationXml, 'application/xml');
      const sldSz = getElementsByLocalName(presentationDoc, 'sldSz')[0];
      if (sldSz) {
        slideCx = toNumber(getAttr(sldSz, 'cx'), DEFAULT_PPTX_CX);
        slideCy = toNumber(getAttr(sldSz, 'cy'), DEFAULT_PPTX_CY);
      }
    }

    const slidePaths = Object.keys(zip.files)
      .filter(path => /^ppt\/slides\/slide\d+\.xml$/i.test(path))
      .sort((a, b) => parseSlideNumber(a) - parseSlideNumber(b));

    if (slidePaths.length === 0) return null;

    const parsedSlides: Slide[] = [];

    for (let i = 0; i < slidePaths.length; i += 1) {
      const slidePath = slidePaths[i];
      const slideXml = await zip.file(slidePath)?.async('string');
      if (!slideXml) continue;

      const slideDoc = parser.parseFromString(slideXml, 'application/xml');
      const relsPath = slidePath.replace('/slides/', '/slides/_rels/') + '.rels';
      const relsXml = await zip.file(relsPath)?.async('string');
      const relsDoc = relsXml ? parser.parseFromString(relsXml, 'application/xml') : null;

      const relMap = new Map<string, string>();
      if (relsDoc) {
        const relationships = getElementsByLocalName(relsDoc, 'Relationship');
        relationships.forEach(rel => {
          const id = getAttr(rel, 'Id');
          const target = getAttr(rel, 'Target');
          if (id && target) {
            relMap.set(id, resolvePptTarget(relsPath, target));
          }
        });
      }

      const elements: SlideElement[] = [];
      const shapes = getElementsByLocalName(slideDoc, 'sp');

      shapes.forEach((shape, shapeIndex) => {
        const paragraphs = getParagraphsFromShape(shape);
        if (paragraphs.length === 0) return;

        const rect = getNodeRect(shape, slideCx, slideCy, shapeIndex);
        const cNvPr = getElementsByLocalName(shape, 'cNvPr')[0];
        const shapeName = (cNvPr ? getAttr(cNvPr, 'name') : '') || '';
        const isTitle = /title/i.test(shapeName) || (shapeIndex === 0 && paragraphs[0]?.level === 0);
        const bulletParagraphs = paragraphs.filter(p => p.bulleted || p.level > 0);
        const mergedStyle = mergeParagraphStyles(paragraphs);

        if (bulletParagraphs.length >= 2 && bulletParagraphs.length >= Math.ceil(paragraphs.length / 2)) {
          const items = bulletParagraphs.map(p => `${p.level > 0 ? `${'↳ '.repeat(p.level)}` : ''}${p.text}`);
          const listElement = createElement('list', {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: Math.max(rect.height, 70),
            items,
            listType: 'bullet',
          });
          applyImportedStyle(listElement, mergeParagraphStyles(bulletParagraphs));
          elements.push(listElement);
          return;
        }

        if (isTitle) {
          const headingElement = createElement('heading', {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: Math.max(rect.height, 50),
            content: paragraphs.map(p => p.text).join(' '),
          });
          applyImportedStyle(headingElement, mergedStyle);
          elements.push(headingElement);
          return;
        }

        const textElement = createElement('text', {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: Math.max(rect.height, 42),
          content: paragraphs.map(p => p.text).join('<br/>'),
        });
        applyImportedStyle(textElement, mergedStyle);
        elements.push(textElement);
      });

      const pictures = getElementsByLocalName(slideDoc, 'pic');
      for (let picIndex = 0; picIndex < pictures.length; picIndex += 1) {
        const picture = pictures[picIndex];
        const blip = getElementsByLocalName(picture, 'blip')[0];
        if (!blip) continue;

        const embedId = getAttr(blip, 'embed') || getAttr(blip, 'link');
        if (!embedId) continue;

        const targetPath = relMap.get(embedId);
        if (!targetPath) continue;

        const mediaFile = zip.file(targetPath);
        if (!mediaFile) continue;

        const rect = getNodeRect(picture, slideCx, slideCy, shapes.length + picIndex);
        const blob = await mediaFile.async('blob');
        const src = URL.createObjectURL(blob);
        elements.push(createElement('image', {
          x: rect.x,
          y: rect.y,
          width: Math.max(rect.width, 80),
          height: Math.max(rect.height, 60),
          src,
          alt: `Slide image ${picIndex + 1}`,
        }));
      }

      if (elements.length === 0) {
        elements.push(createElement('heading', { x: 56, y: 72, width: 848, content: `Slide ${i + 1}` }));
      }

      parsedSlides.push({
        id: slideUid(),
        order: i,
        layout: 'blank',
        background: { type: 'solid', value: '#ffffff' },
        elements,
        notes: '',
        transition: 'none',
        animations: [],
      });
    }

    if (parsedSlides.length === 0) return null;
    return buildImportedPresentation(parsedSlides, file.name);
  } catch {
    return null;
  }
}

export async function importPresentationFromFile(file: File): Promise<Presentation | null> {
  setLastImportError('');
  const extension = fileExt(file.name);

  if (extension === '.islt') {
    const text = await file.text();
    return importISLTText(text);
  }

  if (extension === '.isl' || extension === '.json') {
    const text = await file.text();
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  if (POWERPOINT_EXTENSIONS.has(extension)) {
    const convertedPdf = await convertPowerPointToPdf(file);
    if (convertedPdf) {
      const renderedSlides = await importPdfBlobAsSlides(convertedPdf, file.name);
      if (renderedSlides) return renderedSlides;
    }
    if (!lastImportError) {
      setLastImportError('PowerPoint conversion failed.');
    }
    return null;
  }

  if (extension === '.pdf') {
    const objectUrl = URL.createObjectURL(file);
    return createImportedBinaryPresentation(file, objectUrl, extension);
  }

  return null;
}

/* ── Download helper ─── */
function downloadBlob(blob: Blob, name: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ── Export ISL (JSON) ─── */
export function exportISL(pres: Presentation) {
  const blob = new Blob([JSON.stringify(pres, null, 2)], { type: 'application/json' });
  downloadBlob(blob, (pres.meta.title || 'presentation') + '.isl.json');
}

/* ── Export ISLT (text format) ─── */
export function exportISLT(pres: Presentation) {
  const lines: string[] = [];
  lines.push(`title: ${pres.meta.title}`, `theme: ${pres.meta.theme}`, '');
  pres.slides.forEach((slide, si) => {
    if (si > 0) lines.push('---', '');
    slide.elements.forEach(el => {
      switch (el.type) {
        case 'heading': lines.push(`# ${el.content || 'Heading'}`); break;
        case 'text': lines.push(`> ${el.content || ''}`); break;
        case 'list': (el.items || []).forEach(i => lines.push(`- ${i}`)); break;
        case 'code': lines.push(`\`\`\`${el.language || 'javascript'}`, el.content || '', '```'); break;
        case 'math': lines.push(`$$ ${el.content || ''} $$`); break;
        case 'image': lines.push(`![${el.alt || ''}](${el.src || ''})`); break;
        case 'quiz': lines.push(`@quiz ${el.question || ''}`, ...(el.options || []).map((o, i) => `  ${i === el.correct ? '*' : '-'} ${o}`)); break;
        case 'note': lines.push(`@note ${el.content || ''}`); break;
        case 'chart': lines.push(`@chart ${el.chartType || 'bar'}`); break;
        default: if (el.content) lines.push(`> ${el.content}`);
      }
      lines.push('');
    });
    if (slide.notes) lines.push(`// notes: ${slide.notes}`, '');
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  downloadBlob(blob, (pres.meta.title || 'presentation') + '.islt');
}

/* ── Export PDF (proper slide-by-slide rendering) ─── */
export async function exportPDF() {
  // Try using html2canvas for each slide, then assemble into print layout
  const slideEl = document.querySelector('.slide-canvas') as HTMLElement;
  if (!slideEl) { window.print(); return; }

  try {
    const { default: html2canvas } = await import('html2canvas');
    if (html2canvas) {
      // Create a print-friendly page
      const printWin = window.open('', '_blank');
      if (!printWin) { window.print(); return; }
      printWin.document.write(`<html><head><title>Print Slides</title><style>
        @page { size: landscape; margin: 0; }
        body { margin: 0; padding: 0; }
        img { page-break-after: always; width: 100vw; height: auto; display: block; }
        img:last-child { page-break-after: auto; }
      </style></head><body>`);

      const cvs = await html2canvas(slideEl, { scale: 2, backgroundColor: '#fff' });
      const dataUrl = cvs.toDataURL('image/png');
      printWin.document.write(`<img src="${dataUrl}" />`);
      printWin.document.write('</body></html>');
      printWin.document.close();
      setTimeout(() => { printWin.print(); }, 500);
      return;
    }
  } catch { /* fallback */ }
  window.print();
}

/* ── Export PNG (current slide) ─── */
export async function exportPNG(slideIdx: number) {
  const slideEl = document.querySelector('.slide-canvas') as HTMLElement;
  if (!slideEl) return;

  try {
    const { default: html2canvas } = await import('html2canvas');
    if (html2canvas) {
      const cvs = await html2canvas(slideEl, { scale: 2, backgroundColor: '#fff', useCORS: true });
      cvs.toBlob((blob: Blob | null) => { if (blob) downloadBlob(blob, `slide_${slideIdx + 1}.png`); }, 'image/png');
      return;
    }
  } catch { /* fallback below */ }

  // Simple fallback: draw white background
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1920, 1080);
  ctx.fillStyle = '#333';
  ctx.font = '48px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Slide ${slideIdx + 1}`, 960, 540);
  canvas.toBlob(blob => { if (blob) downloadBlob(blob, `slide_${slideIdx + 1}.png`); }, 'image/png');
}

/* ── Export standalone HTML ─── */
export function exportHTML(pres: Presentation) {
  const theme = THEMES[pres.meta.theme as ThemeKey] || THEMES.default;
  const slidesHTML = pres.slides.map((slide, si) => {
    const bg = slide.background.value === '#ffffff' || slide.background.value === '#fff' ? theme.bg : slide.background.value;
    const elements = slide.elements.map(el => {
      let content = '';
      switch (el.type) {
        case 'heading': content = `<h1 style="font-size:${el.style?.fontSize||'36px'};color:${el.style?.color||theme.heading};font-weight:bold">${el.content||''}</h1>`; break;
        case 'text': content = `<p style="font-size:${el.style?.fontSize||'20px'};color:${el.style?.color||theme.text}">${el.content||''}</p>`; break;
        case 'list': content = `<ul style="font-size:${el.style?.fontSize||'18px'};color:${el.style?.color||theme.text}">${(el.items||[]).map(i=>`<li>${i}</li>`).join('')}</ul>`; break;
        case 'image': content = `<img src="${el.src||''}" style="width:100%;height:100%;object-fit:contain" />`; break;
        case 'code': content = `<pre style="background:#1a1a2e;color:#e8e8f0;padding:12px;border-radius:6px;font-size:13px;overflow:auto"><code>${(el.content||'').replace(/</g,'&lt;')}</code></pre>`; break;
        case 'math': content = `<div style="font-size:${el.style?.fontSize||'28px'};font-family:serif;font-style:italic;color:${el.style?.color||theme.text}">${el.content||''}</div>`; break;
        case 'note': content = `<div style="background:#ffeaa7;padding:12px;border-radius:6px;color:#2d3436">${el.content||''}</div>`; break;
        case 'quiz': content = `<div style="background:#f8f9fa;padding:12px;border-radius:8px;border:2px solid #6366f1"><b>${el.question||''}</b>${(el.options||[]).map((o,i)=>`<div style="margin:4px 0;padding:6px;background:#fff;border:1px solid #ddd;border-radius:4px;cursor:pointer" onclick="this.style.background=this.dataset.c==='${el.correct}'?'#00b894':'#e74c3c';this.style.color='#fff'" data-c="${i}">${String.fromCharCode(65+i)}) ${o}</div>`).join('')}</div>`; break;
        default: content = `<div>${el.content||el.type}</div>`;
      }
      return `<div style="position:absolute;left:${el.x}px;top:${el.y}px;width:${el.width}px;height:${el.height}px;${el.rotation?`transform:rotate(${el.rotation}deg);`:''}opacity:${el.opacity}">${content}</div>`;
    }).join('\n');
    return `<div class="slide" data-idx="${si}" style="width:960px;height:540px;position:relative;background:${bg};display:none">\n${elements}\n</div>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${pres.meta.title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;display:flex;align-items:center;justify-content:center;height:100vh;font-family:'Inter',system-ui,sans-serif;overflow:hidden}
.slide{border-radius:4px;overflow:hidden}
.progress{position:fixed;top:0;left:0;height:3px;background:#6366f1;transition:width .3s;z-index:100}
.nav{position:fixed;bottom:20px;right:20px;display:flex;gap:8px;z-index:100}
.nav button{background:rgba(0,0,0,.5);color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:13px}
.counter{position:fixed;bottom:20px;left:20px;color:#fff;font-size:12px;background:rgba(0,0,0,.5);padding:4px 10px;border-radius:6px;z-index:100}
</style>
</head>
<body>
<div class="progress" id="prog"></div>
${slidesHTML}
<div class="counter" id="counter"></div>
<div class="nav">
<button onclick="go(-1)">◀ Prev</button>
<button onclick="go(1)">Next ▶</button>
<button onclick="document.documentElement.requestFullscreen()">⛶</button>
</div>
<script>
let idx=0;const slides=document.querySelectorAll('.slide'),total=slides.length;
function show(){slides.forEach((s,i)=>s.style.display=i===idx?'block':'none');
document.getElementById('counter').textContent=(idx+1)+'/'+total;
document.getElementById('prog').style.width=((idx+1)/total*100)+'%';
const s=Math.min(window.innerWidth/960,window.innerHeight/540);
slides[idx].style.transform='scale('+s+')';slides[idx].style.transformOrigin='center center';}
function go(d){idx=Math.max(0,Math.min(idx+d,total-1));show();}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' ')go(1);if(e.key==='ArrowLeft')go(-1);if(e.key==='Escape')document.exitFullscreen?.();});
window.addEventListener('resize',show);show();
</script>
</body>
</html>`;
  const blob = new Blob([html], { type: 'text/html' });
  downloadBlob(blob, (pres.meta.title || 'presentation') + '.html');
}

/* ── Export SVG (current slide) ─── */
export async function exportSVG(pres: Presentation, slideIdx: number) {
  const slide = pres.slides[slideIdx];
  if (!slide) return;
  const theme = THEMES[pres.meta.theme as ThemeKey] || THEMES.default;
  const bg = slide.background.value || theme.bg;
  const width = 960, height = 540;
  
  const elements = slide.elements.map(el => {
    const s = el.style || {};
    let inner = '';
    switch (el.type) {
      case 'heading': inner = `<text font-size="${(s.fontSize as string)?.replace('px','') || 36}" font-weight="bold" fill="${s.color || theme.heading}">${escSvg(el.content || 'Heading')}</text>`; break;
      case 'text': inner = `<text font-size="${(s.fontSize as string)?.replace('px','') || 20}" fill="${s.color || theme.text}">${escSvg(el.content || '')}</text>`; break;
      case 'shape': inner = `<rect width="${el.width}" height="${el.height}" rx="8" fill="${s.fill || '#6366f1'}" stroke="${s.stroke || '#4f46e5'}" />`; break;
      case 'image': inner = `<image href="${el.src || ''}" width="${el.width}" height="${el.height}" preserveAspectRatio="xMidYMid meet" />`; break;
      default: inner = `<text font-size="14" fill="${theme.text}">[${el.type}]</text>`;
    }
    return `<g transform="translate(${el.x},${el.y})${el.rotation ? ` rotate(${el.rotation},${el.width/2},${el.height/2})` : ''}" opacity="${el.opacity}">${inner}</g>`;
  }).join('\n');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="${bg.startsWith('linear') ? '#ffffff' : bg}" />
  ${elements}
</svg>`;
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  downloadBlob(blob, `slide_${slideIdx + 1}.svg`);
}

function escSvg(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── Generate embed code for sharing ─── */
export function generateEmbedCode(pres: Presentation): string {
  const html = generateStandaloneHTML(pres);
  const blob = new Blob([html], { type: 'text/html' });
  const dataUri = URL.createObjectURL(blob);
  return `<iframe src="${dataUri}" width="960" height="580" frameborder="0" allowfullscreen></iframe>`;
}

/* ── Generate shareable standalone HTML string ─── */
function generateStandaloneHTML(pres: Presentation): string {
  const theme = THEMES[pres.meta.theme as ThemeKey] || THEMES.default;
  const slidesHTML = pres.slides.map((slide, si) => {
    const bg = slide.background.value === '#ffffff' || slide.background.value === '#fff' ? theme.bg : slide.background.value;
    const elements = slide.elements.map(el => {
      let content = '';
      switch (el.type) {
        case 'heading': content = `<h1 style="font-size:${el.style?.fontSize||'36px'};color:${el.style?.color||theme.heading};font-weight:bold;margin:0">${el.content||''}</h1>`; break;
        case 'text': content = `<p style="font-size:${el.style?.fontSize||'20px'};color:${el.style?.color||theme.text};margin:0">${el.content||''}</p>`; break;
        case 'list': content = `<ul style="font-size:${el.style?.fontSize||'18px'};color:${el.style?.color||theme.text};margin:0">${(el.items||[]).map(i=>`<li>${i}</li>`).join('')}</ul>`; break;
        case 'image': content = `<img src="${el.src||''}" style="width:100%;height:100%;object-fit:contain" />`; break;
        case 'code': content = `<pre style="background:#1a1a2e;color:#e8e8f0;padding:12px;border-radius:6px;font-size:13px;overflow:auto;margin:0"><code>${(el.content||'').replace(/</g,'&lt;')}</code></pre>`; break;
        default: content = `<div style="color:${theme.text}">${el.content||el.type}</div>`;
      }
      return `<div style="position:absolute;left:${el.x}px;top:${el.y}px;width:${el.width}px;height:${el.height}px;${el.rotation?`transform:rotate(${el.rotation}deg);`:''}opacity:${el.opacity}">${content}</div>`;
    }).join('\n');
    return `<div class="s" data-i="${si}" style="width:960px;height:540px;position:relative;background:${bg};display:none">${elements}</div>`;
  }).join('\n');

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${pres.meta.title}</title>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{background:#000;display:flex;align-items:center;justify-content:center;height:100vh;font-family:Inter,system-ui,sans-serif;overflow:hidden}.s{border-radius:4px;overflow:hidden}.p{position:fixed;top:0;left:0;height:3px;background:#6366f1;transition:width .3s;z-index:100}.n{position:fixed;bottom:20px;right:20px;display:flex;gap:8px;z-index:100}.n button{background:rgba(0,0,0,.5);color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:13px}.c{position:fixed;bottom:20px;left:20px;color:#fff;font-size:12px;background:rgba(0,0,0,.5);padding:4px 10px;border-radius:6px;z-index:100}</style></head><body>
  <div class="p" id="p"></div>${slidesHTML}<div class="c" id="c"></div>
  <div class="n"><button onclick="g(-1)">◀</button><button onclick="g(1)">▶</button><button onclick="document.documentElement.requestFullscreen()">⛶</button></div>
  <script>let i=0;const s=document.querySelectorAll('.s'),t=s.length;function w(){s.forEach((e,j)=>e.style.display=j===i?'block':'none');document.getElementById('c').textContent=(i+1)+'/'+t;document.getElementById('p').style.width=((i+1)/t*100)+'%';const k=Math.min(innerWidth/960,innerHeight/540);s[i].style.transform='scale('+k+')';s[i].style.transformOrigin='center center';}function g(d){i=Math.max(0,Math.min(i+d,t-1));w();}document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' ')g(1);if(e.key==='ArrowLeft')g(-1);});addEventListener('resize',w);w();</script></body></html>`;
}

/* ── Copy embed code to clipboard ─── */
export async function copyEmbedCode(pres: Presentation) {
  const html = generateStandaloneHTML(pres);
  // Create a data URL version for the iframe
  const encoded = btoa(unescape(encodeURIComponent(html)));
  const embedCode = `<iframe src="data:text/html;base64,${encoded}" width="960" height="580" frameborder="0" allowfullscreen style="border:none;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15)"></iframe>`;
  try {
    await navigator.clipboard.writeText(embedCode);
    return true;
  } catch {
    return false;
  }
}

/* ── Import ISL (JSON) from file ─── */
export function importISLFromFile(): Promise<Presentation | null> {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.isl,.json,.islt';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      const text = await file.text();
      try {
        if (file.name.endsWith('.islt')) {
          resolve(importISLTText(text));
        } else {
          resolve(JSON.parse(text));
        }
      } catch {
        resolve(null);
      }
    };
    input.click();
  });
}

/* ── Import Markdown ─── */
export function importMarkdownFromFile(): Promise<Presentation | null> {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      const text = await file.text();
      resolve(parseMarkdown(text));
    };
    input.click();
  });
}

/* ── Parse markdown text into presentation ─── */
export function parseMarkdown(text: string): Presentation {
  const slideTexts = text.split(/^---$/m);
  const slides: Slide[] = slideTexts.map((block, si) => {
    const lines = block.trim().split('\n');
    const elements: SlideElement[] = [];
    let y = 40;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('# ')) {
        elements.push(createElement('heading', { content: trimmed.slice(2), y, x: 40, width: 880 }));
        y += 70;
      } else if (trimmed.startsWith('## ')) {
        elements.push(createElement('heading', { content: trimmed.slice(3), y, x: 40, width: 880, style: { fontSize: '28px' } }));
        y += 60;
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        // Collect consecutive list items
        const items = [trimmed.slice(2)];
        elements.push(createElement('list', { items, y, x: 40, width: 880, height: 40 }));
        y += 50;
      } else if (trimmed.startsWith('![')) {
        const match = trimmed.match(/!\[([^\]]*)\]\(([^)]*)\)/);
        if (match) {
          elements.push(createElement('image', { alt: match[1], src: match[2], y, x: 200, width: 560, height: 300 }));
          y += 320;
        }
      } else if (trimmed.startsWith('```')) {
        // Skip code fences
      } else {
        elements.push(createElement('text', { content: trimmed, y, x: 40, width: 880 }));
        y += 50;
      }
    }

    return {
      id: slideUid(),
      order: si,
      layout: 'blank',
      background: { type: 'solid', value: '#ffffff' },
      elements,
      notes: '',
      transition: 'none',
      animations: [],
    };
  });

  return {
    meta: {
      title: 'Imported Presentation',
      author: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '3.0',
      theme: 'default',
      aspectRatio: '16:9',
    },
    slides: slides.length > 0 ? slides : [{ id: slideUid(), order: 0, layout: 'blank', background: { type: 'solid', value: '#ffffff' }, elements: [], notes: '', transition: 'none', animations: [] }],
    settings: {
      transition: 'fade',
      transitionDuration: 500,
      autoPlay: false,
      autoPlayInterval: 5000,
      showSlideNumbers: true,
      enableAI: true,
      enableInteractive: true,
    },
  };
}

/* ── Parse ISLT text format ─── */
function importISLTText(text: string): Presentation {
  const lines = text.split('\n');
  let title = 'Imported Presentation';
  let theme: ThemeKey = 'default';
  let lineIdx = 0;

  // Parse header directives
  while (lineIdx < lines.length) {
    const l = lines[lineIdx].trim();
    if (l.startsWith('title:')) { title = l.slice(6).trim(); lineIdx++; continue; }
    if (l.startsWith('theme:')) { theme = l.slice(6).trim() as ThemeKey; lineIdx++; continue; }
    if (l === '') { lineIdx++; continue; }
    break;
  }

  // Split remaining by --- slide separators
  const remaining = lines.slice(lineIdx).join('\n');
  const blocks = remaining.split(/^---$/m);

  const slides: Slide[] = blocks.map((block, si) => {
    const bLines = block.trim().split('\n');
    const elements: SlideElement[] = [];
    let y = 40;
    let notes = '';
    let i = 0;

    while (i < bLines.length) {
      const line = bLines[i].trim();
      if (!line) { i++; continue; }

      // Comments / speaker notes
      if (line.startsWith('// notes:')) {
        notes = line.slice(9).trim();
        i++; continue;
      }

      // Headings
      if (line.startsWith('## ')) {
        elements.push(createElement('heading', { content: line.slice(3), y, x: 40, width: 880, style: { fontSize: '28px' } }));
        y += 60; i++; continue;
      }
      if (line.startsWith('# ')) {
        elements.push(createElement('heading', { content: line.slice(2), y, x: 40, width: 880 }));
        y += 70; i++; continue;
      }

      // Code blocks
      if (line.startsWith('```')) {
        const lang = line.slice(3).trim() || 'javascript';
        const codeLines: string[] = [];
        i++;
        while (i < bLines.length && !bLines[i].trim().startsWith('```')) {
          codeLines.push(bLines[i]); i++;
        }
        i++; // skip closing ```
        elements.push(createElement('code', { content: codeLines.join('\n'), language: lang, y, x: 40, width: 880, height: Math.max(80, codeLines.length * 22 + 40) }));
        y += Math.max(100, codeLines.length * 22 + 60);
        continue;
      }

      // Math blocks
      if (line.startsWith('$$')) {
        const mathContent = line.replace(/^\$\$\s*/, '').replace(/\s*\$\$$/, '');
        elements.push(createElement('math', { content: mathContent, y, x: 100, width: 760, height: 80 }));
        y += 100; i++; continue;
      }

      // Images
      if (line.startsWith('![')) {
        const match = line.match(/!\[([^\]]*)\]\(([^)]*)\)/);
        if (match) {
          elements.push(createElement('image', { alt: match[1], src: match[2], y, x: 200, width: 560, height: 300 }));
          y += 320;
        }
        i++; continue;
      }

      // @quiz directive
      if (line.startsWith('@quiz ')) {
        const question = line.slice(6).trim();
        const options: string[] = [];
        let correct = 0;
        i++;
        while (i < bLines.length && (bLines[i].trim().startsWith('*') || bLines[i].trim().startsWith('-'))) {
          const optLine = bLines[i].trim();
          if (optLine.startsWith('*')) {
            correct = options.length;
            options.push(optLine.slice(1).trim());
          } else {
            options.push(optLine.slice(1).trim());
          }
          i++;
        }
        elements.push(createElement('quiz', { question, options, correct, y, x: 40, width: 880, height: 200 }));
        y += 220;
        continue;
      }

      // @note directive
      if (line.startsWith('@note ')) {
        elements.push(createElement('note', { content: line.slice(6).trim(), y, x: 40, width: 880, height: 80 }));
        y += 100; i++; continue;
      }

      // @chart directive
      if (line.startsWith('@chart ')) {
        elements.push(createElement('chart', { chartType: line.slice(7).trim() || 'bar', y, x: 100, width: 760, height: 300 }));
        y += 320; i++; continue;
      }

      // List items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const items: string[] = [line.slice(2)];
        i++;
        while (i < bLines.length && (bLines[i].trim().startsWith('- ') || bLines[i].trim().startsWith('* '))) {
          items.push(bLines[i].trim().slice(2));
          i++;
        }
        elements.push(createElement('list', { items, y, x: 40, width: 880, height: items.length * 30 + 20 }));
        y += items.length * 30 + 40;
        continue;
      }

      // Quoted text (> prefix)
      if (line.startsWith('> ')) {
        elements.push(createElement('text', { content: line.slice(2), y, x: 40, width: 880 }));
        y += 50; i++; continue;
      }

      // Default: text element
      elements.push(createElement('text', { content: line, y, x: 40, width: 880 }));
      y += 50; i++;
    }

    return {
      id: slideUid(), order: si, layout: 'blank',
      background: { type: 'solid', value: '#ffffff' },
      elements, notes, transition: 'none', animations: [],
    };
  });

  return {
    meta: { title, author: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: '3.0', theme, aspectRatio: '16:9' },
    slides: slides.length > 0 ? slides : [{ id: slideUid(), order: 0, layout: 'blank', background: { type: 'solid', value: '#ffffff' }, elements: [], notes: '', transition: 'none', animations: [] }],
    settings: { transition: 'fade', transitionDuration: 500, autoPlay: false, autoPlayInterval: 5000, showSlideNumbers: true, enableAI: true, enableInteractive: true },
  };
}
