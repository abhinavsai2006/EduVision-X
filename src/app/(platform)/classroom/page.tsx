'use client';
/* ═══════════════════════════════════════════════════════
   Classroom v4.0 — Google Classroom Inspired
   Multi-class, Announcements, Assignments, Students,
   Quiz, Discussion, Attendance, Resources, Groups
   No live session — pure async education hub
   ═══════════════════════════════════════════════════════ */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Types ─── */
interface ClassRoom {
  id: string; name: string; section: string; subject: string;
  color: string; code: string; teacher: string; students: number;
  banner: string; createdAt: string;
}
interface Assignment {
  id: string; classId: string; title: string; instructions: string;
  dueDate: string; points: number; status: 'draft' | 'posted' | 'closed';
  category: string; attachments: string[]; submissions: number; total: number;
  rubric?: { criterion: string; points: number }[];
}
interface Student {
  id: string; name: string; email: string; avatar: string;
  joinedAt: string; grade: string; status: 'active' | 'invited';
}
interface Announcement {
  id: string; classId: string; text: string; author: string;
  postedAt: string; comments: { author: string; text: string; time: string }[];
  attachments: string[];
}
interface QuizQuestion {
  id: string; text: string; type: 'mcq' | 'short' | 'truefalse';
  options?: string[]; answer?: string | number; points: number;
}
interface Quiz {
  id: string; classId: string; title: string; dueDate: string;
  timeLimit: number; questions: QuizQuestion[];
  status: 'draft' | 'posted' | 'closed'; submissions: number;
}
interface DiscussionPost {
  id: string; classId: string; title: string; body: string;
  author: string; postedAt: string; replies: number; likes: number;
  pinned: boolean; resolved?: boolean;
}
interface AttendanceSession {
  id: string; classId: string; date: string; topic: string;
  records: { studentId: string; status: 'present' | 'absent' | 'late' | 'excused' }[];
}
interface Resource {
  id: string; classId: string; name: string; type: string;
  size: string; uploadedBy: string; uploadedAt: string; url: string; topic: string;
}
interface Group {
  id: string; classId: string; name: string; members: string[];
  description: string; createdAt: string;
}

