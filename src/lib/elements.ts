/* ═══════════════════════════════════════════════════════
   Element Factory — Creates typed slide elements
   ═══════════════════════════════════════════════════════ */
import { SlideElement, ElementType } from '@/types/slide';

let counter = 0;
export function uid(): string {
  return `el_${Date.now()}_${(++counter).toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function slideUid(): string {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createElement(type: ElementType, props: Partial<SlideElement> = {}): SlideElement {
  const base: SlideElement = {
    id: uid(),
    type,
    x: props.x ?? 60,
    y: props.y ?? 60,
    width: props.width ?? 400,
    height: props.height ?? 50,
    rotation: 0,
    opacity: 1,
    locked: false,
    animation: null,
    animTrigger: 'auto',
    style: {},
  };

  switch (type) {
    case 'heading':
      return { ...base, content: props.content || 'Heading', level: props.level || 1,
        style: { fontSize: '36px', fontWeight: 'bold', color: '#1a1a2e', fontFamily: 'Inter' }, height: 60 };
    case 'text':
      return { ...base, content: props.content || 'Click to edit text',
        style: { fontSize: '20px', color: '#444', fontFamily: 'Inter', lineHeight: '1.6' }, height: 80 };
    case 'list':
      return { ...base, items: props.items || ['Item 1', 'Item 2', 'Item 3'], listType: props.listType || 'bullet',
        style: { fontSize: '20px', color: '#444' }, height: 150 };
    case 'image':
      return { ...base, src: props.src || '', alt: props.alt || '', objectFit: 'contain', width: 400, height: 300, ...props };
    case 'shape':
      return { ...base, shape: props.shape || 'rectangle', width: 200, height: 150,
        style: { fill: '#6366f1', stroke: '#4f46e5', strokeWidth: 2 }, ...props };
    case 'code':
      return { ...base, content: props.content || '// Write code here\nconsole.log("Hello!");',
        language: props.language || 'javascript', executable: true, width: 500, height: 200,
        style: { fontSize: '14px', fontFamily: 'Fira Code, monospace' }, ...props };
    case 'chart':
      return { ...base, chartType: props.chartType || 'bar',
        data: props.data || { labels: ['A', 'B', 'C', 'D'], values: [30, 60, 45, 80] },
        width: 450, height: 300, style: { colors: ['#6366f1', '#00cec9', '#fdcb6e', '#e17055'] }, ...props };
    case 'math':
      return { ...base, content: props.content || 'E = mc^2',
        style: { fontSize: '28px', color: '#2d3436' }, height: 60, ...props };
    case 'quiz':
      return { ...base, question: props.question || 'What is the answer?',
        options: props.options || ['Option A', 'Option B', 'Option C', 'Option D'],
        correct: props.correct ?? 0, width: 500, height: 280, ...props };
    case 'video':
      return { ...base, src: props.src || '', autoplay: false, width: 500, height: 300, ...props };
    case 'note':
      return { ...base, content: props.content || 'Interactive note...',
        style: { background: '#ffeaa7', color: '#2d3436', padding: '12px', borderRadius: '6px' }, height: 60, ...props };
    case 'divider':
      return { ...base, width: 600, height: 4, style: { background: '#dfe6e9' }, ...props };
    case 'table':
      return { ...base, width: props.width ?? 600, height: props.height ?? 200,
        rows: props.rows ?? 4, cols: props.cols ?? 4,
        data: props.data || Array.from({ length: 4 }, (_, r) =>
          Array.from({ length: 4 }, (_, c) => r === 0 ? `Header ${c + 1}` : `Cell ${r},${c + 1}`)),
        style: { fontSize: '13px', headerBg: '#6366f1', headerColor: '#fff', cellColor: '#333', borderColor: '#dee2e6', fontFamily: 'Inter' },
        ...props };
    case 'connector':
      return { ...base, y: props.y ?? 250, width: props.width ?? 300, height: props.height ?? 30,
        lineStyle: props.lineStyle || 'solid', lineWidth: props.lineWidth ?? 2,
        startCap: props.startCap || 'none', endCap: props.endCap || 'arrow',
        style: { stroke: '#6366f1' }, ...props };
    case 'poll':
      return { ...base, question: props.question || 'What do you think?',
        options: props.options || ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'],
        votes: props.votes || [0, 0, 0, 0], width: 500, height: 240, style: { fontSize: '15px' }, ...props };
    case 'flashcard':
      return { ...base, front: props.front || 'Question / Term', back: props.back || 'Answer / Definition', flipped: false,
        width: props.width ?? 400, height: props.height ?? 250,
        style: { frontBg: '#6366f1', frontColor: '#fff', backBg: '#00b894', backColor: '#fff', fontSize: '20px' }, ...props };
    case 'timer':
      return { ...base, duration: props.duration ?? 300, width: props.width ?? 200, height: props.height ?? 120,
        style: { fontSize: '48px', color: '#e17055', fontFamily: 'Fira Code' }, ...props };
    case 'audio':
      return { ...base, src: props.src || '', width: 300, height: 60, ...props };
    case 'callout':
      return { ...base, content: props.content || 'Important callout text here',
        calloutType: props.calloutType || 'info', width: props.width ?? 500, height: props.height ?? 80,
        style: { fontSize: '15px' }, ...props };
    case 'progress':
      return { ...base, value: props.value ?? 65, max: props.max ?? 100, label: props.label || 'Progress',
        width: props.width ?? 400, height: props.height ?? 40,
        style: { barColor: '#6366f1', bgColor: '#e9ecef', fontSize: '12px' }, ...props };
    case 'icon':
      return { ...base, icon: props.icon || '⭐', width: props.width ?? 80, height: props.height ?? 80,
        style: { fontSize: '48px', color: '#6366f1' }, ...props };
    case 'mermaid':
      return { ...base, content: props.content || 'graph TD\n  A[Start]-->B{Decision}\n  B-->|Yes|C[Do Something]\n  B-->|No|D[End]',
        width: 500, height: 300, ...props };
    case 'timeline':
      return { ...base, width: 800, height: 120,
        entries: props.entries || [{ date: '2020', text: 'Started' }, { date: '2022', text: 'Grew' }, { date: '2024', text: 'Expanded' }],
        ...props };
    case '3d':
      return { ...base, width: 400, height: 300, shape3d: props.shape3d || 'cube', color3d: props.color3d || '#8b5cf6',
        wireframe3d: false, ...props };
    case 'wordcloud':
      return { ...base, width: 500, height: 300,
        words: props.words || [
          { text: 'Education', weight: 10 }, { text: 'Technology', weight: 8 }, { text: 'Learning', weight: 7 },
          { text: 'Interactive', weight: 6 }, { text: 'Innovation', weight: 5 }, { text: 'Design', weight: 4 },
          { text: 'Code', weight: 3 }, { text: 'Slides', weight: 2 },
        ],
        style: { colors: ['#6366f1', '#00cec9', '#fdcb6e', '#e17055', '#00b894'] }, ...props };
    case 'functionplot':
      return { ...base, width: 500, height: 300,
        fn: props.fn || 'Math.sin(x)',
        xMin: props.xMin ?? -10, xMax: props.xMax ?? 10,
        style: { stroke: '#6366f1' }, ...props };
    case 'qrcode':
      return { ...base, width: 200, height: 200,
        qrText: props.qrText || 'https://edusplash.io', ...props };
    case 'embed':
      return { ...base, width: 500, height: 300,
        html: props.html || '<div style="padding:20px;text-align:center">Custom HTML/CSS/JS Embed</div>',
        ...props };
    default:
      return base;
  }
}
