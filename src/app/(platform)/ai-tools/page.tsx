'use client';
/* ═══════════════════════════════════════════════════════
   AI Tools v3.0 — Premium Redesign
   Professional UI with Lucide icons, glass morphism,
   refined typography, and polished micro-interactions
   ═══════════════════════════════════════════════════════ */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Presentation, BookOpen, FileText, FileSpreadsheet,
  GitBranch, CircleHelp, Lightbulb, SearchCode,
  AlignLeft, Mic, Subtitles, MessageCircleQuestion,
  ShieldCheck, PenLine, BookMarked, ClipboardList,
  FlaskConical, FilePen, TableProperties, SlidersHorizontal,
  TrendingUp, Target, Brain, Route,
  Languages, Bot, ImagePlus, Calculator,
  Layers, Network, Search, X, Copy, Download,
  Loader2, Sparkles, Zap, ArrowRight, User,
  type LucideIcon,
} from 'lucide-react';

/* ── Icon mapping for professional look ── */
const TOOL_ICON_MAP: Record<string, { Icon: LucideIcon; gradient: string }> = {
  'slide-gen':       { Icon: Presentation, gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
  'topic-course':    { Icon: BookOpen, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
  'pdf-convert':     { Icon: FileText, gradient: 'linear-gradient(135deg, #f97316, #fb923c)' },
  'ppt-convert':     { Icon: FileSpreadsheet, gradient: 'linear-gradient(135deg, #ef4444, #f87171)' },
  'auto-diagram':    { Icon: GitBranch, gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)' },
  'quiz-gen':        { Icon: CircleHelp, gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  'code-explain':    { Icon: Lightbulb, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  'code-review':     { Icon: SearchCode, gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
  'summarizer':      { Icon: AlignLeft, gradient: 'linear-gradient(135deg, #8b5cf6, #c084fc)' },
  'voice-narration': { Icon: Mic, gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  'subtitle-gen':    { Icon: Subtitles, gradient: 'linear-gradient(135deg, #14b8a6, #2dd4bf)' },
  'doubt-solver':    { Icon: MessageCircleQuestion, gradient: 'linear-gradient(135deg, #6366f1, #a5b4fc)' },
  'plagiarism':      { Icon: ShieldCheck, gradient: 'linear-gradient(135deg, #22c55e, #4ade80)' },
  'grammar':         { Icon: PenLine, gradient: 'linear-gradient(135deg, #f472b6, #fb7185)' },
  'citations':       { Icon: BookMarked, gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' },
  'lesson-plan':     { Icon: ClipboardList, gradient: 'linear-gradient(135deg, #f97316, #fdba74)' },
  'lab-manual':      { Icon: FlaskConical, gradient: 'linear-gradient(135deg, #a855f7, #c084fc)' },
  'assignment':      { Icon: FilePen, gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
  'rubric-gen':      { Icon: TableProperties, gradient: 'linear-gradient(135deg, #0891b2, #22d3ee)' },
  'difficulty':      { Icon: SlidersHorizontal, gradient: 'linear-gradient(135deg, #eab308, #facc15)' },
  'engagement':      { Icon: TrendingUp, gradient: 'linear-gradient(135deg, #10b981, #6ee7b7)' },
  'recommend':       { Icon: Target, gradient: 'linear-gradient(135deg, #ef4444, #fca5a5)' },
  'mindmap':         { Icon: Brain, gradient: 'linear-gradient(135deg, #d946ef, #e879f9)' },
  'learning-path':   { Icon: Route, gradient: 'linear-gradient(135deg, #3b82f6, #93c5fd)' },
  'translate':       { Icon: Languages, gradient: 'linear-gradient(135deg, #14b8a6, #5eead4)' },
  'chatbot':         { Icon: Bot, gradient: 'linear-gradient(135deg, #6366f1, #a5b4fc)' },
  'image-gen':       { Icon: ImagePlus, gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)' },
  'formula-solver':  { Icon: Calculator, gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)' },
  'flashcard-gen':   { Icon: Layers, gradient: 'linear-gradient(135deg, #a855f7, #d8b4fe)' },
  'concept-map':     { Icon: Network, gradient: 'linear-gradient(135deg, #0d9488, #2dd4bf)' },
};

/* Helper to render tool icon */
const ToolIcon = ({ toolId, size = 20 }: { toolId: string; size?: number }) => {
  const mapping = TOOL_ICON_MAP[toolId];
  if (!mapping) return <Sparkles size={size} />;
  const { Icon } = mapping;
  return <Icon size={size} strokeWidth={1.8} />;
};

const ToolIconBox = ({ toolId, size = 42 }: { toolId: string; size?: number }) => {
  const mapping = TOOL_ICON_MAP[toolId];
  const gradient = mapping?.gradient || 'linear-gradient(135deg, #6366f1, #818cf8)';
  return (
    <div className="ai-tool-icon" style={{ width: size, height: size, background: gradient, color: '#fff' }}>
      <ToolIcon toolId={toolId} size={Math.round(size * 0.48)} />
    </div>
  );
};

/* ── Tool definitions ── */
const AI_TOOLS = [
  { id: 'slide-gen', name: 'AI Slide Generator', icon: '🎨', desc: 'Generate complete presentations from a topic or prompt', category: 'creation', tag: 'Popular' },
  { id: 'topic-course', name: 'Topic → Course', icon: '📚', desc: 'Transform any topic into a full structured course with modules', category: 'creation', tag: 'New' },
  { id: 'pdf-convert', name: 'PDF → Slides', icon: '📄', desc: 'Convert PDF documents into editable slide presentations', category: 'conversion', tag: '' },
  { id: 'ppt-convert', name: 'PPT Import', icon: '📊', desc: 'Import and convert PowerPoint files with full fidelity', category: 'conversion', tag: '' },
  { id: 'auto-diagram', name: 'Auto Diagram', icon: '🔀', desc: 'Generate flowcharts, mind maps, and diagrams from text', category: 'creation', tag: 'Popular' },
  { id: 'quiz-gen', name: 'Quiz Generator', icon: '❓', desc: 'Create MCQs, fill-in-blanks, and matching from content', category: 'assessment', tag: '' },
  { id: 'code-explain', name: 'Code Explainer', icon: '💡', desc: 'Get line-by-line explanations of any code snippet', category: 'coding', tag: '' },
  { id: 'code-review', name: 'Code Review', icon: '🔍', desc: 'AI-powered code review with suggestions and best practices', category: 'coding', tag: '' },
  { id: 'summarizer', name: 'Content Summary', icon: '📝', desc: 'Summarize long documents, articles, or lecture transcripts', category: 'content', tag: '' },
  { id: 'voice-narration', name: 'Voice Narration', icon: '🎙️', desc: 'Generate natural voice-over for slides with multiple voices', category: 'media', tag: 'New' },
  { id: 'subtitle-gen', name: 'Subtitle Generator', icon: '💬', desc: 'Auto-generate subtitles and captions for video content', category: 'media', tag: '' },
  { id: 'doubt-solver', name: 'Doubt Solver', icon: '🤔', desc: 'AI-powered Q&A for student doubts with step-by-step solutions', category: 'learning', tag: '' },
  { id: 'plagiarism', name: 'Plagiarism Detector', icon: '🛡️', desc: 'Check content originality with detailed similarity reports', category: 'content', tag: '' },
  { id: 'grammar', name: 'Grammar & Style', icon: '✏️', desc: 'Fix grammar, improve clarity, and enhance writing style', category: 'content', tag: '' },
  { id: 'citations', name: 'Research Citations', icon: '📖', desc: 'Auto-generate citations in APA, MLA, IEEE formats', category: 'research', tag: '' },
  { id: 'lesson-plan', name: 'Lesson Planner', icon: '📋', desc: 'Create structured lesson plans with objectives and activities', category: 'teaching', tag: '' },
  { id: 'lab-manual', name: 'Lab Manual Gen', icon: '🧪', desc: 'Generate lab manuals with procedures, safety, and assessments', category: 'teaching', tag: '' },
  { id: 'assignment', name: 'Assignment Creator', icon: '📝', desc: 'Create assignments with rubrics, guidelines, and deadlines', category: 'assessment', tag: '' },
  { id: 'rubric-gen', name: 'Rubric Generator', icon: '📊', desc: 'Generate detailed grading rubrics for any assignment type', category: 'assessment', tag: '' },
  { id: 'difficulty', name: 'Difficulty Adjuster', icon: '⚖️', desc: 'Automatically adjust content difficulty level for any audience', category: 'content', tag: '' },
  { id: 'engagement', name: 'Engagement Analyzer', icon: '📈', desc: 'Analyze and score content for student engagement potential', category: 'analytics', tag: '' },
  { id: 'recommend', name: 'Recommendations', icon: '🎯', desc: 'AI-powered content and resource recommendations', category: 'learning', tag: '' },
  { id: 'mindmap', name: 'Mind Map Creator', icon: '🧠', desc: 'Generate interactive mind maps from any topic or document', category: 'creation', tag: '' },
  { id: 'learning-path', name: 'Learning Path Gen', icon: '🗺️', desc: 'Create personalized learning paths based on goals and skills', category: 'learning', tag: '' },
  { id: 'translate', name: 'Multi-Language', icon: '🌍', desc: 'Translate content into 40+ languages preserving formatting', category: 'content', tag: '' },
  { id: 'chatbot', name: 'AI Chatbot', icon: '🤖', desc: 'Interactive AI assistant for teaching and learning', category: 'learning', tag: 'Popular' },
  { id: 'image-gen', name: 'Image Generator', icon: '🖼️', desc: 'Generate educational illustrations and diagrams from prompts', category: 'media', tag: 'New' },
  { id: 'formula-solver', name: 'Formula Solver', icon: '🧮', desc: 'Solve and explain mathematical formulas step by step', category: 'learning', tag: '' },
  { id: 'flashcard-gen', name: 'Flashcard Creator', icon: '🃏', desc: 'Auto-generate flashcard decks from course material', category: 'assessment', tag: '' },
  { id: 'concept-map', name: 'Concept Mapper', icon: '🔗', desc: 'Map relationships between concepts for better understanding', category: 'creation', tag: '' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Tools', count: AI_TOOLS.length },
  { id: 'creation', label: 'Creation', count: AI_TOOLS.filter(t => t.category === 'creation').length },
  { id: 'assessment', label: 'Assessment', count: AI_TOOLS.filter(t => t.category === 'assessment').length },
  { id: 'content', label: 'Content', count: AI_TOOLS.filter(t => t.category === 'content').length },
  { id: 'coding', label: 'Coding', count: AI_TOOLS.filter(t => t.category === 'coding').length },
  { id: 'learning', label: 'Learning', count: AI_TOOLS.filter(t => t.category === 'learning').length },
  { id: 'media', label: 'Media', count: AI_TOOLS.filter(t => t.category === 'media').length },
  { id: 'teaching', label: 'Teaching', count: AI_TOOLS.filter(t => t.category === 'teaching').length },
  { id: 'conversion', label: 'Conversion', count: AI_TOOLS.filter(t => t.category === 'conversion').length },
  { id: 'research', label: 'Research', count: AI_TOOLS.filter(t => t.category === 'research').length },
];

const VOICES = [
  { id: 'aria', name: 'Aria', accent: 'US English', gender: 'Female' },
  { id: 'james', name: 'James', accent: 'British', gender: 'Male' },
  { id: 'priya', name: 'Priya', accent: 'Indian', gender: 'Female' },
  { id: 'carlos', name: 'Carlos', accent: 'Spanish', gender: 'Male' },
  { id: 'yuki', name: 'Yuki', accent: 'Japanese', gender: 'Female' },
  { id: 'alex', name: 'Alex', accent: 'Australian', gender: 'Non-binary' },
];

const TRANSLATE_LANGS = [
  'Spanish', 'French', 'German', 'Hindi', 'Mandarin', 'Japanese', 'Korean',
  'Arabic', 'Portuguese', 'Russian', 'Italian', 'Turkish', 'Thai', 'Vietnamese',
  'Dutch', 'Polish', 'Swedish', 'Indonesian', 'Bengali', 'Urdu',
];

/* Chat message type */
interface ChatMessage { role: 'user' | 'ai'; content: string; timestamp: string; }

interface StructuredSection {
  title: string;
  items: string[];
}

interface StructuredRisk {
  risk: string;
  mitigation: string;
}

interface StructuredTable {
  columns: string[];
  rows: string[][];
}

interface StructuredOutput {
  summary?: string;
  highlights?: string[];
  checklist?: string[];
  sections?: StructuredSection[];
  table?: StructuredTable;
  risks?: StructuredRisk[];
  nextSteps?: string[];
}

interface GenericToolResult {
  markdown: string;
  raw: string;
  generatedAt: string;
  structured?: StructuredOutput | null;
  machine?: Record<string, unknown> | null;
}

const ADVANCED_TOOL_SCHEMA_HINTS: Record<string, string> = {
  'rubric-gen': 'Include a "rubricMatrix" array with rows shaped like {"criterion":"...","weight":"...","beginner":"...","proficient":"...","advanced":"..."}.',
  'flashcard-gen': 'Include a "flashcards" array with cards shaped like {"front":"...","back":"...","difficulty":"Easy|Medium|Hard","tag":"..."}.',
  'topic-course': 'Include a "timeline" array with entries shaped like {"phase":"...","duration":"...","outcome":"..."}.',
  assignment: 'Include a "deliverables" array of strings and a "milestones" array shaped like {"name":"...","due":"..."}.',
  'formula-solver': 'Include a "solutionSteps" array shaped like {"step":"...","reason":"..."} and a "finalAnswer" string.',
  engagement: 'Include an "engagementScore" number (0-100), a "scoreBreakdown" array shaped like {"dimension":"...","score":"..."}, and an "improvements" array of strings.',
  recommend: 'Include a "recommendations" array shaped like {"title":"...","priority":"High|Medium|Low","reason":"...","effort":"..."}.',
};

const jsonBlockRegex = /```json\s*([\s\S]*?)```/i;
const taggedBlockRegex = /<structured_output>([\s\S]*?)<\/structured_output>/i;

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map(v => (typeof v === 'string' ? v.trim() : String(v ?? '').trim())).filter(Boolean);
};

const toRecordArray = (value: unknown): Record<string, unknown>[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(item => item && typeof item === 'object' && !Array.isArray(item)) as Record<string, unknown>[];
};

const normalizeStructuredOutput = (value: unknown): StructuredOutput | null => {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Record<string, unknown>;

  const sections = Array.isArray(candidate.sections)
    ? candidate.sections
      .map(section => {
        if (!section || typeof section !== 'object') return null;
        const sectionObj = section as Record<string, unknown>;
        const title = typeof sectionObj.title === 'string' ? sectionObj.title.trim() : '';
        const items = toStringArray(sectionObj.items);
        if (!title && items.length === 0) return null;
        return { title: title || 'Section', items };
      })
      .filter((section): section is StructuredSection => section !== null)
    : [];

  const risks = Array.isArray(candidate.risks)
    ? candidate.risks
      .map(item => {
        if (!item || typeof item !== 'object') return null;
        const riskObj = item as Record<string, unknown>;
        const risk = typeof riskObj.risk === 'string' ? riskObj.risk.trim() : '';
        const mitigation = typeof riskObj.mitigation === 'string' ? riskObj.mitigation.trim() : '';
        if (!risk && !mitigation) return null;
        return { risk: risk || 'Risk', mitigation: mitigation || 'Mitigation pending' };
      })
      .filter((item): item is StructuredRisk => item !== null)
    : [];

  const tableCandidate = candidate.table;
  const table = tableCandidate && typeof tableCandidate === 'object'
    ? (() => {
      const tableObj = tableCandidate as Record<string, unknown>;
      const columns = toStringArray(tableObj.columns);
      const rowsSource = Array.isArray(tableObj.rows) ? tableObj.rows : [];
      const rows = rowsSource
        .map(row => Array.isArray(row)
          ? row.map(cell => (typeof cell === 'string' ? cell : String(cell ?? '')))
          : [])
        .filter(row => row.length > 0);
      if (columns.length === 0 || rows.length === 0) return undefined;
      return { columns, rows };
    })()
    : undefined;

  const normalized: StructuredOutput = {
    summary: typeof candidate.summary === 'string' ? candidate.summary.trim() : undefined,
    highlights: toStringArray(candidate.highlights),
    checklist: toStringArray(candidate.checklist),
    sections,
    table,
    risks,
    nextSteps: toStringArray(candidate.nextSteps),
  };

  const hasContent = Boolean(
    normalized.summary ||
    (normalized.highlights && normalized.highlights.length > 0) ||
    (normalized.checklist && normalized.checklist.length > 0) ||
    (normalized.sections && normalized.sections.length > 0) ||
    normalized.table ||
    (normalized.risks && normalized.risks.length > 0) ||
    (normalized.nextSteps && normalized.nextSteps.length > 0)
  );

  return hasContent ? normalized : null;
};

const parseStructuredReply = (reply: string): { markdown: string; structured: StructuredOutput | null; machine: Record<string, unknown> | null } => {
  const source = reply || '';
  const taggedMatch = source.match(taggedBlockRegex);
  const jsonMatch = source.match(jsonBlockRegex);
  const block = taggedMatch?.[1] || jsonMatch?.[1] || '';

  let structured: StructuredOutput | null = null;
  let machine: Record<string, unknown> | null = null;
  if (block) {
    try {
      const parsed = JSON.parse(block.trim());
      structured = normalizeStructuredOutput(parsed);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        machine = parsed as Record<string, unknown>;
      }
    } catch {
      structured = null;
      machine = null;
    }
  }

  const markdown = source
    .replace(taggedBlockRegex, '')
    .replace(jsonBlockRegex, '')
    .trim();

  return {
    markdown: markdown || source.trim() || 'No output generated.',
    structured,
    machine,
  };
};

type AdvancedFieldType = 'text' | 'textarea' | 'select' | 'number' | 'toggle';

interface AdvancedToolField {
  key: string;
  label: string;
  type: AdvancedFieldType;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  rows?: number;
}

interface AdvancedToolConfig {
  objective: string;
  outputLabel: string;
  fields: AdvancedToolField[];
}

const ADVANCED_TOOL_CONFIG: Record<string, AdvancedToolConfig> = {
  'topic-course': {
    objective: 'Generate a full course blueprint with modules, outcomes, assessments, and delivery plan.',
    outputLabel: 'Course Blueprint',
    fields: [
      { key: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g., Machine Learning for Working Professionals', defaultValue: '' },
      { key: 'level', label: 'Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'], defaultValue: 'Intermediate' },
      { key: 'duration', label: 'Course Duration', type: 'select', options: ['2 weeks', '4 weeks', '8 weeks', '12 weeks'], defaultValue: '8 weeks' },
      { key: 'constraints', label: 'Constraints / Notes', type: 'textarea', rows: 4, placeholder: 'Audience, prerequisites, delivery mode, grading policy…', defaultValue: '' },
    ],
  },
  'pdf-convert': {
    objective: 'Create a conversion-ready slide outline from PDF source notes with layout mapping suggestions.',
    outputLabel: 'PDF Conversion Plan',
    fields: [
      { key: 'source', label: 'PDF Source Summary', type: 'textarea', rows: 5, placeholder: 'Paste key sections / abstract / headings from PDF', defaultValue: '' },
      { key: 'slideCount', label: 'Target Slides', type: 'number', defaultValue: '12' },
      { key: 'style', label: 'Design Style', type: 'select', options: ['Corporate', 'Academic', 'Minimal', 'Visual-heavy'], defaultValue: 'Corporate' },
      { key: 'includeSpeakerNotes', label: 'Include Speaker Notes', type: 'toggle', defaultValue: 'true' },
    ],
  },
  'ppt-convert': {
    objective: 'Provide a robust PPT import execution plan with cleanup actions and fidelity checks.',
    outputLabel: 'PPT Import QA Plan',
    fields: [
      { key: 'deckType', label: 'Deck Type', type: 'select', options: ['Sales', 'Lecture', 'Technical', 'Mixed'], defaultValue: 'Mixed' },
      { key: 'knownIssues', label: 'Known Issues', type: 'textarea', rows: 4, placeholder: 'e.g., overlapping titles, slide numbers, font mismatch', defaultValue: '' },
      { key: 'priority', label: 'Priority', type: 'select', options: ['Fidelity', 'Editability', 'Balanced'], defaultValue: 'Balanced' },
      { key: 'deadline', label: 'Delivery Deadline', type: 'text', placeholder: 'e.g., 24 hours', defaultValue: '' },
    ],
  },
  'auto-diagram': {
    objective: 'Generate structured diagram specs (flowchart/mindmap/system design) from text input.',
    outputLabel: 'Diagram Specification',
    fields: [
      { key: 'input', label: 'Source Text', type: 'textarea', rows: 5, placeholder: 'Process, architecture, or concept text', defaultValue: '' },
      { key: 'diagramType', label: 'Diagram Type', type: 'select', options: ['Flowchart', 'Mind Map', 'Sequence', 'Architecture'], defaultValue: 'Flowchart' },
      { key: 'complexity', label: 'Complexity', type: 'select', options: ['Simple', 'Medium', 'Detailed'], defaultValue: 'Medium' },
    ],
  },
  'subtitle-gen': {
    objective: 'Generate clean timed subtitle draft with readability and punctuation optimization.',
    outputLabel: 'Subtitle Draft',
    fields: [
      { key: 'transcript', label: 'Transcript / Audio Text', type: 'textarea', rows: 5, placeholder: 'Paste transcript', defaultValue: '' },
      { key: 'language', label: 'Language', type: 'select', options: ['English', 'Spanish', 'Hindi', 'French'], defaultValue: 'English' },
      { key: 'style', label: 'Subtitle Style', type: 'select', options: ['Standard', 'Short lines', 'Educational'], defaultValue: 'Educational' },
    ],
  },
  'doubt-solver': {
    objective: 'Provide step-by-step pedagogical solution with misconception checks.',
    outputLabel: 'Doubt Resolution',
    fields: [
      { key: 'question', label: 'Student Question', type: 'textarea', rows: 4, placeholder: 'Enter student doubt', defaultValue: '' },
      { key: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g., Calculus', defaultValue: '' },
      { key: 'grade', label: 'Grade / Level', type: 'select', options: ['School', 'Undergraduate', 'Graduate'], defaultValue: 'Undergraduate' },
    ],
  },
  grammar: {
    objective: 'Rewrite and improve grammar/style while preserving meaning and tone constraints.',
    outputLabel: 'Edited Content',
    fields: [
      { key: 'text', label: 'Input Text', type: 'textarea', rows: 6, placeholder: 'Paste writing to improve', defaultValue: '' },
      { key: 'style', label: 'Target Style', type: 'select', options: ['Academic', 'Business', 'Concise', 'Conversational'], defaultValue: 'Academic' },
      { key: 'strictness', label: 'Edit Strictness', type: 'select', options: ['Light', 'Standard', 'Aggressive'], defaultValue: 'Standard' },
    ],
  },
  'lab-manual': {
    objective: 'Generate complete lab manual with objectives, materials, procedure, safety, rubric.',
    outputLabel: 'Lab Manual',
    fields: [
      { key: 'experiment', label: 'Experiment Topic', type: 'text', placeholder: 'e.g., Ohm’s Law Verification', defaultValue: '' },
      { key: 'level', label: 'Academic Level', type: 'select', options: ['School', 'Diploma', 'Undergraduate'], defaultValue: 'Undergraduate' },
      { key: 'duration', label: 'Lab Duration', type: 'text', placeholder: 'e.g., 2 hours', defaultValue: '' },
    ],
  },
  assignment: {
    objective: 'Create assignment set with rubric, deliverables, and anti-plagiarism guidance.',
    outputLabel: 'Assignment Pack',
    fields: [
      { key: 'topic', label: 'Assignment Topic', type: 'text', placeholder: 'e.g., Database Normalization', defaultValue: '' },
      { key: 'difficulty', label: 'Difficulty', type: 'select', options: ['Easy', 'Medium', 'Hard'], defaultValue: 'Medium' },
      { key: 'type', label: 'Type', type: 'select', options: ['Theory', 'Coding', 'Case Study', 'Mixed'], defaultValue: 'Mixed' },
      { key: 'deadline', label: 'Deadline Window', type: 'text', placeholder: 'e.g., 7 days', defaultValue: '' },
    ],
  },
  'rubric-gen': {
    objective: 'Generate criterion-based grading rubric with score bands and evidence descriptors.',
    outputLabel: 'Grading Rubric',
    fields: [
      { key: 'task', label: 'Task / Assignment', type: 'text', placeholder: 'e.g., Final project presentation', defaultValue: '' },
      { key: 'criteriaCount', label: 'Criteria Count', type: 'number', defaultValue: '5' },
      { key: 'scale', label: 'Scale', type: 'select', options: ['0-4', '0-5', '0-10', 'Percent'], defaultValue: '0-5' },
    ],
  },
  difficulty: {
    objective: 'Adjust material to requested difficulty while preserving learning goals.',
    outputLabel: 'Difficulty-Adjusted Content',
    fields: [
      { key: 'content', label: 'Input Content', type: 'textarea', rows: 5, placeholder: 'Paste lesson content', defaultValue: '' },
      { key: 'fromLevel', label: 'Current Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'], defaultValue: 'Intermediate' },
      { key: 'toLevel', label: 'Target Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'], defaultValue: 'Beginner' },
    ],
  },
  engagement: {
    objective: 'Score engagement quality and provide concrete improvement actions.',
    outputLabel: 'Engagement Report',
    fields: [
      { key: 'content', label: 'Content to Analyze', type: 'textarea', rows: 5, placeholder: 'Paste script/slides content', defaultValue: '' },
      { key: 'audience', label: 'Audience Type', type: 'select', options: ['School', 'College', 'Corporate'], defaultValue: 'College' },
    ],
  },
  recommend: {
    objective: 'Generate personalized recommendations for resources, activities, and next actions.',
    outputLabel: 'Recommendations',
    fields: [
      { key: 'profile', label: 'Learner Profile', type: 'textarea', rows: 4, placeholder: 'Goals, strengths, gaps', defaultValue: '' },
      { key: 'timeBudget', label: 'Weekly Time Budget', type: 'text', placeholder: 'e.g., 6 hours/week', defaultValue: '' },
    ],
  },
  'image-gen': {
    objective: 'Produce high-quality educational image prompts and style-safe generation instructions.',
    outputLabel: 'Image Prompt Package',
    fields: [
      { key: 'prompt', label: 'Image Intent', type: 'textarea', rows: 4, placeholder: 'Describe what image you need', defaultValue: '' },
      { key: 'style', label: 'Visual Style', type: 'select', options: ['Flat vector', 'Realistic', 'Isometric', 'Infographic'], defaultValue: 'Infographic' },
      { key: 'ratio', label: 'Aspect Ratio', type: 'select', options: ['1:1', '16:9', '4:3', '9:16'], defaultValue: '16:9' },
    ],
  },
  'formula-solver': {
    objective: 'Solve formulas step-by-step with method explanation and validation.',
    outputLabel: 'Formula Solution',
    fields: [
      { key: 'equation', label: 'Equation / Formula', type: 'textarea', rows: 3, placeholder: 'e.g., solve x^2 - 5x + 6 = 0', defaultValue: '' },
      { key: 'method', label: 'Preferred Method', type: 'select', options: ['Auto', 'Algebraic', 'Numeric', 'Graphical'], defaultValue: 'Auto' },
      { key: 'showChecks', label: 'Show Verification', type: 'toggle', defaultValue: 'true' },
    ],
  },
  'flashcard-gen': {
    objective: 'Create study flashcards with spaced repetition tags and difficulty labels.',
    outputLabel: 'Flashcard Deck',
    fields: [
      { key: 'material', label: 'Source Material', type: 'textarea', rows: 5, placeholder: 'Paste notes/chapter summary', defaultValue: '' },
      { key: 'count', label: 'Card Count', type: 'number', defaultValue: '20' },
      { key: 'mode', label: 'Card Mode', type: 'select', options: ['Term/Definition', 'Q&A', 'Mixed'], defaultValue: 'Mixed' },
    ],
  },
  'concept-map': {
    objective: 'Map concept relationships and dependencies with prerequisite flow.',
    outputLabel: 'Concept Relationship Map',
    fields: [
      { key: 'topic', label: 'Topic / Domain', type: 'text', placeholder: 'e.g., Operating Systems', defaultValue: '' },
      { key: 'concepts', label: 'Concept List', type: 'textarea', rows: 4, placeholder: 'Comma-separated or bullet list concepts', defaultValue: '' },
      { key: 'depth', label: 'Relationship Depth', type: 'select', options: ['Basic', 'Intermediate', 'Deep'], defaultValue: 'Intermediate' },
    ],
  },
};

export default function AIToolsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [toolError, setToolError] = useState('');
  const [toolInfo, setToolInfo] = useState('');

  /* Slide Generator */
  const [slidePrompt, setSlidePrompt] = useState('');
  const [slideCount, setSlideCount] = useState(8);
  const [slideTheme, setSlideTheme] = useState('professional');
  const [generatedSlides, setGeneratedSlides] = useState<{ title: string; content: string; layout: string }[]>([]);

  /* Quiz Generator */
  const [quizTopic, setQuizTopic] = useState('');
  const [quizCount, setQuizCount] = useState(10);
  const [quizType, setQuizType] = useState('mcq');
  const [quizDifficulty, setQuizDifficulty] = useState('medium');
  const [generatedQuiz, setGeneratedQuiz] = useState<{ q: string; opts: string[]; answer: number; explanation: string }[]>([]);

  /* Code Explainer */
  const [codeInput, setCodeInput] = useState('');
  const [codeExplanation, setCodeExplanation] = useState('');
  const [codeLang, setCodeLang] = useState('python');

  /* Voice Narration */
  const [narrationText, setNarrationText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('aria');
  const [narrationSpeed, setNarrationSpeed] = useState(1.0);
  const [narrationGenerated, setNarrationGenerated] = useState(false);
  const [narrationOutput, setNarrationOutput] = useState('');

  /* Chatbot */
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: 'Hello! I\'m your AI teaching assistant. Ask me anything about your courses, assignments, or concepts.', timestamp: new Date().toLocaleTimeString() },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatRole, setChatRole] = useState('teaching-assistant');
  const [chatSubject, setChatSubject] = useState('general');
  const [chatResponseStyle, setChatResponseStyle] = useState('detailed');
  const [chatIncludeExamples, setChatIncludeExamples] = useState(true);

  /* Plagiarism */
  const [plagiarismText, setPlagiarismText] = useState('');
  const [plagiarismResult, setPlagiarismResult] = useState<{ score: number; sources: { url: string; match: number }[] } | null>(null);

  /* Translation */
  const [translateFrom, setTranslateFrom] = useState('English');
  const [translateTo, setTranslateTo] = useState('Spanish');
  const [translateInput, setTranslateInput] = useState('');
  const [translateOutput, setTranslateOutput] = useState('');

  /* Lesson Planner */
  const [lessonTopic, setLessonTopic] = useState('');
  const [lessonGrade, setLessonGrade] = useState('College');
  const [lessonDuration, setLessonDuration] = useState('60');
  const [generatedLesson, setGeneratedLesson] = useState<{ section: string; time: string; activity: string }[]>([]);

  /* Mind Map */
  const [mindmapTopic, setMindmapTopic] = useState('');
  const [mindmapNodes, setMindmapNodes] = useState<{ id: string; label: string; children: string[] }[]>([]);

  /* Learning Path */
  const [pathGoal, setPathGoal] = useState('');
  const [pathSteps, setPathSteps] = useState<{ step: number; title: string; duration: string; resources: string; status: string }[]>([]);

  /* Summary */
  const [summaryInput, setSummaryInput] = useState('');
  const [summaryOutput, setSummaryOutput] = useState('');
  const [summaryLength, setSummaryLength] = useState<'brief' | 'standard' | 'detailed'>('standard');

  /* Citation */
  const [citationFormat, setCitationFormat] = useState('APA');
  const [citationInput, setCitationInput] = useState('');
  const [citationOutput, setCitationOutput] = useState('');

  /* Usage stats */
  const [usageStats, setUsageStats] = useState({
    totalRequests: 1247, tokensUsed: 342891, slidesGenerated: 89,
    quizzesCreated: 34, codeExplained: 156, narrations: 23,
  });

  /* Generic tools (all non-custom panels) */
  const [genericInput, setGenericInput] = useState('');
  const [genericAudience, setGenericAudience] = useState('students');
  const [genericTone, setGenericTone] = useState('professional');
  const [genericLength, setGenericLength] = useState('standard');
  const [genericFormat, setGenericFormat] = useState('markdown');
  const [genericIncludeExamples, setGenericIncludeExamples] = useState(true);
  const [genericResult, setGenericResult] = useState<GenericToolResult | null>(null);
  const [advancedInputs, setAdvancedInputs] = useState<Record<string, Record<string, string>>>({});
  const [advancedResults, setAdvancedResults] = useState<Record<string, GenericToolResult | null>>({});

  const chatEndRef = useRef<HTMLDivElement>(null);

  const filtered = AI_TOOLS.filter(t =>
    (category === 'all' || t.category === category) &&
    (search === '' || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const bumpUsage = (toolId: string, tokenEstimate = 1200) => {
    setUsageStats(prev => ({
      ...prev,
      totalRequests: prev.totalRequests + 1,
      tokensUsed: prev.tokensUsed + tokenEstimate,
      slidesGenerated: toolId === 'slide-gen' ? prev.slidesGenerated + slideCount : prev.slidesGenerated,
      quizzesCreated: toolId === 'quiz-gen' ? prev.quizzesCreated + 1 : prev.quizzesCreated,
      codeExplained: (toolId === 'code-explain' || toolId === 'code-review') ? prev.codeExplained + 1 : prev.codeExplained,
      narrations: toolId === 'voice-narration' ? prev.narrations + 1 : prev.narrations,
    }));
  };

  const callAI = async (messages: { role: 'user' | 'system' | 'assistant'; content: string }[]) => {
    const maxAttempts = 2;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (attempt > 1) setToolInfo('Retrying AI request…');

        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
        });

        if (!res.ok) throw new Error(`AI endpoint error (${res.status})`);

        const data = await res.json();
        const reply = ((data?.reply as string) || '').trim();

        if (!reply || reply.startsWith('AI unavailable:')) {
          throw new Error(reply || 'Empty AI response');
        }

        setToolError('');
        setToolInfo('');
        return reply;
      } catch (error) {
        if (attempt === maxAttempts) {
          const message = error instanceof Error ? error.message : 'Unknown AI error';
          setToolError(`AI unavailable right now. ${message}`);
          setToolInfo('');
          return 'AI is temporarily unavailable. Please check Ollama and try again.';
        }
        await new Promise(resolve => setTimeout(resolve, 650));
      }
    }

    return 'AI is temporarily unavailable. Please check Ollama and try again.';
  };

  const runGenericTool = async () => {
    if (!activeTool || !genericInput.trim()) return;
    const tool = AI_TOOLS.find(t => t.id === activeTool);
    if (!tool) return;

    setProcessing(true);
    try {
      const schemaHint = ADVANCED_TOOL_SCHEMA_HINTS[tool.id] || '';
      const systemPrompt = `You are an expert assistant for ${tool.name}. Return high-quality ${genericFormat} output for education workflows.`;
      const userPrompt = `Tool: ${tool.name}\nDescription: ${tool.desc}\nAudience: ${genericAudience}\nTone: ${genericTone}\nLength: ${genericLength}\nInclude examples: ${genericIncludeExamples ? 'yes' : 'no'}\n\nInput:\n${genericInput}\n\nOutput rules:\n1) Start with a concise executive summary.\n2) Provide actionable sections.\n3) Include implementation-ready details (templates/checklists where relevant).\n4) Keep formatting clean and professional.\n5) After markdown content, append one JSON code block using this exact shape:\n\`\`\`json\n{\n  "summary": "...",\n  "highlights": ["..."],\n  "checklist": ["..."],\n  "sections": [{"title":"...","items":["..."]}],\n  "table": {"columns": ["..."], "rows": [["..."]]},\n  "risks": [{"risk":"...", "mitigation":"..."}],\n  "nextSteps": ["..."]\n}\n\`\`\`\nOnly include keys that are relevant.${schemaHint ? `\n6) ${schemaHint}` : ''}`;
      const reply = await callAI([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]);
      const parsed = parseStructuredReply(reply || '');

      setGenericResult({
        markdown: parsed.markdown,
        structured: parsed.structured,
        machine: parsed.machine,
        raw: JSON.stringify({ tool: tool.id, audience: genericAudience, tone: genericTone, length: genericLength, input: genericInput, output: reply || '', structured: parsed.structured, machine: parsed.machine }, null, 2),
        generatedAt: new Date().toLocaleString(),
      });
      bumpUsage(tool.id, Math.max(900, Math.min(5000, genericInput.length * 2)));
    } finally {
      setProcessing(false);
    }
  };

  const getAdvancedValue = (toolId: string, field: AdvancedToolField): string => {
    const state = advancedInputs[toolId] || {};
    if (state[field.key] !== undefined) return state[field.key];
    return field.defaultValue || '';
  };

  const setAdvancedValue = (toolId: string, key: string, value: string) => {
    setAdvancedInputs(prev => ({
      ...prev,
      [toolId]: {
        ...(prev[toolId] || {}),
        [key]: value,
      },
    }));
  };

  const runAdvancedTool = async (toolId: string) => {
    const config = ADVANCED_TOOL_CONFIG[toolId];
    if (!config) return;

    const payload: Record<string, string> = {};
    for (const field of config.fields) {
      payload[field.key] = getAdvancedValue(toolId, field);
    }

    const hasAnyInput = Object.values(payload).some(v => (v || '').trim().length > 0);
    if (!hasAnyInput) return;

    setProcessing(true);
    try {
      const tool = AI_TOOLS.find(t => t.id === toolId);
      const schemaHint = ADVANCED_TOOL_SCHEMA_HINTS[toolId] || '';
      const systemPrompt = `You are an expert assistant for ${tool?.name || toolId}. Produce professional, implementation-ready output in clean markdown.`;
      const userPrompt = `Objective: ${config.objective}\nAudience: ${genericAudience}\nTone: ${genericTone}\nLength: ${genericLength}\nOutput Format: ${genericFormat}\nInclude Examples: ${genericIncludeExamples ? 'yes' : 'no'}\n\nInputs:\n${JSON.stringify(payload, null, 2)}\n\nReturn:\n1) Executive summary\n2) Main structured output\n3) Action checklist\n4) Risks and mitigation\n5) Optional next-step automation suggestions\n6) After markdown, append exactly one JSON code block with this schema:\n\`\`\`json\n{\n  "summary": "...",\n  "highlights": ["..."],\n  "checklist": ["..."],\n  "sections": [{"title":"...","items":["..."]}],\n  "table": {"columns": ["..."], "rows": [["..."]]},\n  "risks": [{"risk":"...", "mitigation":"..."}],\n  "nextSteps": ["..."]\n}\n\`\`\`\nOnly include keys that are relevant.${schemaHint ? `\n7) ${schemaHint}` : ''}`;

      const reply = await callAI([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]);
      const parsed = parseStructuredReply(reply || '');

      setAdvancedResults(prev => ({
        ...prev,
        [toolId]: {
          markdown: parsed.markdown,
          structured: parsed.structured,
          machine: parsed.machine,
          raw: JSON.stringify({ toolId, payload, output: reply || '', structured: parsed.structured, machine: parsed.machine }, null, 2),
          generatedAt: new Date().toLocaleString(),
        },
      }));
      bumpUsage(toolId, Math.max(1000, JSON.stringify(payload).length * 3));
    } finally {
      setProcessing(false);
    }
  };

  const copyGenericOutput = async () => {
    if (!genericResult) return;
    await navigator.clipboard.writeText(genericResult.markdown);
  };

  const getResultJson = (result: GenericToolResult): string => {
    let rawPayload: Record<string, unknown> = {};
    try {
      rawPayload = JSON.parse(result.raw || '{}') as Record<string, unknown>;
    } catch {
      rawPayload = {};
    }
    const payload = result.machine || result.structured || rawPayload;
    return JSON.stringify(payload, null, 2);
  };

  const copyResultJson = async (result: GenericToolResult) => {
    await navigator.clipboard.writeText(getResultJson(result));
  };

  const downloadGenericOutput = () => {
    if (!genericResult || !activeTool) return;
    const blob = new Blob([genericResult.markdown], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${activeTool}-output.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const simulateProcessing = async (fn: () => void) => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    fn();
    setProcessing(false);
  };

  const tryParseJson = (text: string) => {
    const source = (text || '').trim();
    const fenced = source.match(/```json\s*([\s\S]*?)```/i)?.[1]?.trim();
    const candidate = fenced || source;
    try {
      return JSON.parse(candidate);
    } catch {
      try {
        const arrayMatch = source.match(/\[[\s\S]*\]/);
        if (arrayMatch) return JSON.parse(arrayMatch[0]);
      } catch {
        return null;
      }
    }
    return null;
  };

  const renderStructuredOutput = (structured?: StructuredOutput | null) => {
    if (!structured) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
        {structured.summary && (
          <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--accent-dim)', color: 'var(--text-primary)', fontSize: 12, lineHeight: 1.5 }}>
            <strong style={{ display: 'block', marginBottom: 4 }}>Executive Summary</strong>
            {structured.summary}
          </div>
        )}

        {structured.highlights && structured.highlights.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Highlights</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {structured.highlights.map((item, index) => (
                <span key={`${item}-${index}`} style={{ padding: '4px 8px', borderRadius: 999, fontSize: 11, background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{item}</span>
              ))}
            </div>
          </div>
        )}

        {structured.table && (
          <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr>
                  {structured.table.columns.map((column, index) => (
                    <th key={`${column}-${index}`} style={{ textAlign: 'left', padding: '8px 10px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {structured.table.rows.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <td key={`cell-${rowIndex}-${cellIndex}`} style={{ padding: '8px 10px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {structured.sections && structured.sections.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {structured.sections.map((section, sectionIndex) => (
              <div key={`${section.title}-${sectionIndex}`} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 10, background: 'var(--bg-secondary)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600, marginBottom: 6 }}>{section.title}</div>
                <ul style={{ margin: 0, paddingLeft: 16, color: 'var(--text-secondary)', fontSize: 11, lineHeight: 1.5 }}>
                  {section.items.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}

        {structured.checklist && structured.checklist.length > 0 && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>Checklist</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {structured.checklist.map((item, index) => (
                <div key={`${item}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent)' }}>☑</span>{item}
                </div>
              ))}
            </div>
          </div>
        )}

        {structured.risks && structured.risks.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Risks & Mitigation</div>
            {structured.risks.map((item, index) => (
              <div key={`${item.risk}-${index}`} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 8, background: 'var(--bg-secondary)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-primary)', marginBottom: 3 }}>⚠ {item.risk}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Mitigation: {item.mitigation}</div>
              </div>
            ))}
          </div>
        )}

        {structured.nextSteps && structured.nextSteps.length > 0 && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>Next Steps</div>
            <ol style={{ margin: 0, paddingLeft: 16, color: 'var(--text-secondary)', fontSize: 11, lineHeight: 1.5 }}>
              {structured.nextSteps.map((step, index) => <li key={`${step}-${index}`}>{step}</li>)}
            </ol>
          </div>
        )}
      </div>
    );
  };

  const renderToolSpecificOutput = (toolId: string, machine?: Record<string, unknown> | null) => {
    if (!machine) return null;

    if (toolId === 'rubric-gen') {
      const rubricRows = toRecordArray(machine.rubricMatrix);
      if (rubricRows.length === 0) return null;

      return (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Rubric Matrix</div>
          <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr>
                  {['Criterion', 'Weight', 'Beginner', 'Proficient', 'Advanced'].map(column => (
                    <th key={column} style={{ textAlign: 'left', padding: '8px 10px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rubricRows.map((row, rowIndex) => (
                  <tr key={`rubric-${rowIndex}`}>
                    <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{String(row.criterion || '')}</td>
                    <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{String(row.weight || '')}</td>
                    <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{String(row.beginner || '')}</td>
                    <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{String(row.proficient || '')}</td>
                    <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{String(row.advanced || '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (toolId === 'flashcard-gen') {
      const cards = toRecordArray(machine.flashcards);
      if (cards.length === 0) return null;

      return (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Flashcard Deck Preview</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {cards.slice(0, 8).map((card, index) => (
              <div key={`flashcard-${index}`} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 10, background: 'var(--bg-secondary)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>Card {index + 1}</div>
                <div style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600, marginBottom: 6 }}>{String(card.front || '')}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: 6 }}>{String(card.back || '')}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ padding: '2px 6px', borderRadius: 999, border: '1px solid var(--border)', fontSize: 10, color: 'var(--text-muted)' }}>{String(card.difficulty || 'Medium')}</span>
                  <span style={{ padding: '2px 6px', borderRadius: 999, border: '1px solid var(--border)', fontSize: 10, color: 'var(--text-muted)' }}>{String(card.tag || 'General')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (toolId === 'topic-course') {
      const timeline = toRecordArray(machine.timeline);
      if (timeline.length === 0) return null;

      return (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Course Timeline</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {timeline.map((item, index) => (
              <div key={`timeline-${index}`} style={{ display: 'grid', gridTemplateColumns: '30px 1fr 120px', gap: 8, alignItems: 'start', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 8, background: 'var(--bg-secondary)' }}>
                <div style={{ width: 22, height: 22, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: 11, fontWeight: 700 }}>{index + 1}</div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600 }}>{String(item.phase || '')}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{String(item.outcome || '')}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>{String(item.duration || '')}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (toolId === 'assignment') {
      const deliverables = toStringArray(machine.deliverables);
      const milestones = toRecordArray(machine.milestones);
      if (deliverables.length === 0 && milestones.length === 0) return null;

      return (
        <div style={{ marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {deliverables.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Deliverables</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {deliverables.map((item, index) => (
                  <div key={`deliverable-${index}`} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 8, background: 'var(--bg-secondary)', fontSize: 11, color: 'var(--text-secondary)' }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {milestones.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Milestones</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {milestones.map((item, index) => (
                  <div key={`milestone-${index}`} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 120px', gap: 8, alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 8, background: 'var(--bg-secondary)' }}>
                    <div style={{ width: 20, height: 20, borderRadius: 999, background: 'var(--accent-dim)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{index + 1}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600 }}>{String(item.name || `Milestone ${index + 1}`)}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>{String(item.due || 'TBD')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (toolId === 'formula-solver') {
      const steps = toRecordArray(machine.solutionSteps);
      const finalAnswer = typeof machine.finalAnswer === 'string' ? machine.finalAnswer : '';
      if (steps.length === 0 && !finalAnswer) return null;

      return (
        <div style={{ marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {finalAnswer && (
            <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--accent-dim)', color: 'var(--text-primary)', fontSize: 12 }}>
              <strong>Final Answer:</strong> {finalAnswer}
            </div>
          )}
          {steps.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Solution Steps</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {steps.map((item, index) => (
                  <div key={`solution-step-${index}`} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 8, background: 'var(--bg-secondary)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600, marginBottom: 4 }}>Step {index + 1}: {String(item.step || '')}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{String(item.reason || '')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (toolId === 'engagement') {
      const score = typeof machine.engagementScore === 'number'
        ? Math.max(0, Math.min(100, machine.engagementScore))
        : null;
      const scoreBreakdown = toRecordArray(machine.scoreBreakdown);
      const improvements = toStringArray(machine.improvements);
      if (score === null && scoreBreakdown.length === 0 && improvements.length === 0) return null;

      return (
        <div style={{ marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {score !== null && (
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 10, background: 'var(--bg-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Engagement Score</span>
                <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 700 }}>{score}/100</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                <div style={{ width: `${score}%`, height: '100%', background: 'var(--accent)' }} />
              </div>
            </div>
          )}

          {scoreBreakdown.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Score Breakdown</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {scoreBreakdown.map((row, index) => (
                  <div key={`breakdown-${index}`} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 8, background: 'var(--bg-secondary)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600 }}>{String(row.dimension || `Metric ${index + 1}`)}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{String(row.score || 'N/A')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {improvements.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>Top Improvements</div>
              <ul style={{ margin: 0, paddingLeft: 16, color: 'var(--text-secondary)', fontSize: 11, lineHeight: 1.5 }}>
                {improvements.map((item, index) => <li key={`improvement-${index}`}>{item}</li>)}
              </ul>
            </div>
          )}
        </div>
      );
    }

    if (toolId === 'recommend') {
      const recommendations = toRecordArray(machine.recommendations);
      if (recommendations.length === 0) return null;

      return (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Prioritized Recommendations</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recommendations.map((item, index) => {
              const priority = String(item.priority || 'Medium');
              const priorityBg = priority === 'High' ? 'var(--accent-dim)' : 'var(--bg-secondary)';
              const priorityColor = priority === 'High' ? 'var(--accent)' : 'var(--text-muted)';
              return (
                <div key={`recommendation-${index}`} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 8, background: 'var(--bg-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600 }}>{String(item.title || `Recommendation ${index + 1}`)}</div>
                    <span style={{ padding: '2px 6px', borderRadius: 999, background: priorityBg, color: priorityColor, fontSize: 10, border: '1px solid var(--border)' }}>{priority}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>{String(item.reason || '')}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Effort: {String(item.effort || 'Medium')}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  const generateSlides = async () => {
    if (!slidePrompt.trim()) return;
    setProcessing(true);
    try {
      const res = await fetch('/api/ai/generate-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: slidePrompt, count: slideCount, theme: slideTheme }),
      });
      const data = await res.json();
      if (Array.isArray(data?.slides) && data.slides.length > 0) {
        if (data?.source === 'fallback') {
          setToolInfo('Ollama did not return valid slide JSON, so fallback slides were generated.');
        } else {
          setToolInfo('');
          setToolError('');
        }
        const mapped = data.slides.map((slide: { elements?: unknown[]; layout?: string }, index: number) => {
          const elements = Array.isArray(slide.elements) ? slide.elements as Array<Record<string, unknown>> : [];
          const heading = elements.find(element => element.type === 'heading');
          const list = elements.find(element => element.type === 'list');
          const title = typeof heading?.content === 'string' ? heading.content : `Slide ${index + 1}`;
          const content = Array.isArray(list?.items)
            ? (list.items as string[]).join(' • ')
            : 'Generated content available in editor-ready slide structure.';
          return { title, content, layout: slide.layout || 'content' };
        });
        setGeneratedSlides(mapped);
      } else {
        setToolError('Slide generation returned an invalid response.');
        setGeneratedSlides(Array.from({ length: slideCount }, (_, i) => ({
          title: i === 0 ? slidePrompt : `${slidePrompt} — Part ${i + 1}`,
          content: i === 0 ? 'Introduction and overview of key concepts' : `Detailed exploration of concept ${i}, including examples and practical takeaways.`,
          layout: ['title', 'content', 'two-column', 'image-text', 'bullets', 'comparison', 'timeline', 'summary'][i % 8],
        })));
      }
      bumpUsage('slide-gen', slideCount * 700);
    } finally {
      setProcessing(false);
    }
  };

  const generateQuiz = async () => {
    if (!quizTopic.trim()) return;
    setProcessing(true);
    try {
      const reply = await callAI([
        { role: 'system', content: 'You create accurate educational quizzes. Respond with JSON only.' },
        {
          role: 'user',
          content: `Create ${quizCount} ${quizType.toUpperCase()} questions about "${quizTopic}" at ${quizDifficulty} difficulty. Return JSON array only: [{"q":"...","opts":["A","B","C","D"],"answer":0,"explanation":"..."}]`,
        },
      ]);
      const parsed = tryParseJson(reply);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const quiz = parsed
          .slice(0, quizCount)
          .map((item: Record<string, unknown>) => ({
            q: String(item.q || 'Question'),
            opts: Array.isArray(item.opts) ? (item.opts as unknown[]).map(option => String(option)).slice(0, 4) : ['Option A', 'Option B', 'Option C', 'Option D'],
            answer: Math.max(0, Math.min(3, Number(item.answer ?? 0))),
            explanation: String(item.explanation || 'Explanation not provided.'),
          }));
        setGeneratedQuiz(quiz);
      }
      bumpUsage('quiz-gen', quizCount * 420);
    } finally {
      setProcessing(false);
    }
  };

  const explainCode = async () => {
    if (!codeInput.trim()) return;
    setProcessing(true);
    try {
      const mode = activeTool === 'code-review' ? 'review' : 'explain';
      const systemPrompt = mode === 'review'
        ? 'You are a strict but clear code reviewer. Be factual and avoid hallucinations.'
        : 'You are a beginner-friendly code explainer. Be precise and avoid hallucinations.';
      const userPrompt = mode === 'review'
        ? `Language: ${codeLang}\nReview the exact code below. Do not assume missing files or modules.\nReturn:\n1) What the code does\n2) Correctness concerns\n3) Style/readability improvements\n4) Actual time/space complexity only if inferable from shown code.\n\nCode:\n${codeInput}`
        : `Language: ${codeLang}\nExplain the exact code shown below.\nRules:\n- Explain line by line only for lines that exist.\n- Do not invent imports/functions/errors not present.\n- State actual time/space complexity if applicable; if trivial, say so clearly.\n- Keep wording beginner-friendly and concise.\n\nCode:\n${codeInput}`;

      const reply = await callAI([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]);

      setCodeExplanation(reply || 'No analysis generated.');
      bumpUsage(activeTool === 'code-review' ? 'code-review' : 'code-explain', Math.max(900, codeInput.length * 4));
    } finally {
      setProcessing(false);
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: chatInput, timestamp: new Date().toLocaleTimeString() };
    const nextMessages = [...chatMessages, userMsg];
    setChatMessages(nextMessages);
    setChatInput('');

    const roleDescriptions: Record<string, string> = {
      'teaching-assistant': 'a knowledgeable teaching assistant who explains concepts clearly and patiently',
      'study-buddy': 'a friendly peer study buddy who uses simple language and relatable examples',
      'code-mentor': 'an experienced software engineering mentor who writes clean code and explains technical concepts thoroughly',
      'research-helper': 'a meticulous research assistant skilled in finding, analyzing, and summarizing academic content',
      'language-tutor': 'a patient and encouraging language learning tutor',
    };
    const styleInstructions: Record<string, string> = {
      'detailed': 'Provide thorough, comprehensive answers with full explanations.',
      'concise': 'Keep answers short and to the point, using bullet points where appropriate.',
      'socratic': 'Guide the student with questions rather than direct answers, fostering critical thinking.',
      'step-by-step': 'Break down your answer into clearly numbered, sequential steps.',
    };
    const examplesHint = chatIncludeExamples ? ' Always include at least one practical example or analogy.' : '';
    const subjectCtx = chatSubject !== 'general' ? ` Focus on the ${chatSubject} subject domain.` : '';
    const systemPrompt = `You are ${roleDescriptions[chatRole] || roleDescriptions['teaching-assistant']}. ${styleInstructions[chatResponseStyle] || ''}${examplesHint}${subjectCtx} Be helpful, accurate, and educational.`;

    const history = nextMessages
      .map((m): { role: 'user' | 'assistant'; content: string } => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content,
      }))
      .slice(-8);

    const messagesWithSystem: { role: 'user' | 'system' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
      ...history,
    ];

    const reply = await callAI(messagesWithSystem);
    setChatMessages(prev => [...prev, {
      role: 'ai',
      content: reply || 'I could not generate a response right now. Please try again.',
      timestamp: new Date().toLocaleTimeString(),
    }]);
    bumpUsage('chatbot', Math.max(600, userMsg.content.length * 3));
  };

  const generateNarration = async () => {
    if (!narrationText.trim()) return;
    setProcessing(true);
    try {
      const voice = VOICES.find(v => v.id === selectedVoice);
      const reply = await callAI([
        { role: 'system', content: 'You are an expert voice-over writer for educational slide narration. Keep output natural, clear, and production-ready.' },
        {
          role: 'user',
          content: `Create a polished narration script for TTS.\nVoice: ${voice?.name || selectedVoice} (${voice?.accent || 'neutral'})\nSpeed: ${narrationSpeed}x\nRequirements:\n- Keep beginner-friendly language\n- Add short pause markers like [pause] where helpful\n- Keep meaning faithful to source\n- Return only narration script text\n\nText:\n${narrationText}`,
        },
      ]);
      setNarrationOutput(reply || narrationText);
      setNarrationGenerated(true);
      bumpUsage('voice-narration', Math.max(700, narrationText.length * 3));
    } finally {
      setProcessing(false);
    }
  };

  const checkPlagiarism = async () => {
    if (!plagiarismText.trim()) return;
    setProcessing(true);
    try {
      const reply = await callAI([
        { role: 'system', content: 'You estimate plagiarism risk heuristically and return strict JSON only.' },
        {
          role: 'user',
          content: `Analyze the following text for likely plagiarism risk. Return JSON only:\n{"score": number, "sources": [{"url":"...","match": number}]}\nUse realistic placeholders for potential source domains if exact sources are unknown.\n\nText:\n${plagiarismText}`,
        },
      ]);
      const parsed = tryParseJson(reply) as { score?: number; sources?: Array<{ url?: string; match?: number }> } | null;
      if (parsed) {
        const score = Math.max(0, Math.min(100, Number(parsed.score ?? 0)));
        const sources = Array.isArray(parsed.sources)
          ? parsed.sources.slice(0, 6).map((source, index) => ({
            url: source?.url || `https://source-${index + 1}.example`,
            match: Math.max(0, Math.min(100, Number(source?.match ?? 0))),
          }))
          : [];
        setPlagiarismResult({ score, sources });
      } else {
        setPlagiarismResult({ score: 0, sources: [] });
      }
      bumpUsage('plagiarism', Math.max(800, plagiarismText.length * 2));
    } finally {
      setProcessing(false);
    }
  };

  const translateContent = async () => {
    if (!translateInput.trim()) return;
    setProcessing(true);
    try {
      const reply = await callAI([
        { role: 'system', content: 'You are a professional translator for educational content.' },
        { role: 'user', content: `Translate from ${translateFrom} to ${translateTo}. Preserve meaning and formatting. Return only translated text.\n\nText:\n${translateInput}` },
      ]);
      setTranslateOutput(reply || 'Translation unavailable.');
      bumpUsage('translate', Math.max(700, translateInput.length * 3));
    } finally {
      setProcessing(false);
    }
  };

  const generateLesson = async () => {
    if (!lessonTopic.trim()) return;
    setProcessing(true);
    try {
      const reply = await callAI([
        { role: 'system', content: 'You generate practical lesson plans in JSON.' },
        {
          role: 'user',
          content: `Create a ${lessonDuration}-minute lesson plan for ${lessonGrade} level on "${lessonTopic}". Return JSON array only: [{"section":"...","time":"...","activity":"..."}]`,
        },
      ]);
      const parsed = tryParseJson(reply);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setGeneratedLesson(parsed.slice(0, 10).map((item: Record<string, unknown>) => ({
          section: String(item.section || 'Section'),
          time: String(item.time || 'TBD'),
          activity: String(item.activity || 'Activity details pending'),
        })));
      }
      bumpUsage('lesson-plan', 1300);
    } finally {
      setProcessing(false);
    }
  };

  const generateMindmap = async () => {
    if (!mindmapTopic.trim()) return;
    setProcessing(true);
    try {
      const reply = await callAI([
        { role: 'system', content: 'You create concise concept maps in JSON.' },
        {
          role: 'user',
          content: `Create a mind map for "${mindmapTopic}". Return JSON object only:\n{"core":"...","branches":[{"label":"...","children":["...","..."]}]}`,
        },
      ]);
      const parsed = tryParseJson(reply) as { core?: string; branches?: Array<{ label?: string; children?: string[] }> } | null;
      if (parsed?.core && Array.isArray(parsed.branches) && parsed.branches.length > 0) {
        const nodes: { id: string; label: string; children: string[] }[] = [];
        nodes.push({ id: '1', label: parsed.core, children: [] });
        let nextId = 2;
        const rootChildren: string[] = [];
        parsed.branches.slice(0, 6).forEach(branch => {
          const branchId = String(nextId++);
          rootChildren.push(branchId);
          const childIds: string[] = [];
          (branch.children || []).slice(0, 5).forEach(child => {
            const childId = String(nextId++);
            childIds.push(childId);
            nodes.push({ id: childId, label: child, children: [] });
          });
          nodes.push({ id: branchId, label: branch.label || 'Branch', children: childIds });
        });
        nodes[0].children = rootChildren;
        setMindmapNodes(nodes);
      }
      bumpUsage('mindmap', 1200);
    } finally {
      setProcessing(false);
    }
  };

  const generatePath = async () => {
    if (!pathGoal.trim()) return;
    setProcessing(true);
    try {
      const reply = await callAI([
        { role: 'system', content: 'You create practical learning paths in JSON.' },
        {
          role: 'user',
          content: `Create a step-by-step learning path for goal: "${pathGoal}". Return JSON array only with items: {"title":"...","duration":"...","resources":"...","status":"completed|current|upcoming"}.`,
        },
      ]);
      const parsed = tryParseJson(reply);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setPathSteps(parsed.slice(0, 8).map((item: Record<string, unknown>, index: number) => ({
          step: index + 1,
          title: String(item.title || `Step ${index + 1}`),
          duration: String(item.duration || 'TBD'),
          resources: String(item.resources || 'Resources TBD'),
          status: (['completed', 'current', 'upcoming'].includes(String(item.status)) ? String(item.status) : (index === 0 ? 'current' : 'upcoming')) as 'completed' | 'current' | 'upcoming',
        })));
      }
      bumpUsage('learning-path', 1200);
    } finally {
      setProcessing(false);
    }
  };

  const summarize = async () => {
    if (!summaryInput.trim()) return;
    setProcessing(true);
    try {
      const detailHint = summaryLength === 'brief' ? '2-3 bullets' : summaryLength === 'standard' ? '4-6 bullets' : '8-10 detailed bullets';
      const reply = await callAI([
        { role: 'system', content: 'You summarize educational content accurately and clearly.' },
        { role: 'user', content: `Summarize the following content in ${detailHint}. Keep it easy to understand and faithful to source.\n\n${summaryInput}` },
      ]);
      setSummaryOutput(reply || 'Summary unavailable.');
      bumpUsage('summarizer', Math.max(800, summaryInput.length * 2));
    } finally {
      setProcessing(false);
    }
  };

  const generateCitation = async () => {
    if (!citationInput.trim()) return;
    setProcessing(true);
    try {
      const reply = await callAI([
        { role: 'system', content: 'You format references in requested citation styles.' },
        { role: 'user', content: `Generate a single ${citationFormat} citation for this source detail or URL. If details are missing, make the minimum clearly marked assumptions. Return citation only.\n\n${citationInput}` },
      ]);
      setCitationOutput(reply || 'Citation unavailable.');
      bumpUsage('citations', 700);
    } finally {
      setProcessing(false);
    }
  };

  /* ── Tool Panel Renderer ── */
  const renderToolPanel = () => {
    if (!activeTool) return null;

    const tool = AI_TOOLS.find(t => t.id === activeTool);
    if (!tool) return null;

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: 520, background: 'linear-gradient(180deg, rgba(31,31,35,0.98), rgba(26,26,30,0.99))',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0,
          backdropFilter: 'blur(20px)',
        }}>
        {/* Panel Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.04), transparent)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ToolIconBox toolId={tool.id} size={38} />
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{tool.name}</h3>
              <p style={{ margin: 0, fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.4 }}>{tool.desc}</p>
            </div>
          </div>
          <button onClick={() => setActiveTool(null)} style={{
            width: 32, height: 32, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}>
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        <div style={{ flex: 1, padding: 20, overflow: 'auto' }}>
          {/* Error/Info notices */}
          {toolError && (
            <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', color: '#fca5a5', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
              {toolError}
            </div>
          )}
          {!toolError && toolInfo && (
            <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(99,102,241,0.15)', background: 'rgba(99,102,241,0.06)', color: '#a5b4fc', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
              {toolInfo}
            </div>
          )}

          {/* ── Slide Generator ── */}
          {activeTool === 'slide-gen' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Field label="Audience">
                  <select value={genericAudience} onChange={e => setGenericAudience(e.target.value)} style={inputStyle}>
                    <option value="students">Students</option>
                    <option value="teachers">Teachers</option>
                    <option value="corporate">Corporate Teams</option>
                    <option value="mixed">Mixed Audience</option>
                  </select>
                </Field>
                <Field label="Tone">
                  <select value={genericTone} onChange={e => setGenericTone(e.target.value)} style={inputStyle}>
                    <option value="professional">Professional</option>
                    <option value="academic">Academic</option>
                    <option value="friendly">Friendly</option>
                    <option value="technical">Technical</option>
                  </select>
                </Field>
              </div>
              <Field label="Topic / Prompt">
                <textarea value={slidePrompt} onChange={e => setSlidePrompt(e.target.value)} rows={3}
                  placeholder="e.g., Introduction to Machine Learning for beginners"
                  style={inputStyle} />
              </Field>
              <div style={{ display: 'flex', gap: 8 }}>
                <Field label="Slides"><input type="number" min={3} max={30} value={slideCount} onChange={e => setSlideCount(Number(e.target.value))} style={{ ...inputStyle, width: '100%' }} /></Field>
                <Field label="Theme">
                  <select value={slideTheme} onChange={e => setSlideTheme(e.target.value)} style={inputStyle}>
                    {['professional', 'academic', 'modern', 'creative', 'minimal', 'dark'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" checked={genericIncludeExamples} onChange={e => setGenericIncludeExamples(e.target.checked)} style={{ accentColor: '#6366f1', width: 14, height: 14 }} />
                Include speaker notes for each slide
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={generateSlides} disabled={processing || !slidePrompt} className="ai-btn-primary" style={{ flex: 1 }}>{processing ? <><div className="ai-spinner" /> Generating...</> : <><Presentation size={15} /> Generate Slides</>}</button>
                <button onClick={() => setGeneratedSlides([])} className="ai-btn-secondary" style={{ marginTop: 0 }}>Clear</button>
              </div>
              {generatedSlides.length > 0 && (
                <div className="ai-result-panel">
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Zap size={14} style={{ color: '#a5b4fc' }} /> Generated {generatedSlides.length} slides
                  </div>
                  {generatedSlides.map((s, i) => (
                    <div key={i} style={{ padding: '10px 14px', background: 'rgba(38,38,43,0.6)', borderRadius: 12, marginBottom: 6, borderLeft: '3px solid #6366f1', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#a5b4fc', marginBottom: 2 }}>Slide {i + 1} — {s.layout}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-primary)', fontWeight: 600 }}>{s.title}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{s.content}</div>
                    </div>
                  ))}
                  <button className="ai-btn-secondary" style={{ marginTop: 8 }}><ArrowRight size={13} /> Import to Editor</button>
                </div>
              )}
            </div>
          )}

          {/* ── Quiz Generator ── */}
          {activeTool === 'quiz-gen' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Field label="Audience">
                  <select value={genericAudience} onChange={e => setGenericAudience(e.target.value)} style={inputStyle}>
                    <option value="students">Students</option>
                    <option value="teachers">Teachers</option>
                    <option value="mixed">Mixed Audience</option>
                  </select>
                </Field>
                <Field label="Difficulty">
                  <select value={quizDifficulty} onChange={e => setQuizDifficulty(e.target.value)} style={inputStyle}>
                    <option>easy</option><option>medium</option><option>hard</option><option>expert</option>
                  </select>
                </Field>
              </div>
              <Field label="Topic"><input value={quizTopic} onChange={e => setQuizTopic(e.target.value)} placeholder="e.g., Data Structures" style={inputStyle} /></Field>
              <div style={{ display: 'flex', gap: 8 }}>
                <Field label="Questions"><input type="number" min={1} max={50} value={quizCount} onChange={e => setQuizCount(Number(e.target.value))} style={{ ...inputStyle, width: '100%' }} /></Field>
                <Field label="Type">
                  <select value={quizType} onChange={e => setQuizType(e.target.value)} style={inputStyle}>
                    <option value="mcq">Multiple Choice</option><option value="tf">True/False</option><option value="fill">Fill Blank</option><option value="match">Matching</option>
                  </select>
                </Field>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" checked={genericIncludeExamples} onChange={e => setGenericIncludeExamples(e.target.checked)} style={{ accentColor: '#6366f1', width: 14, height: 14 }} />
                Include explanations for each answer
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={generateQuiz} disabled={processing || !quizTopic} className="ai-btn-primary" style={{ flex: 1 }}>{processing ? <><div className="ai-spinner" /> Generating...</> : <><CircleHelp size={15} /> Generate Quiz</>}</button>
                <button onClick={() => setGeneratedQuiz([])} className="ai-btn-secondary" style={{ marginTop: 0 }}>Clear</button>
              </div>
              {generatedQuiz.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  {generatedQuiz.map((q, i) => (
                    <div key={i} style={{ padding: 14, background: 'rgba(38,38,43,0.6)', borderRadius: 12, marginBottom: 8, border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Q{i + 1}. {q.q}</div>
                      {q.opts.map((o, j) => (
                        <div key={j} style={{
                          padding: '6px 10px', borderRadius: 8, marginBottom: 3, fontSize: 12,
                          background: j === q.answer ? 'rgba(34,197,94,0.08)' : 'transparent',
                          color: j === q.answer ? '#4ade80' : 'var(--text-secondary)',
                          border: j === q.answer ? '1px solid rgba(34,197,94,0.2)' : '1px solid transparent',
                        }}>
                          {String.fromCharCode(65 + j)}) {o} {j === q.answer && ' ✓'}
                        </div>
                      ))}
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'flex-start', gap: 4 }}><Lightbulb size={10} style={{ flexShrink: 0, marginTop: 2 }} /> {q.explanation}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Code Explainer ── */}
          {(activeTool === 'code-explain' || activeTool === 'code-review') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Field label="Language">
                  <select value={codeLang} onChange={e => setCodeLang(e.target.value)} style={inputStyle}>
                    {['python', 'javascript', 'typescript', 'cpp', 'java', 'rust', 'go', 'swift'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Explanation Level">
                  <select value={genericTone} onChange={e => setGenericTone(e.target.value)} style={inputStyle}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="technical">Expert / Technical</option>
                  </select>
                </Field>
              </div>
              <Field label="Code">
                <textarea value={codeInput} onChange={e => setCodeInput(e.target.value)} rows={8}
                  placeholder="Paste your code here…"
                  style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: 12 }} />
              </Field>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" checked={genericIncludeExamples} onChange={e => setGenericIncludeExamples(e.target.checked)} style={{ accentColor: '#6366f1', width: 14, height: 14 }} />
                Include practical examples and best practices
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={explainCode} disabled={processing || !codeInput} className="ai-btn-primary" style={{ flex: 1 }}>{processing ? <><div className="ai-spinner" /> Analyzing...</> : activeTool === 'code-explain' ? <><Lightbulb size={15} /> Explain Code</> : <><SearchCode size={15} /> Review Code</>}</button>
                <button onClick={() => setCodeExplanation('')} className="ai-btn-secondary" style={{ marginTop: 0 }}>Clear</button>
              </div>
              {codeExplanation && (
                <div className="ai-result-panel" style={{ fontSize: 12.5, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                  {codeExplanation}
                </div>
              )}
            </div>
          )}

          {/* ── Voice Narration ── */}
          {activeTool === 'voice-narration' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Field label="Voice Style">
                  <select value={selectedVoice} onChange={e => setSelectedVoice(e.target.value)} style={inputStyle}>
                    {VOICES.map(v => <option key={v.id} value={v.id}>{v.name} ({v.accent})</option>)}
                  </select>
                </Field>
                <Field label={`Playback Speed: ${narrationSpeed}x`}>
                  <input type="range" min={0.5} max={2} step={0.1} value={narrationSpeed}
                    onChange={e => setNarrationSpeed(Number(e.target.value))}
                    style={{ width: '100%', marginTop: 8 }} />
                </Field>
              </div>
              <Field label="Text to Narrate">
                <textarea value={narrationText} onChange={e => setNarrationText(e.target.value)} rows={5}
                  placeholder="Enter the text to convert to speech…"
                  style={inputStyle} />
              </Field>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" checked={genericIncludeExamples} onChange={e => setGenericIncludeExamples(e.target.checked)} style={{ accentColor: '#6366f1', width: 14, height: 14 }} />
                Add natural pause markers
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={generateNarration} disabled={processing || !narrationText} className="ai-btn-primary" style={{ flex: 1 }}>
                  {processing ? <><div className="ai-spinner" /> Generating...</> : <><Mic size={15} /> Generate Narration</>}
                </button>
                <button onClick={() => { setNarrationGenerated(false); setNarrationOutput(''); }} className="ai-btn-secondary" style={{ marginTop: 0 }}>Clear</button>
              </div>
              {narrationGenerated && (
                <div className="ai-result-panel" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 0, height: 0, borderLeft: '10px solid #fff', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', marginLeft: 2 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-hover)', overflow: 'hidden' }}>
                      <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 3, repeat: Infinity }}
                        style={{ height: '100%', background: 'var(--accent)', borderRadius: 2 }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--text-muted)' }}>
                      <span>0:00</span><span>2:34</span>
                    </div>
                    {narrationOutput && (
                      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.5, maxHeight: 120, overflow: 'auto' }}>
                        {narrationOutput}
                      </div>
                    )}
                  </div>
                  <button className="ai-btn-secondary"><Download size={13} /> Download</button>
                </div>
              )}
            </div>
          )}

          {/* ── Chatbot ── */}
          {activeTool === 'chatbot' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Context row — Role + Subject */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Field label="AI Persona">
                  <select value={chatRole} onChange={e => setChatRole(e.target.value)} style={inputStyle}>
                    <option value="teaching-assistant">Teaching Assistant</option>
                    <option value="study-buddy">Study Buddy</option>
                    <option value="code-mentor">Code Mentor</option>
                    <option value="research-helper">Research Helper</option>
                    <option value="language-tutor">Language Tutor</option>
                  </select>
                </Field>
                <Field label="Subject Area">
                  <select value={chatSubject} onChange={e => setChatSubject(e.target.value)} style={inputStyle}>
                    <option value="general">General</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="history">History</option>
                    <option value="programming">Programming</option>
                    <option value="literature">Literature</option>
                    <option value="business">Business</option>
                  </select>
                </Field>
              </div>

              {/* Response style */}
              <Field label="Response Style">
                <select value={chatResponseStyle} onChange={e => setChatResponseStyle(e.target.value)} style={inputStyle}>
                  <option value="detailed">Detailed</option>
                  <option value="concise">Concise</option>
                  <option value="socratic">Socratic (Question-led)</option>
                  <option value="step-by-step">Step-by-Step</option>
                </select>
              </Field>

              {/* Message input */}
              <Field label="Your Message">
                <textarea
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) sendChat(); }}
                  rows={4}
                  placeholder="Ask anything — concepts, doubts, explanations, problems… (Ctrl+Enter to send)"
                  style={inputStyle}
                />
              </Field>

              {/* Options */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={chatIncludeExamples}
                  onChange={e => setChatIncludeExamples(e.target.checked)}
                  style={{ accentColor: '#6366f1', width: 14, height: 14 }}
                />
                Include practical examples in response
              </label>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={sendChat}
                  disabled={processing || !chatInput.trim()}
                  className="ai-btn-primary"
                  style={{ flex: 1 }}
                >
                  {processing
                    ? <><div className="ai-spinner" /> Thinking…</>
                    : <><Bot size={15} /> Send Message</>}
                </button>
                <button
                  onClick={() => {
                    setChatMessages([{
                      role: 'ai',
                      content: 'Hello! I\'m your AI teaching assistant. Ask me anything about your courses, assignments, or concepts.',
                      timestamp: new Date().toLocaleTimeString(),
                    }]);
                    setChatInput('');
                  }}
                  className="ai-btn-secondary"
                  style={{ marginTop: 0 }}
                >
                  Clear
                </button>
              </div>

              {/* Conversation history — card style */}
              {chatMessages.length > 1 && (
                <div className="ai-result-panel" style={{ maxHeight: 360, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{
                    fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span>Conversation · {chatMessages.length - 1} exchange{chatMessages.length - 1 !== 1 ? 's' : ''}</span>
                    <button
                      onClick={async () => {
                        const text = chatMessages.map(m => `${m.role === 'ai' ? 'AI' : 'You'}: ${m.content}`).join('\n\n');
                        await navigator.clipboard.writeText(text);
                      }}
                      className="ai-btn-secondary"
                      style={{ padding: '3px 8px', fontSize: 10 }}
                    >
                      <Copy size={10} /> Copy All
                    </button>
                  </div>

                  {chatMessages.map((m, i) => (
                    <div key={i} style={{
                      padding: '10px 14px', borderRadius: 12,
                      background: m.role === 'user' ? 'rgba(99,102,241,0.07)' : 'rgba(38,38,43,0.65)',
                      border: `1px solid ${m.role === 'user' ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.05)'}`,
                    }}>
                      {/* Message header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                          background: m.role === 'ai' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255,255,255,0.07)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {m.role === 'ai' ? <Bot size={11} color="#fff" /> : <User size={11} color="var(--text-secondary)" />}
                        </div>
                        <span style={{
                          fontSize: 10.5, fontWeight: 700,
                          color: m.role === 'ai' ? '#a5b4fc' : 'var(--text-muted)',
                          textTransform: 'uppercase', letterSpacing: '0.04em',
                        }}>
                          {m.role === 'ai' ? 'AI Assistant' : 'You'}
                        </span>
                        <span style={{ fontSize: 9.5, color: 'var(--text-muted)', marginLeft: 'auto' }}>{m.timestamp}</span>
                      </div>
                      {/* Message body */}
                      <div style={{
                        fontSize: 12.5, color: 'var(--text-secondary)',
                        lineHeight: 1.65, whiteSpace: 'pre-wrap',
                      }}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>
          )}

          {/* ── Plagiarism ── */}
          {activeTool === 'plagiarism' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Field label="Audience">
                  <select value={genericAudience} onChange={e => setGenericAudience(e.target.value)} style={inputStyle}>
                    <option value="students">Students</option>
                    <option value="academics">Academic Professionals</option>
                    <option value="corporate">Corporate</option>
                    <option value="mixed">Mixed Audience</option>
                  </select>
                </Field>
                <Field label="Sensitivity">
                  <select value={genericTone} onChange={e => setGenericTone(e.target.value)} style={inputStyle}>
                    <option value="standard">Standard</option>
                    <option value="strict">Strict</option>
                    <option value="lenient">Lenient</option>
                  </select>
                </Field>
              </div>
              <Field label="Content to Check">
                <textarea value={plagiarismText} onChange={e => setPlagiarismText(e.target.value)} rows={6}
                  placeholder="Paste the content to check for plagiarism…" style={inputStyle} />
              </Field>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" checked={genericIncludeExamples} onChange={e => setGenericIncludeExamples(e.target.checked)} style={{ accentColor: '#6366f1', width: 14, height: 14 }} />
                Show detailed source breakdown
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={checkPlagiarism} disabled={processing || !plagiarismText} className="ai-btn-primary" style={{ flex: 1 }}>{processing ? <><div className="ai-spinner" /> Scanning...</> : <><ShieldCheck size={15} /> Check Plagiarism</>}</button>
                <button onClick={() => { setPlagiarismText(''); setPlagiarismResult(null); }} className="ai-btn-secondary" style={{ marginTop: 0 }}>Clear</button>
              </div>
              {plagiarismResult && (
                <div>
                  <div className="ai-result-panel" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: plagiarismResult.score < 15 ? 'rgba(34,197,94,0.1)' : plagiarismResult.score < 30 ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)',
                      border: `1px solid ${plagiarismResult.score < 15 ? 'rgba(34,197,94,0.2)' : plagiarismResult.score < 30 ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)'}`,
                      fontSize: 20, fontWeight: 800, color: plagiarismResult.score < 15 ? '#4ade80' : plagiarismResult.score < 30 ? '#fbbf24' : '#f87171',
                    }}>{plagiarismResult.score}%</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: plagiarismResult.score < 15 ? '#4ade80' : '#fbbf24' }}>
                        {plagiarismResult.score < 15 ? 'Original Content' : 'Some Matches Found'}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Similarity score based on {plagiarismResult.sources.length} sources</div>
                    </div>
                  </div>
                  {plagiarismResult.sources.map((s, i) => (
                    <div key={i} style={{ padding: '8px 14px', background: 'rgba(38,38,43,0.6)', borderRadius: 10, marginBottom: 4, display: 'flex', justifyContent: 'space-between', fontSize: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{s.url}</span>
                      <span style={{ color: '#fbbf24', fontWeight: 600 }}>{s.match}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Translation ── */}
          {activeTool === 'translate' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Field label="From">
                  <select value={translateFrom} onChange={e => setTranslateFrom(e.target.value)} style={inputStyle}>
                    <option>English</option>{TRANSLATE_LANGS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="To">
                  <select value={translateTo} onChange={e => setTranslateTo(e.target.value)} style={inputStyle}>
                    {TRANSLATE_LANGS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Translation Style">
                <select value={genericTone} onChange={e => setGenericTone(e.target.value)} style={inputStyle}>
                  <option value="formal">Formal</option>
                  <option value="casual">Casual / Conversational</option>
                  <option value="academic">Academic</option>
                  <option value="simplified">Simplified</option>
                </select>
              </Field>
              <Field label="Input Text">
                <textarea value={translateInput} onChange={e => setTranslateInput(e.target.value)} rows={4} placeholder="Enter text to translate…" style={inputStyle} />
              </Field>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" checked={genericIncludeExamples} onChange={e => setGenericIncludeExamples(e.target.checked)} style={{ accentColor: '#6366f1', width: 14, height: 14 }} />
                Preserve original formatting and structure
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={translateContent} disabled={processing || !translateInput} className="ai-btn-primary" style={{ flex: 1 }}>{processing ? <><div className="ai-spinner" /> Translating...</> : <><Languages size={15} /> Translate</>}</button>
                <button onClick={() => { setTranslateInput(''); setTranslateOutput(''); }} className="ai-btn-secondary" style={{ marginTop: 0 }}>Clear</button>
              </div>
              {translateOutput && (
                <div className="ai-result-panel" style={{ fontSize: 12.5, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {translateOutput}
                </div>
              )}
            </div>
          )}

          {/* ── Lesson Planner ── */}
          {activeTool === 'lesson-plan' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Field label="Grade Level">
                  <select value={lessonGrade} onChange={e => setLessonGrade(e.target.value)} style={inputStyle}>
                    <option>High School</option><option>College</option><option>Graduate</option><option>Professional</option>
                  </select>
                </Field>
                <Field label="Duration (min)">
                  <input value={lessonDuration} onChange={e => setLessonDuration(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                </Field>
              </div>
              <Field label="Topic"><input value={lessonTopic} onChange={e => setLessonTopic(e.target.value)} placeholder="e.g., Recursion in Python" style={inputStyle} /></Field>
              <Field label="Teaching Style">
                <select value={genericTone} onChange={e => setGenericTone(e.target.value)} style={inputStyle}>
                  <option value="interactive">Interactive</option>
                  <option value="lecture">Lecture-based</option>
                  <option value="project">Project-based</option>
                  <option value="flipped">Flipped Classroom</option>
                </select>
              </Field>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" checked={genericIncludeExamples} onChange={e => setGenericIncludeExamples(e.target.checked)} style={{ accentColor: '#6366f1', width: 14, height: 14 }} />
                Include practical activities and examples
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={generateLesson} disabled={processing || !lessonTopic} className="ai-btn-primary" style={{ flex: 1 }}>{processing ? <><div className="ai-spinner" /> Planning...</> : <><ClipboardList size={15} /> Generate Plan</>}</button>
                <button onClick={() => setGeneratedLesson([])} className="ai-btn-secondary" style={{ marginTop: 0 }}>Clear</button>
              </div>
              {generatedLesson.length > 0 && (
                <div>
                  {generatedLesson.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ width: 50, fontSize: 10, color: 'var(--accent)', fontWeight: 600, textAlign: 'right', flexShrink: 0 }}>{s.time}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{s.section}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.activity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Mind Map ── */}
          {activeTool === 'mindmap' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Field label="Complexity">
                  <select value={genericTone} onChange={e => setGenericTone(e.target.value)} style={inputStyle}>
                    <option value="simple">Simple</option>
                    <option value="medium">Medium</option>
                    <option value="detailed">Detailed</option>
                  </select>
                </Field>
                <Field label="Audience">
                  <select value={genericAudience} onChange={e => setGenericAudience(e.target.value)} style={inputStyle}>
                    <option value="students">Students</option>
                    <option value="teachers">Teachers</option>
                    <option value="professionals">Professionals</option>
                  </select>
                </Field>
              </div>
              <Field label="Central Topic"><input value={mindmapTopic} onChange={e => setMindmapTopic(e.target.value)} placeholder="e.g., Artificial Intelligence" style={inputStyle} /></Field>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" checked={genericIncludeExamples} onChange={e => setGenericIncludeExamples(e.target.checked)} style={{ accentColor: '#6366f1', width: 14, height: 14 }} />
                Include real-world examples for each node
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={generateMindmap} disabled={processing || !mindmapTopic} className="ai-btn-primary" style={{ flex: 1 }}>{processing ? <><div className="ai-spinner" /> Mapping...</> : <><Brain size={15} /> Generate Mind Map</>}</button>
                <button onClick={() => setMindmapNodes([])} className="ai-btn-secondary" style={{ marginTop: 0 }}>Clear</button>
              </div>
              {mindmapNodes.length > 0 && (
                <div style={{ padding: 16, background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', minHeight: 200 }}>
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <span style={{ padding: '8px 16px', borderRadius: 20, background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 13 }}>{mindmapNodes[0]?.label}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                    {mindmapNodes.slice(1, 5).map(n => (
                      <div key={n.id} style={{ textAlign: 'center' }}>
                        <div style={{ padding: '6px 12px', borderRadius: 12, background: 'var(--accent-dim)', color: 'var(--accent)', fontWeight: 600, fontSize: 11, marginBottom: 6 }}>{n.label}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {mindmapNodes.filter(c => n.children.includes(c.id)).map(c => (
                            <span key={c.id} style={{ fontSize: 10, color: 'var(--text-muted)', padding: '2px 8px', background: 'var(--bg-hover)', borderRadius: 4 }}>{c.label}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Learning Path ── */}
          {activeTool === 'learning-path' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Field label="Current Level">
                  <select value={genericTone} onChange={e => setGenericTone(e.target.value)} style={inputStyle}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </Field>
                <Field label="Learning Style">
                  <select value={genericAudience} onChange={e => setGenericAudience(e.target.value)} style={inputStyle}>
                    <option value="self-paced">Self-paced</option>
                    <option value="structured">Structured</option>
                    <option value="project-based">Project-based</option>
                  </select>
                </Field>
              </div>
              <Field label="Learning Goal"><input value={pathGoal} onChange={e => setPathGoal(e.target.value)} placeholder="e.g., Become a Full-Stack Developer" style={inputStyle} /></Field>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" checked={genericIncludeExamples} onChange={e => setGenericIncludeExamples(e.target.checked)} style={{ accentColor: '#6366f1', width: 14, height: 14 }} />
                Include recommended resources for each step
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={generatePath} disabled={processing || !pathGoal} className="ai-btn-primary" style={{ flex: 1 }}>{processing ? <><div className="ai-spinner" /> Charting...</> : <><Route size={15} /> Generate Path</>}</button>
                <button onClick={() => setPathSteps([])} className="ai-btn-secondary" style={{ marginTop: 0 }}>Clear</button>
              </div>
              {pathSteps.length > 0 && (
                <div>
                  {pathSteps.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: s.status === 'completed' ? '#22c55e' : s.status === 'current' ? 'var(--accent)' : 'var(--bg-hover)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: s.status === 'upcoming' ? 'var(--text-muted)' : '#fff',
                      }}>{s.status === 'completed' ? '✓' : s.step}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{s.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.duration} · {s.resources}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Summary ── */}
          {activeTool === 'summarizer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Field label="Audience">
                  <select value={genericAudience} onChange={e => setGenericAudience(e.target.value)} style={inputStyle}>
                    <option value="students">Students</option>
                    <option value="professionals">Professionals</option>
                    <option value="executives">Executives</option>
                    <option value="general">General</option>
                  </select>
                </Field>
                <Field label="Summary Length">
                  <select value={summaryLength} onChange={e => setSummaryLength(e.target.value as 'brief' | 'standard' | 'detailed')} style={inputStyle}>
                    <option value="brief">Brief (2-3 points)</option>
                    <option value="standard">Standard (4-6 points)</option>
                    <option value="detailed">Detailed (8-10 points)</option>
                  </select>
                </Field>
              </div>
              <Field label="Content to Summarize">
                <textarea value={summaryInput} onChange={e => setSummaryInput(e.target.value)} rows={6} placeholder="Paste long text or document content…" style={inputStyle} />
              </Field>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" checked={genericIncludeExamples} onChange={e => setGenericIncludeExamples(e.target.checked)} style={{ accentColor: '#6366f1', width: 14, height: 14 }} />
                Include key quotes and takeaways
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={summarize} disabled={processing || !summaryInput} className="ai-btn-primary" style={{ flex: 1 }}>{processing ? <><div className="ai-spinner" /> Summarizing...</> : <><AlignLeft size={15} /> Summarize</>}</button>
                <button onClick={() => setSummaryOutput('')} className="ai-btn-secondary" style={{ marginTop: 0 }}>Clear</button>
              </div>
              {summaryOutput && <div className="ai-result-panel" style={{ fontSize: 12.5, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{summaryOutput}</div>}
            </div>
          )}

          {/* ── Citations ── */}
          {activeTool === 'citations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Field label="Citation Format">
                  <select value={citationFormat} onChange={e => setCitationFormat(e.target.value)} style={inputStyle}>
                    {['APA', 'MLA', 'IEEE', 'Chicago', 'Harvard'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </Field>
                <Field label="Source Type">
                  <select value={genericTone} onChange={e => setGenericTone(e.target.value)} style={inputStyle}>
                    <option value="journal">Journal Article</option>
                    <option value="book">Book</option>
                    <option value="website">Website</option>
                    <option value="conference">Conference Paper</option>
                  </select>
                </Field>
              </div>
              <Field label="Source URL or Details">
                <input value={citationInput} onChange={e => setCitationInput(e.target.value)} placeholder="https://doi.org/... or paste source details" style={inputStyle} />
              </Field>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" checked={genericIncludeExamples} onChange={e => setGenericIncludeExamples(e.target.checked)} style={{ accentColor: '#6366f1', width: 14, height: 14 }} />
                Include annotation / summary
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={generateCitation} disabled={processing || !citationInput} className="ai-btn-primary" style={{ flex: 1 }}>{processing ? <><div className="ai-spinner" /> Generating...</> : <><BookMarked size={15} /> Generate Citation</>}</button>
                <button onClick={() => setCitationOutput('')} className="ai-btn-secondary" style={{ marginTop: 0 }}>Clear</button>
              </div>
              {citationOutput && <div className="ai-result-panel" style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.7 }}>{citationOutput}</div>}
            </div>
          )}

          {/* ── Generic tool message for others ── */}
          {!['slide-gen', 'quiz-gen', 'code-explain', 'code-review', 'voice-narration', 'chatbot', 'plagiarism', 'translate', 'lesson-plan', 'mindmap', 'learning-path', 'summarizer', 'citations'].includes(activeTool) && (() => {
            const config = activeTool ? ADVANCED_TOOL_CONFIG[activeTool] : undefined;
            const result = activeTool ? advancedResults[activeTool] : null;

            if (config && activeTool) {
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <Field label="Audience">
                      <select value={genericAudience} onChange={e => setGenericAudience(e.target.value)} style={inputStyle}>
                        <option value="students">Students</option>
                        <option value="teachers">Teachers</option>
                        <option value="parents">Parents</option>
                        <option value="mixed">Mixed Audience</option>
                        <option value="enterprise">Enterprise Teams</option>
                      </select>
                    </Field>
                    <Field label="Tone">
                      <select value={genericTone} onChange={e => setGenericTone(e.target.value)} style={inputStyle}>
                        <option value="professional">Professional</option>
                        <option value="academic">Academic</option>
                        <option value="friendly">Friendly</option>
                        <option value="technical">Technical</option>
                        <option value="executive">Executive</option>
                      </select>
                    </Field>
                  </div>

                  {config.fields.map(field => (
                    <Field key={field.key} label={field.label}>
                      {field.type === 'textarea' ? (
                        <textarea
                          rows={field.rows || 4}
                          value={getAdvancedValue(activeTool, field)}
                          onChange={e => setAdvancedValue(activeTool, field.key, e.target.value)}
                          placeholder={field.placeholder}
                          style={inputStyle}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          value={getAdvancedValue(activeTool, field)}
                          onChange={e => setAdvancedValue(activeTool, field.key, e.target.value)}
                          style={inputStyle}
                        >
                          {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : field.type === 'toggle' ? (
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                          <input
                            type="checkbox"
                            checked={getAdvancedValue(activeTool, field) === 'true'}
                            onChange={e => setAdvancedValue(activeTool, field.key, e.target.checked ? 'true' : 'false')}
                          />
                          Enabled
                        </label>
                      ) : (
                        <input
                          type={field.type === 'number' ? 'number' : 'text'}
                          value={getAdvancedValue(activeTool, field)}
                          onChange={e => setAdvancedValue(activeTool, field.key, e.target.value)}
                          placeholder={field.placeholder}
                          style={inputStyle}
                        />
                      )}
                    </Field>
                  ))}

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={genericIncludeExamples} onChange={e => setGenericIncludeExamples(e.target.checked)} />
                    Include practical examples
                  </label>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => runAdvancedTool(activeTool)} disabled={processing} className="ai-btn-primary" style={{ flex: 1 }}>
                      {processing ? <><div className="ai-spinner" /> Generating...</> : <><Sparkles size={15} /> Generate {config.outputLabel}</>}
                    </button>
                    <button onClick={() => setAdvancedResults(prev => ({ ...prev, [activeTool]: null }))} className="ai-btn-secondary" style={{ marginTop: 0 }}>Clear</button>
                  </div>

                  {result && (
                    <div className="ai-result-panel">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 500 }}>{config.outputLabel} &middot; {result.generatedAt}</div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={async () => navigator.clipboard.writeText(result.markdown)} className="ai-btn-secondary"><Copy size={12} /> Copy</button>
                          <button onClick={async () => copyResultJson(result)} className="ai-btn-secondary"><Copy size={12} /> JSON</button>
                          <button onClick={() => {
                            const blob = new Blob([result.markdown], { type: 'text/markdown' });
                            const a = document.createElement('a');
                            a.href = URL.createObjectURL(blob);
                            a.download = `${activeTool}-output.md`;
                            a.click();
                            URL.revokeObjectURL(a.href);
                          }} className="ai-btn-secondary"><Download size={12} /></button>
                        </div>
                      </div>
                      {renderToolSpecificOutput(activeTool, result.machine)}
                      {renderStructuredOutput(result.structured)}
                      <div style={{ maxHeight: 280, overflow: 'auto', whiteSpace: 'pre-wrap', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                        {result.markdown}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Field label="Input">
                  <textarea rows={5} value={genericInput} onChange={e => setGenericInput(e.target.value)} placeholder={`Provide input for ${tool.name}…`} style={inputStyle} />
                </Field>
                <button onClick={runGenericTool} disabled={processing || !genericInput.trim()} className="ai-btn-primary" style={{ flex: 1 }}>
                  {processing ? <><div className="ai-spinner" /> Generating...</> : <><Sparkles size={15} /> Generate Output</>}
                </button>
                {genericResult && (
                  <div className="ai-result-panel" style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginBottom: 10 }}>
                      <button onClick={copyGenericOutput} className="ai-btn-secondary"><Copy size={12} /> Copy</button>
                      <button onClick={async () => copyResultJson(genericResult)} className="ai-btn-secondary"><Copy size={12} /> JSON</button>
                      <button onClick={downloadGenericOutput} className="ai-btn-secondary"><Download size={12} /></button>
                    </div>
                    {activeTool && renderToolSpecificOutput(activeTool, genericResult.machine)}
                    {renderStructuredOutput(genericResult.structured)}
                    <div style={{ maxHeight: 280, overflow: 'auto', whiteSpace: 'pre-wrap', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{genericResult.markdown}</div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </motion.div>
    );
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* ── Premium Header ── */}
      <div style={{
        padding: '24px 32px', borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(160deg, rgba(99,102,241,0.06) 0%, transparent 50%, rgba(139,92,246,0.04) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle ambient glow */}
        <div style={{ position: 'absolute', top: -60, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
          }}>
            <Sparkles size={22} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>AI Tools</h1>
            <p style={{ margin: '2px 0 0', fontSize: 13.5, color: 'var(--text-muted)', fontWeight: 500 }}>30 AI-powered tools for content creation, assessment & learning</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {/* Usage stats pills */}
          <div style={{
            display: 'flex', gap: 2, padding: '4px',
            background: 'rgba(32,32,37,0.6)', borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(8px)',
          }}>
            {[
              { label: 'Requests', val: usageStats.totalRequests.toLocaleString() },
              { label: 'Tokens', val: (usageStats.tokensUsed / 1000).toFixed(0) + 'K' },
              { label: 'Slides', val: String(usageStats.slidesGenerated) },
            ].map(s => (
              <div key={s.label} className="ai-stat">
                <div className="ai-stat-value">{s.val}</div>
                <div className="ai-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* ── Tool Grid Area ── */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px 40px' }}>
          {/* Search + filter bar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} strokeWidth={2} style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', pointerEvents: 'none',
              }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search tools..."
                className="ai-search-input" />
            </div>
          </div>

          {/* Category chips */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)}
                className={`ai-category-chip ${category === c.id ? 'active' : ''}`}>
                {c.label}
                <span style={{ opacity: 0.6, marginLeft: 4, fontSize: 11 }}>{c.count}</span>
              </button>
            ))}
          </div>

          {/* Tool grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((tool, idx) => (
                <motion.div key={tool.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: idx * 0.02 }}
                  className={`ai-tool-card ${activeTool === tool.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTool(tool.id);
                    setToolError('');
                    setToolInfo('');
                    setGenericResult(null);
                    const config = ADVANCED_TOOL_CONFIG[tool.id];
                    if (config && !advancedInputs[tool.id]) {
                      const defaults: Record<string, string> = {};
                      config.fields.forEach(field => {
                        defaults[field.key] = field.defaultValue || '';
                      });
                      setAdvancedInputs(prev => ({ ...prev, [tool.id]: defaults }));
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10, position: 'relative', zIndex: 1 }}>
                    <ToolIconBox toolId={tool.id} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{tool.name}</div>
                        {tool.tag && (
                          <span className={`ai-tag ${tool.tag === 'New' ? 'ai-tag-new' : 'ai-tag-popular'}`}>{tool.tag}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55, position: 'relative', zIndex: 1 }}>{tool.desc}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              color: 'var(--text-muted)',
            }}>
              <Search size={40} strokeWidth={1} style={{ marginBottom: 12, opacity: 0.3 }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>No tools found</div>
              <div style={{ fontSize: 13 }}>Try a different search or category</div>
            </div>
          )}
        </div>

        {/* ── Active tool panel ── */}
        <AnimatePresence>
          {activeTool && renderToolPanel()}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Field helper ── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ flex: 1 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', fontSize: 13, background: 'rgba(32,32,37,0.8)',
  color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, outline: 'none', resize: 'none',
  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
};

const btnPrimary: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  padding: '12px 20px', fontSize: 13, fontWeight: 700, border: 'none', borderRadius: 12,
  background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', cursor: 'pointer', width: '100%',
  boxShadow: '0 2px 8px rgba(99,102,241,0.3)', transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
};

const btnSecondary: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  padding: '7px 14px', fontSize: 12, fontWeight: 600, background: 'rgba(38,38,43,0.8)',
  color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
  cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
};