/* ─── Mock Data ─── */
const DEFAULT_CLASSES: ClassRoom[] = [
  { id: 'cls1', name: 'Data Structures & Algorithms', section: 'CS-301 · Section A', subject: 'Computer Science', color: '#6366f1', code: 'XKPL92', teacher: 'Prof. Alice Chen', students: 28, banner: '🌲', createdAt: '2026-01-15' },
  { id: 'cls2', name: 'Machine Learning Fundamentals', section: 'CS-401 · Section B', subject: 'Data Science', color: '#10b981', code: 'MNQR47', teacher: 'Prof. Alice Chen', students: 22, banner: '🧠', createdAt: '2026-01-20' },
  { id: 'cls3', name: 'Web Development Bootcamp', section: 'CS-201 · Section C', subject: 'Software Engineering', color: '#f59e0b', code: 'ZRWS51', teacher: 'Prof. Alice Chen', students: 35, banner: '🌐', createdAt: '2026-02-01' },
];
const DEFAULT_STUDENTS: Student[] = [
  { id: 's1', name: 'Bob Kumar', email: 'bob@university.edu', avatar: '👨‍💻', joinedAt: '2026-01-16', grade: '87%', status: 'active' },
  { id: 's2', name: 'Carla Diaz', email: 'carla@university.edu', avatar: '👩‍💻', joinedAt: '2026-01-16', grade: '94%', status: 'active' },
  { id: 's3', name: 'David Obi', email: 'david@university.edu', avatar: '🧑‍💻', joinedAt: '2026-01-17', grade: '72%', status: 'active' },
  { id: 's4', name: 'Emma Wilson', email: 'emma@university.edu', avatar: '👩‍🎓', joinedAt: '2026-01-17', grade: '91%', status: 'active' },
  { id: 's5', name: 'Feng Li', email: 'feng@university.edu', avatar: '🧑‍🎓', joinedAt: '2026-01-18', grade: '68%', status: 'active' },
  { id: 's6', name: 'Grace Park', email: 'grace@university.edu', avatar: '👩‍🔬', joinedAt: '2026-01-18', grade: '96%', status: 'active' },
  { id: 's7', name: 'Hiro Tanaka', email: 'hiro@university.edu', avatar: '👨‍🎓', joinedAt: '2026-01-19', grade: '83%', status: 'active' },
  { id: 's8', name: 'Invited User', email: 'invite@test.com', avatar: '👤', joinedAt: '', grade: '—', status: 'invited' },
];
const DEFAULT_ASSIGNMENTS: Assignment[] = [
  { id: 'a1', classId: 'cls1', title: 'Binary Search Tree Implementation', instructions: 'Implement a BST with insert, delete, search, and traversal methods. Submit a working Python file with unit tests.', dueDate: '2026-03-15', points: 100, status: 'posted', category: 'Coding', attachments: ['starter.py'], submissions: 18, total: 28, rubric: [{ criterion: 'Correctness', points: 50 }, { criterion: 'Code Quality', points: 30 }, { criterion: 'Tests', points: 20 }] },
  { id: 'a2', classId: 'cls1', title: 'Graph Algorithms Essay', instructions: 'Write a 2-page essay comparing BFS and DFS, analyzing their time/space complexities and use cases.', dueDate: '2026-03-20', points: 50, status: 'posted', category: 'Essay', attachments: [], submissions: 12, total: 28 },
  { id: 'a3', classId: 'cls1', title: 'Sorting Algorithm Analysis', instructions: 'Implement and benchmark 5 sorting algorithms. Include Big-O analysis and performance graphs.', dueDate: '2026-03-25', points: 75, status: 'draft', category: 'Coding', attachments: [], submissions: 0, total: 28 },
  { id: 'a4', classId: 'cls2', title: 'Linear Regression from Scratch', instructions: 'Implement linear regression without scikit-learn. Use gradient descent and show convergence.', dueDate: '2026-03-18', points: 100, status: 'posted', category: 'Coding', attachments: ['notebook.ipynb'], submissions: 10, total: 22 },
];
const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  { id: 'ann1', classId: 'cls1', text: '📢 Midterm exam scheduled for March 28th. It will cover all topics from weeks 1-7. Practice problems are in the Resources tab.', author: 'Prof. Alice Chen', postedAt: '2026-03-03 09:00', attachments: ['practice_problems.pdf'], comments: [{ author: 'Bob Kumar', text: 'Will the exam be open book?', time: '10:32' }, { author: 'Prof. Alice Chen', text: 'No, closed book. But you can bring a 1-page formula sheet.', time: '11:05' }] },
  { id: 'ann2', classId: 'cls1', text: '📌 Office hours this week: Wednesday 2-4 PM, Friday 1-3 PM in Room 204B.', author: 'Prof. Alice Chen', postedAt: '2026-03-02 14:00', attachments: [], comments: [] },
  { id: 'ann3', classId: 'cls2', text: '🧠 Assignment 1 grades are posted. Check your feedback in the Assignments tab. Great work overall — average was 84%.', author: 'Prof. Alice Chen', postedAt: '2026-03-01 16:30', attachments: [], comments: [{ author: 'Carla Diaz', text: 'Thank you for the detailed feedback!', time: '17:15' }] },
];
const DEFAULT_QUIZZES: Quiz[] = [
  { id: 'q1', classId: 'cls1', title: 'Week 5 Check-in: Trees & Heaps', dueDate: '2026-03-10', timeLimit: 20, status: 'posted', submissions: 21, questions: [{ id: 'qq1', text: 'What is the time complexity of inserting into a BST?', type: 'mcq', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1, points: 5 }, { id: 'qq2', text: 'A complete binary tree with n nodes has height ___', type: 'short', answer: 'log(n)', points: 5 }, { id: 'qq3', text: 'A max-heap always stores the largest element at the root.', type: 'truefalse', answer: 'true', points: 5 }] },
  { id: 'q2', classId: 'cls1', title: 'Graph Algorithms Quiz', dueDate: '2026-03-20', timeLimit: 30, status: 'draft', submissions: 0, questions: [] },
];
const DEFAULT_DISCUSSIONS: DiscussionPost[] = [
  { id: 'd1', classId: 'cls1', title: 'How does AVL tree differ from Red-Black tree?', body: 'I understand both are self-balancing BSTs but I\'m confused about when to prefer one over the other. Can someone help clarify?', author: 'Bob Kumar', postedAt: '2026-03-02 18:00', replies: 7, likes: 12, pinned: true, resolved: false },
  { id: 'd2', classId: 'cls1', title: 'Study group for midterm preparation', body: 'Anyone interested in forming a study group? I was thinking of meeting on Saturday afternoons at the library.', author: 'Carla Diaz', postedAt: '2026-03-01 12:30', replies: 15, likes: 22, pinned: false, resolved: false },
  { id: 'd3', classId: 'cls1', title: "Question about Dijkstra's negative edges", body: "Why does Dijkstra fail with negative edge weights? I thought it uses a greedy approach so it should still work...", author: 'Anonymous', postedAt: '2026-02-28 20:00', replies: 4, likes: 8, pinned: false, resolved: true },
];
const DEFAULT_ATTENDANCE: AttendanceSession[] = [
  { id: 'att1', classId: 'cls1', date: '2026-03-03', topic: 'Heaps & Priority Queues', records: [{ studentId: 's1', status: 'present' }, { studentId: 's2', status: 'present' }, { studentId: 's3', status: 'absent' }, { studentId: 's4', status: 'present' }, { studentId: 's5', status: 'late' }, { studentId: 's6', status: 'present' }, { studentId: 's7', status: 'present' }] },
  { id: 'att2', classId: 'cls1', date: '2026-02-28', topic: 'Binary Search Trees', records: [{ studentId: 's1', status: 'present' }, { studentId: 's2', status: 'present' }, { studentId: 's3', status: 'present' }, { studentId: 's4', status: 'excused' }, { studentId: 's5', status: 'present' }, { studentId: 's6', status: 'present' }, { studentId: 's7', status: 'absent' }] },
];
const DEFAULT_RESOURCES: Resource[] = [
  { id: 'r1', classId: 'cls1', name: 'Week 5 Slides — Heaps.pdf', type: 'pdf', size: '3.2 MB', uploadedBy: 'Prof. Alice Chen', uploadedAt: '2026-03-01', url: '#', topic: 'Heaps' },
  { id: 'r2', classId: 'cls1', name: 'BST Starter Code.py', type: 'code', size: '12 KB', uploadedBy: 'Prof. Alice Chen', uploadedAt: '2026-03-02', url: '#', topic: 'Trees' },
  { id: 'r3', classId: 'cls1', name: 'Complexity Cheat Sheet.png', type: 'image', size: '240 KB', uploadedBy: 'Grace Park', uploadedAt: '2026-02-25', url: '#', topic: 'General' },
  { id: 'r4', classId: 'cls2', name: 'Gradient Descent Math.pdf', type: 'pdf', size: '1.8 MB', uploadedBy: 'Prof. Alice Chen', uploadedAt: '2026-02-28', url: '#', topic: 'Optimization' },
];
const DEFAULT_GROUPS: Group[] = [
  { id: 'g1', classId: 'cls1', name: 'Team Alpha', members: ['s1', 's2', 's3'], description: 'Working on BST project', createdAt: '2026-02-20' },
  { id: 'g2', classId: 'cls1', name: 'Team Beta', members: ['s4', 's5', 's6'], description: 'Graph algorithms study group', createdAt: '2026-02-20' },
  { id: 'g3', classId: 'cls1', name: 'Team Gamma', members: ['s7'], description: 'Solo project group', createdAt: '2026-02-21' },
];

/* ─── Helpers ─── */
const statusColor = (s: string) => ({ posted: '#22c55e', draft: '#f59e0b', closed: '#64748b', active: '#22c55e', invited: '#f59e0b' }[s] || '#64748b');
const fileIcon  = (t: string) => ({ pdf: '📄', code: '💻', image: '🖼️', zip: '📦', doc: '📝', video: '🎥' }[t] || '📁');
const attColor  = (s: string) => ({ present: '#22c55e', absent: '#ef4444', late: '#f59e0b', excused: '#6366f1' }[s] || '#64748b');

const iStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', fontSize: 13,
  background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
  outline: 'none', boxSizing: 'border-box',
};
const modalOverlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
  backdropFilter: 'blur(6px)', zIndex: 1000,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
};
const modalBox: React.CSSProperties = {
  background: 'linear-gradient(160deg, rgba(22,22,31,0.99), rgba(16,16,24,0.99))',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28,
  width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto',
};
const pill = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px',
  borderRadius: 99, fontSize: 11, fontWeight: 700,
  background: color + '18', color, border: `1px solid ${color}30`,
});
const btnP: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px',
  fontSize: 13, fontWeight: 700, border: 'none', borderRadius: 10, cursor: 'pointer',
  background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff',
};
const btnS: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px',
  fontSize: 12, fontWeight: 600, borderRadius: 10, cursor: 'pointer',
  background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)',
  border: '1px solid rgba(255,255,255,0.08)',
};

export default function ClassroomPage() {
  /* ─── State ─── */
  const [classes, setClasses]           = useState<ClassRoom[]>(DEFAULT_CLASSES);
  const [activeClassId, setActiveClassId] = useState<string>('cls1');
  const [activeTab, setActiveTab]       = useState<string>('stream');
  const [students]                      = useState<Student[]>(DEFAULT_STUDENTS);
  const [assignments, setAssignments]   = useState<Assignment[]>(DEFAULT_ASSIGNMENTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(DEFAULT_ANNOUNCEMENTS);
  const [quizzes, setQuizzes]           = useState<Quiz[]>(DEFAULT_QUIZZES);
  const [discussions, setDiscussions]   = useState<DiscussionPost[]>(DEFAULT_DISCUSSIONS);
  const [attendance, setAttendance]     = useState<AttendanceSession[]>(DEFAULT_ATTENDANCE);
  const [resources, setResources]       = useState<Resource[]>(DEFAULT_RESOURCES);
  const [groups, setGroups]             = useState<Group[]>(DEFAULT_GROUPS);

  /* Modals */
  const [showCreateClass,      setShowCreateClass]      = useState(false);
  const [showJoinClass,        setShowJoinClass]        = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showCreateQuiz,       setShowCreateQuiz]       = useState(false);
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);
  const [showNewAttendance,    setShowNewAttendance]    = useState(false);
  const [showUploadResource,   setShowUploadResource]   = useState(false);
  const [showCreateGroup,      setShowCreateGroup]      = useState(false);
  const [showShareLink,        setShowShareLink]        = useState(false);
  const [showAssignmentDetail, setShowAssignmentDetail] = useState<Assignment | null>(null);
  const [showQuizTake,         setShowQuizTake]         = useState<Quiz | null>(null);
  const [copiedCode, setCopiedCode]                     = useState(false);

  /* Form states */
  const [newClass,      setNewClass]      = useState({ name: '', section: '', subject: '', color: '#6366f1' });
  const [joinCode,      setJoinCode]      = useState('');
  const [newAnn,        setNewAnn]        = useState('');
  const [newAnnComment, setNewAnnComment] = useState<Record<string, string>>({});
  const [newAssignment, setNewAssignment] = useState({ title: '', instructions: '', dueDate: '', points: '100', category: 'Coding' });
  const [newQuiz,       setNewQuiz]       = useState({ title: '', dueDate: '', timeLimit: '30' });
  const [newDiscussion, setNewDiscussion] = useState({ title: '', body: '' });
  const [newGroup,      setNewGroup]      = useState({ name: '', description: '', members: [] as string[] });
  const [newResource,   setNewResource]   = useState({ name: '', type: 'pdf', topic: '' });
  const [attendanceDraft, setAttendanceDraft] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({});
  const [attTopic,      setAttTopic]      = useState('');
  const [quizAnswers,   setQuizAnswers]   = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeDiscussion, setActiveDiscussion] = useState<DiscussionPost | null>(null);
  const [searchStudents,   setSearchStudents]   = useState('');
  const [resourceFilter,   setResourceFilter]   = useState('All');
  const fileRef = useRef<HTMLInputElement>(null);

  const cls              = classes.find(c => c.id === activeClassId)!;
  const clsAssignments   = assignments.filter(a => a.classId === activeClassId);
  const clsAnnouncements = announcements.filter(a => a.classId === activeClassId);
  const clsQuizzes       = quizzes.filter(q => q.classId === activeClassId);
  const clsDiscussions   = discussions.filter(d => d.classId === activeClassId);
  const clsAttendance    = attendance.filter(a => a.classId === activeClassId);
  const allTopics        = Array.from(new Set(resources.filter(r => r.classId === activeClassId).map(r => r.topic)));
  const clsResources     = resources.filter(r => r.classId === activeClassId && (resourceFilter === 'All' || r.topic === resourceFilter));
  const clsGroups        = groups.filter(g => g.classId === activeClassId);

  const TABS = [
    { id: 'stream',      label: 'Stream',      icon: '📢' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'students',    label: 'Students',    icon: '👥' },
    { id: 'quiz',        label: 'Quizzes',     icon: '🧠' },
    { id: 'discussion',  label: 'Discussion',  icon: '💬' },
    { id: 'attendance',  label: 'Attendance',  icon: '📋' },
    { id: 'resources',   label: 'Resources',   icon: '📂' },
    { id: 'groups',      label: 'Groups',      icon: '🤝' },
  ];

  /* ─── Actions ─── */
  const createClass = () => {
    if (!newClass.name.trim()) return;
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    const nc: ClassRoom = {
      id: 'cls' + Date.now(), name: newClass.name, section: newClass.section,
      subject: newClass.subject, color: newClass.color, code,
      teacher: 'Prof. Alice Chen', students: 0, banner: '🏫',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setClasses(prev => [...prev, nc]);
    setActiveClassId(nc.id);
    setShowCreateClass(false);
    setNewClass({ name: '', section: '', subject: '', color: '#6366f1' });
  };

  const joinClass = () => {
    if (!joinCode.trim()) return;
    const found = classes.find(c => c.code === joinCode.trim().toUpperCase());
    if (found) setActiveClassId(found.id);
    else alert('Class code not found. Try: XKPL92');
    setShowJoinClass(false); setJoinCode('');
  };

  const postAnnouncement = () => {
    if (!newAnn.trim()) return;
    const ann: Announcement = {
      id: 'ann' + Date.now(), classId: activeClassId, text: newAnn,
      author: 'Prof. Alice Chen', postedAt: new Date().toLocaleString(),
      attachments: [], comments: [],
    };
    setAnnouncements(prev => [ann, ...prev]);
    setNewAnn('');
  };

  const addComment = (annId: string) => {
    const text = newAnnComment[annId];
    if (!text?.trim()) return;
    setAnnouncements(prev => prev.map(a => a.id === annId
      ? { ...a, comments: [...a.comments, { author: 'You', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] }
      : a));
    setNewAnnComment(prev => ({ ...prev, [annId]: '' }));
  };

  const createAssignment = () => {
    if (!newAssignment.title.trim()) return;
    const a: Assignment = {
      id: 'a' + Date.now(), classId: activeClassId,
      title: newAssignment.title, instructions: newAssignment.instructions,
      dueDate: newAssignment.dueDate, points: Number(newAssignment.points),
      status: 'posted', category: newAssignment.category,
      attachments: [], submissions: 0,
      total: students.filter(s => s.status === 'active').length,
    };
    setAssignments(prev => [...prev, a]);
    setShowCreateAssignment(false);
    setNewAssignment({ title: '', instructions: '', dueDate: '', points: '100', category: 'Coding' });
  };

  const createQuiz = () => {
    if (!newQuiz.title.trim()) return;
    const q: Quiz = {
      id: 'qz' + Date.now(), classId: activeClassId,
      title: newQuiz.title, dueDate: newQuiz.dueDate,
      timeLimit: Number(newQuiz.timeLimit),
      status: 'draft', submissions: 0, questions: [],
    };
    setQuizzes(prev => [...prev, q]);
    setShowCreateQuiz(false);
    setNewQuiz({ title: '', dueDate: '', timeLimit: '30' });
  };

  const createDiscussion = () => {
    if (!newDiscussion.title.trim()) return;
    const d: DiscussionPost = {
      id: 'd' + Date.now(), classId: activeClassId,
      title: newDiscussion.title, body: newDiscussion.body,
      author: 'You', postedAt: new Date().toLocaleString(),
      replies: 0, likes: 0, pinned: false,
    };
    setDiscussions(prev => [d, ...prev]);
    setShowCreateDiscussion(false);
    setNewDiscussion({ title: '', body: '' });
  };

  const saveAttendance = () => {
    if (!attTopic.trim()) return;
    const session: AttendanceSession = {
      id: 'att' + Date.now(), classId: activeClassId,
      date: new Date().toISOString().slice(0, 10), topic: attTopic,
      records: students.filter(s => s.status === 'active').map(s => ({
        studentId: s.id, status: attendanceDraft[s.id] || 'absent',
      })),
    };
    setAttendance(prev => [session, ...prev]);
    setShowNewAttendance(false);
    setAttendanceDraft({}); setAttTopic('');
  };

  const uploadResource = () => {
    if (!newResource.name.trim()) return;
    const r: Resource = {
      id: 'r' + Date.now(), classId: activeClassId,
      name: newResource.name, type: newResource.type,
      size: '—', uploadedBy: 'You',
      uploadedAt: new Date().toISOString().slice(0, 10),
      url: '#', topic: newResource.topic || 'General',
    };
    setResources(prev => [...prev, r]);
    setShowUploadResource(false);
    setNewResource({ name: '', type: 'pdf', topic: '' });
  };

  const createGroup = () => {
    if (!newGroup.name.trim()) return;
    const g: Group = {
      id: 'g' + Date.now(), classId: activeClassId,
      name: newGroup.name, description: newGroup.description,
      members: newGroup.members, createdAt: new Date().toISOString().slice(0, 10),
    };
    setGroups(prev => [...prev, g]);
    setShowCreateGroup(false);
    setNewGroup({ name: '', description: '', members: [] });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(cls.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name || id;
  const getAttSummary  = (session: AttendanceSession) => {
    const present = session.records.filter(r => r.status === 'present').length;
    return `${present}/${session.records.length} present`;
  };

  /* ─── Sub-components ─── */

  /* Sidebar */
  const Sidebar = () => (
    <div style={{ width: 260, flexShrink: 0, background: 'rgba(16,16,24,0.95)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 12 }}>🎒 Classroom</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setShowCreateClass(true)} style={{ ...btnP, flex: 1, justifyContent: 'center', fontSize: 12, padding: '7px 10px' }}>+ Create</button>
          <button onClick={() => setShowJoinClass(true)}   style={{ ...btnS, flex: 1, justifyContent: 'center', fontSize: 12, padding: '7px 10px' }}>↗ Join</button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
        {classes.map(c => (
          <div key={c.id} onClick={() => { setActiveClassId(c.id); setActiveTab('stream'); setActiveDiscussion(null); }}
            style={{ padding: '10px 16px', cursor: 'pointer', borderLeft: `3px solid ${activeClassId === c.id ? c.color : 'transparent'}`, background: activeClassId === c.id ? 'rgba(255,255,255,0.04)' : 'transparent', transition: 'all .15s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: c.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{c.banner}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.section}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* Modal wrapper */
  const Modal = ({ show, onClose, title, children }: { show: boolean; onClose: () => void; title: string; children: React.ReactNode }) =>
    show ? (
      <div style={modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} style={modalBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{title}</h3>
            <button onClick={onClose} style={{ ...btnS, padding: '4px 8px', fontSize: 12 }}>✕</button>
          </div>
          {children}
        </motion.div>
      </div>
    ) : null;

  /* Field label helper */
  const FL = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );

  /* ─── Tab content components ─── */

  const StreamTab = () => (
    <div style={{ maxWidth: 740, margin: '0 auto', padding: '24px 0' }}>
      {/* Post box */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>📢 Share with class</div>
        <textarea value={newAnn} onChange={e => setNewAnn(e.target.value)} rows={3}
          placeholder="Announce something to your class…"
          style={{ ...iStyle, resize: 'none', marginBottom: 10 }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={postAnnouncement} disabled={!newAnn.trim()} style={{ ...btnP, opacity: newAnn.trim() ? 1 : 0.5 }}>📢 Post</button>
        </div>
      </div>

      {/* Announcements feed */}
      {clsAnnouncements.map(ann => (
        <div key={ann.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,${cls.color},#4f46e5)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>👩‍🏫</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{ann.author}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ann.postedAt}</div>
            </div>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 12px', whiteSpace: 'pre-wrap' }}>{ann.text}</p>
          {ann.attachments.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {ann.attachments.map(a => (
                <div key={a} style={{ padding: '6px 12px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 8, fontSize: 12, color: '#a5b4fc', cursor: 'pointer' }}>📎 {a}</div>
              ))}
            </div>
          )}
          {/* Comments */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
            {ann.comments.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>👤</div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '7px 12px', flex: 1 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-primary)' }}>{c.author} </span>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>· {c.time}: </span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.text}</span>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input value={newAnnComment[ann.id] || ''} onChange={e => setNewAnnComment(prev => ({ ...prev, [ann.id]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addComment(ann.id)}
                placeholder="Add a comment…" style={{ ...iStyle, fontSize: 12, padding: '8px 12px' }} />
              <button onClick={() => addComment(ann.id)} style={{ ...btnS, fontSize: 11 }}>Post</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const AssignmentsTab = () => (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Assignments</h2>
        <button onClick={() => setShowCreateAssignment(true)} style={btnP}>+ Create Assignment</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {clsAssignments.map(a => (
          <div key={a.id} onClick={() => setShowAssignmentDetail(a)}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: cls.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📝</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{a.title}</span>
                <span style={pill(statusColor(a.status))}>{a.status}</span>
                <span style={{ ...pill('#64748b'), marginLeft: 'auto' }}>{a.category}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                <span>📅 Due: {a.dueDate}</span>
                <span>⭐ {a.points} pts</span>
                <span>📊 {a.submissions}/{a.total} submitted</span>
              </div>
            </div>
            {/* Circular progress */}
            <div style={{ width: 56, height: 56, flexShrink: 0 }}>
              <svg viewBox="0 0 56 56" style={{ width: '100%', height: '100%' }}>
                <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"/>
                <circle cx="28" cy="28" r="22" fill="none" stroke={cls.color} strokeWidth="5"
                  strokeDasharray={`${(a.submissions / Math.max(a.total, 1)) * 138.2} 138.2`}
                  strokeLinecap="round" strokeDashoffset="34.6" transform="rotate(-90 28 28)"/>
                <text x="28" y="33" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-primary)">{Math.round((a.submissions / Math.max(a.total, 1)) * 100)}%</text>
              </svg>
            </div>
          </div>
        ))}
        {clsAssignments.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px 0' }}>No assignments yet. Create one to get started.</div>
        )}
      </div>
    </div>
  );

  const StudentsTab = () => {
    const filtered = students.filter(s =>
      s.name.toLowerCase().includes(searchStudents.toLowerCase()) ||
      s.email.toLowerCase().includes(searchStudents.toLowerCase()));
    return (
      <div style={{ padding: '24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Students ({students.filter(s => s.status === 'active').length})</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowShareLink(true)} style={btnS}>🔗 Invite via Link</button>
            <button style={btnP}>+ Invite Students</button>
          </div>
        </div>
        <input value={searchStudents} onChange={e => setSearchStudents(e.target.value)}
          placeholder="Search students by name or email…" style={{ ...iStyle, marginBottom: 16 }} />
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 80px', padding: '10px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>Student</span><span>Email</span><span>Grade</span><span>Status</span><span></span>
          </div>
          {filtered.map(s => (
            <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 80px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: cls.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{s.avatar}</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.email}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: s.grade === '—' ? 'var(--text-muted)' : '#22c55e' }}>{s.grade}</span>
              <span style={pill(statusColor(s.status))}>{s.status}</span>
              <button style={{ ...btnS, padding: '4px 8px', fontSize: 11 }}>···</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const QuizTab = () => (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Quizzes</h2>
        <button onClick={() => setShowCreateQuiz(true)} style={btnP}>+ Create Quiz</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {clsQuizzes.map(q => (
          <div key={q.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#8b5cf618', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🧠</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{q.title}</span>
                <span style={pill(statusColor(q.status))}>{q.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                <span>📅 Due: {q.dueDate || 'No date'}</span>
                <span>⏱️ {q.timeLimit} min</span>
                <span>❓ {q.questions.length} questions</span>
                <span>📊 {q.submissions} submitted</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {q.status === 'posted' && (
                <button onClick={() => { setShowQuizTake(q); setQuizAnswers({}); setQuizSubmitted(false); }} style={btnP}>Take Quiz</button>
              )}
              <button style={btnS}>Edit</button>
            </div>
          </div>
        ))}
        {clsQuizzes.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px 0' }}>No quizzes yet.</div>
        )}
      </div>
    </div>
  );

  const DiscussionTab = () => (
    <div style={{ padding: '24px 0' }}>
      {activeDiscussion ? (
        <>
          <button onClick={() => setActiveDiscussion(null)} style={{ ...btnS, marginBottom: 16 }}>← Back</button>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              {activeDiscussion.pinned   && <span style={pill('#f59e0b')}>📌 Pinned</span>}
              {activeDiscussion.resolved && <span style={pill('#22c55e')}>✅ Resolved</span>}
            </div>
            <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{activeDiscussion.title}</h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 16 }}>{activeDiscussion.body}</p>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Posted by {activeDiscussion.author} · {activeDiscussion.postedAt}</div>
            <div style={{ marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>💬 {activeDiscussion.replies} replies · ❤️ {activeDiscussion.likes} likes</div>
            {/* Reply box */}
            <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
              <textarea rows={2} placeholder="Write a reply…" style={{ ...iStyle, resize: 'none', flex: 1 }} />
              <button style={btnP}>Reply</button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Discussion Board</h2>
            <button onClick={() => setShowCreateDiscussion(true)} style={btnP}>+ Start Discussion</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {clsDiscussions.map(d => (
              <div key={d.id} onClick={() => setActiveDiscussion(d)}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 20px', cursor: 'pointer', display: 'flex', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>💬</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{d.title}</span>
                    {d.pinned   && <span style={pill('#f59e0b')}>📌</span>}
                    {d.resolved && <span style={pill('#22c55e')}>✅</span>}
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 500 }}>{d.body}</p>
                  <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>👤 {d.author}</span><span>🕐 {d.postedAt}</span>
                    <span>💬 {d.replies}</span><span>❤️ {d.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const AttendanceTab = () => (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Attendance</h2>
        <button onClick={() => setShowNewAttendance(true)} style={btnP}>+ Mark Attendance</button>
      </div>
      {clsAttendance.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
          {(['present', 'absent', 'late', 'excused'] as const).map(s => {
            const total = clsAttendance.flatMap(a => a.records).filter(r => r.status === s).length;
            return (
              <div key={s} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${attColor(s)}30`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, color: attColor(s), fontWeight: 800 }}>{total}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: 2 }}>{s}</div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {clsAttendance.map(session => (
          <div key={session.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{session.topic}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>📅 {session.date} · {getAttSummary(session)}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {session.records.map(r => (
                <div key={r.studentId} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 8, background: attColor(r.status) + '12', border: `1px solid ${attColor(r.status)}25` }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: attColor(r.status) }} />
                  <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{getStudentName(r.studentId)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ResourcesTab = () => {
    const topics = ['All', ...allTopics];
    return (
      <div style={{ padding: '24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Resources</h2>
          <button onClick={() => setShowUploadResource(true)} style={btnP}>+ Upload</button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {topics.map(t => (
            <button key={t} onClick={() => setResourceFilter(t)} style={{ ...btnS, padding: '6px 14px', background: resourceFilter === t ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.04)', color: resourceFilter === t ? '#a5b4fc' : 'var(--text-muted)', border: resourceFilter === t ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.08)' }}>{t}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {clsResources.map(r => (
            <div key={r.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{fileIcon(r.type)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.size} · {r.uploadedBy} · {r.uploadedAt}</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={pill('#6366f1')}>{r.topic}</span>
                  <button style={{ ...btnS, padding: '3px 8px', fontSize: 10 }}>⬇ Download</button>
                </div>
              </div>
            </div>
          ))}
          {clsResources.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>No resources in this topic.</div>
          )}
        </div>
      </div>
    );
  };

  const GroupsTab = () => (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Student Groups</h2>
        <button onClick={() => setShowCreateGroup(true)} style={btnP}>+ Create Group</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {clsGroups.map(g => (
          <div key={g.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>🤝 {g.name}</div>
              <button style={{ ...btnS, padding: '3px 8px', fontSize: 10 }}>Edit</button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 12px' }}>{g.description}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {g.members.map(mid => (
                <div key={mid} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', fontSize: 12, color: 'var(--text-secondary)' }}>
                  {students.find(s => s.id === mid)?.avatar || '👤'} {getStudentName(mid)}
                </div>
              ))}
              {g.members.length === 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No members yet</span>}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>Created {g.createdAt}</div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ─── Render ─── */
  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      <Sidebar />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Class header banner */}
        <div style={{ background: `linear-gradient(135deg,${cls?.color}22,${cls?.color}06)`, borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 32px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: cls?.color + '22', border: `2px solid ${cls?.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{cls?.banner}</div>
              <div>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{cls?.name}</h1>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{cls?.section} · {cls?.teacher} · {cls?.students} students</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={() => setShowShareLink(true)} style={{ ...btnS, gap: 6 }}>
                🔗 <span style={{ fontSize: 13, fontWeight: 700, color: cls?.color }}>{cls?.code}</span>
              </button>
              <button onClick={() => setShowShareLink(true)} style={btnP}>Share Class</button>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => { setActiveTab(t.id); setActiveDiscussion(null); }}
                style={{ padding: '10px 18px', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', background: 'transparent', color: activeTab === t.id ? cls?.color : 'var(--text-muted)', borderBottom: `2px solid ${activeTab === t.id ? cls?.color : 'transparent'}`, transition: 'all .15s', whiteSpace: 'nowrap' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 32px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab + activeClassId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              {activeTab === 'stream'      && <StreamTab />}
              {activeTab === 'assignments' && <AssignmentsTab />}
              {activeTab === 'students'    && <StudentsTab />}
              {activeTab === 'quiz'        && <QuizTab />}
              {activeTab === 'discussion'  && <DiscussionTab />}
              {activeTab === 'attendance'  && <AttendanceTab />}
              {activeTab === 'resources'   && <ResourcesTab />}
              {activeTab === 'groups'      && <GroupsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ══════════════════════════ MODALS ══════════════════════════ */}

      {/* Create Class */}
      <Modal show={showCreateClass} onClose={() => setShowCreateClass(false)} title="🏫 Create Class">
        <FL label="Class Name"><input value={newClass.name} onChange={e => setNewClass(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Data Structures & Algorithms" style={iStyle} /></FL>
        <FL label="Section"><input value={newClass.section} onChange={e => setNewClass(p => ({ ...p, section: e.target.value }))} placeholder="e.g., CS-301 · Section A" style={iStyle} /></FL>
        <FL label="Subject"><input value={newClass.subject} onChange={e => setNewClass(p => ({ ...p, subject: e.target.value }))} placeholder="e.g., Computer Science" style={iStyle} /></FL>
        <FL label="Theme Color">
          <div style={{ display: 'flex', gap: 8 }}>
            {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'].map(c => (
              <div key={c} onClick={() => setNewClass(p => ({ ...p, color: c }))} style={{ width: 32, height: 32, borderRadius: '50%', background: c, cursor: 'pointer', border: newClass.color === c ? '3px solid #fff' : '2px solid transparent', transition: 'border .15s' }} />
            ))}
          </div>
        </FL>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
          <button onClick={() => setShowCreateClass(false)} style={btnS}>Cancel</button>
          <button onClick={createClass} style={btnP}>Create Class</button>
        </div>
      </Modal>

      {/* Join Class */}
      <Modal show={showJoinClass} onClose={() => setShowJoinClass(false)} title="↗ Join a Class">
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>Enter the class code provided by your instructor.</p>
        <FL label="Class Code">
          <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="e.g., XKPL92"
            style={{ ...iStyle, letterSpacing: '0.15em', fontWeight: 800, fontSize: 18, textAlign: 'center' }} />
        </FL>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={() => setShowJoinClass(false)} style={btnS}>Cancel</button>
          <button onClick={joinClass} style={btnP}>Join Class</button>
        </div>
      </Modal>

      {/* Share Link */}
      <Modal show={showShareLink} onClose={() => setShowShareLink(false)} title="🔗 Share Class Invite">
        <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>🔗</div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Share this code or link with students to join <strong style={{ color: 'var(--text-primary)' }}>{cls?.name}</strong></p>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px 20px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>CLASS CODE</div>
            <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '0.25em', color: cls?.color }}>{cls?.code}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: 'var(--text-muted)', wordBreak: 'break-all' }}>
            https://eduvision.io/join/{cls?.code}
          </div>
          <button onClick={copyCode} style={{ ...btnP, width: '100%', justifyContent: 'center', fontSize: 14 }}>
            {copiedCode ? '✅ Copied to clipboard!' : '📋 Copy Invite Link'}
          </button>
        </div>
      </Modal>

      {/* Create Assignment */}
      <Modal show={showCreateAssignment} onClose={() => setShowCreateAssignment(false)} title="📝 Create Assignment">
        <FL label="Title"><input value={newAssignment.title} onChange={e => setNewAssignment(p => ({ ...p, title: e.target.value }))} placeholder="Assignment title" style={iStyle} /></FL>
        <FL label="Instructions"><textarea value={newAssignment.instructions} onChange={e => setNewAssignment(p => ({ ...p, instructions: e.target.value }))} rows={4} placeholder="Describe what students need to do…" style={{ ...iStyle, resize: 'none' }} /></FL>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
          <FL label="Due Date"><input type="date" value={newAssignment.dueDate} onChange={e => setNewAssignment(p => ({ ...p, dueDate: e.target.value }))} style={iStyle} /></FL>
          <FL label="Points"><input type="number" value={newAssignment.points} onChange={e => setNewAssignment(p => ({ ...p, points: e.target.value }))} style={iStyle} /></FL>
          <FL label="Category">
            <select value={newAssignment.category} onChange={e => setNewAssignment(p => ({ ...p, category: e.target.value }))} style={iStyle}>
              {['Coding', 'Essay', 'Project', 'Lab', 'Quiz', 'Other'].map(c => <option key={c}>{c}</option>)}
            </select>
          </FL>
        </div>
        <FL label="Attachments">
          <button onClick={() => fileRef.current?.click()} style={{ ...btnS, width: '100%', justifyContent: 'center' }}>📎 Add files</button>
          <input ref={fileRef} type="file" multiple style={{ display: 'none' }} />
        </FL>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <button onClick={() => setShowCreateAssignment(false)} style={btnS}>Cancel</button>
          <button onClick={createAssignment} style={btnP}>Post Assignment</button>
        </div>
      </Modal>

      {/* Assignment Detail */}
      <Modal show={!!showAssignmentDetail} onClose={() => setShowAssignmentDetail(null)} title={'📝 ' + (showAssignmentDetail?.title || '')}>
        {showAssignmentDetail && (
          <>
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
              {[['Due Date', showAssignmentDetail.dueDate || '—'],['Points', showAssignmentDetail.points + ' pts'],['Category', showAssignmentDetail.category],['Status', showAssignmentDetail.status]].map(([k, v]) => (
                <div key={k} style={{ textAlign: 'center', flex: '1 1 80px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>INSTRUCTIONS</div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{showAssignmentDetail.instructions}</p>
            </div>
            {showAssignmentDetail.rubric && (
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>RUBRIC</div>
                {showAssignmentDetail.rubric.map(r => (
                  <div key={r.criterion} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span>{r.criterion}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.points} pts</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#22c55e' }}>{showAssignmentDetail.submissions}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Submitted</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#f59e0b' }}>{showAssignmentDetail.total - showAssignmentDetail.submissions}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pending</div>
              </div>
            </div>
            <button style={{ ...btnP, width: '100%', justifyContent: 'center' }}>📤 Submit Assignment</button>
          </>
        )}
      </Modal>

      {/* Create Quiz */}
      <Modal show={showCreateQuiz} onClose={() => setShowCreateQuiz(false)} title="🧠 Create Quiz">
        <FL label="Quiz Title"><input value={newQuiz.title} onChange={e => setNewQuiz(p => ({ ...p, title: e.target.value }))} placeholder="Quiz title" style={iStyle} /></FL>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FL label="Due Date"><input type="date" value={newQuiz.dueDate} onChange={e => setNewQuiz(p => ({ ...p, dueDate: e.target.value }))} style={iStyle} /></FL>
          <FL label="Time Limit (min)"><input type="number" value={newQuiz.timeLimit} onChange={e => setNewQuiz(p => ({ ...p, timeLimit: e.target.value }))} style={iStyle} /></FL>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <button onClick={() => setShowCreateQuiz(false)} style={btnS}>Cancel</button>
          <button onClick={createQuiz} style={btnP}>Create Quiz</button>
        </div>
      </Modal>

      {/* Take Quiz */}
      <Modal show={!!showQuizTake} onClose={() => setShowQuizTake(null)} title={'🧠 ' + (showQuizTake?.title || '')}>
        {showQuizTake && (
          quizSubmitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>Quiz Submitted!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Your answers have been recorded. Results will be available after grading.</p>
              <button onClick={() => setShowQuizTake(null)} style={{ ...btnP, marginTop: 20 }}>Close</button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>⏱️ {showQuizTake.timeLimit} min · {showQuizTake.questions.length} questions</div>
              {showQuizTake.questions.map((q, i) => (
                <div key={q.id} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 16, marginBottom: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Q{i + 1}. {q.text} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>({q.points} pts)</span></div>
                  {q.type === 'mcq' && q.options?.map((opt, j) => (
                    <label key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, marginBottom: 4, cursor: 'pointer', background: quizAnswers[q.id] === String(j) ? 'rgba(99,102,241,0.1)' : 'transparent', border: quizAnswers[q.id] === String(j) ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent' }}>
                      <input type="radio" name={q.id} checked={quizAnswers[q.id] === String(j)} onChange={() => setQuizAnswers(p => ({ ...p, [q.id]: String(j) }))} />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{opt}</span>
                    </label>
                  ))}
                  {q.type === 'truefalse' && ['True', 'False'].map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, marginBottom: 4, cursor: 'pointer', background: quizAnswers[q.id] === opt.toLowerCase() ? 'rgba(99,102,241,0.1)' : 'transparent', border: quizAnswers[q.id] === opt.toLowerCase() ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent' }}>
                      <input type="radio" name={q.id} checked={quizAnswers[q.id] === opt.toLowerCase()} onChange={() => setQuizAnswers(p => ({ ...p, [q.id]: opt.toLowerCase() }))} />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{opt}</span>
                    </label>
                  ))}
                  {q.type === 'short' && (
                    <input value={quizAnswers[q.id] || ''} onChange={e => setQuizAnswers(p => ({ ...p, [q.id]: e.target.value }))} placeholder="Your answer…" style={iStyle} />
                  )}
                </div>
              ))}
              <button onClick={() => setQuizSubmitted(true)} style={{ ...btnP, width: '100%', justifyContent: 'center', marginTop: 8 }}>✅ Submit Quiz</button>
            </>
          )
        )}
      </Modal>

      {/* Create Discussion */}
      <Modal show={showCreateDiscussion} onClose={() => setShowCreateDiscussion(false)} title="💬 Start Discussion">
        <FL label="Topic / Title"><input value={newDiscussion.title} onChange={e => setNewDiscussion(p => ({ ...p, title: e.target.value }))} placeholder="What do you want to discuss?" style={iStyle} /></FL>
        <FL label="Details"><textarea value={newDiscussion.body} onChange={e => setNewDiscussion(p => ({ ...p, body: e.target.value }))} rows={5} placeholder="Elaborate on your question or topic…" style={{ ...iStyle, resize: 'none' }} /></FL>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={() => setShowCreateDiscussion(false)} style={btnS}>Cancel</button>
          <button onClick={createDiscussion} style={btnP}>Post</button>
        </div>
      </Modal>

      {/* New Attendance */}
      <Modal show={showNewAttendance} onClose={() => setShowNewAttendance(false)} title="📋 Mark Attendance">
        <FL label="Session Topic"><input value={attTopic} onChange={e => setAttTopic(e.target.value)} placeholder="e.g., Binary Trees Lecture" style={iStyle} /></FL>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Students</div>
        <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          {students.filter(s => s.status === 'active').map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{s.avatar}</span>
                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{s.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['present', 'absent', 'late', 'excused'] as const).map(status => (
                  <button key={status} onClick={() => setAttendanceDraft(prev => ({ ...prev, [s.id]: status }))}
                    style={{ padding: '4px 8px', fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: 'pointer', border: 'none', background: attendanceDraft[s.id] === status ? attColor(status) : 'rgba(255,255,255,0.06)', color: attendanceDraft[s.id] === status ? '#fff' : 'var(--text-muted)', textTransform: 'capitalize', transition: 'all .1s' }}>
                    {status[0].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={() => setShowNewAttendance(false)} style={btnS}>Cancel</button>
          <button onClick={saveAttendance} style={btnP}>Save Attendance</button>
        </div>
      </Modal>

      {/* Upload Resource */}
      <Modal show={showUploadResource} onClose={() => setShowUploadResource(false)} title="📂 Upload Resource">
        <div style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 12, padding: 28, textAlign: 'center', marginBottom: 16, cursor: 'pointer' }} onClick={() => fileRef.current?.click()}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📁</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Click to browse or drag & drop</div>
          <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) setNewResource(p => ({ ...p, name: e.target.files![0].name })); }} />
        </div>
        <FL label="File Name"><input value={newResource.name} onChange={e => setNewResource(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Week 6 Slides.pdf" style={iStyle} /></FL>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FL label="Type">
            <select value={newResource.type} onChange={e => setNewResource(p => ({ ...p, type: e.target.value }))} style={iStyle}>
              {['pdf', 'code', 'image', 'zip', 'doc', 'video'].map(t => <option key={t}>{t}</option>)}
            </select>
          </FL>
          <FL label="Topic"><input value={newResource.topic} onChange={e => setNewResource(p => ({ ...p, topic: e.target.value }))} placeholder="e.g., Trees" style={iStyle} /></FL>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={() => setShowUploadResource(false)} style={btnS}>Cancel</button>
          <button onClick={uploadResource} style={btnP}>Upload</button>
        </div>
      </Modal>

      {/* Create Group */}
      <Modal show={showCreateGroup} onClose={() => setShowCreateGroup(false)} title="🤝 Create Group">
        <FL label="Group Name"><input value={newGroup.name} onChange={e => setNewGroup(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Team Alpha" style={iStyle} /></FL>
        <FL label="Description"><input value={newGroup.description} onChange={e => setNewGroup(p => ({ ...p, description: e.target.value }))} placeholder="What is this group for?" style={iStyle} /></FL>
        <FL label="Add Members">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 220, overflowY: 'auto' }}>
            {students.filter(s => s.status === 'active').map(s => (
              <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', background: newGroup.members.includes(s.id) ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)', transition: 'background .1s' }}>
                <input type="checkbox" checked={newGroup.members.includes(s.id)} onChange={e => setNewGroup(p => ({ ...p, members: e.target.checked ? [...p.members, s.id] : p.members.filter(m => m !== s.id) }))} />
                <span style={{ fontSize: 16 }}>{s.avatar}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.name}</span>
              </label>
            ))}
          </div>
        </FL>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <button onClick={() => setShowCreateGroup(false)} style={btnS}>Cancel</button>
          <button onClick={createGroup} style={btnP}>Create Group</button>
        </div>
      </Modal>
    </div>
  );
}
