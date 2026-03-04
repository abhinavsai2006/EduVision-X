'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/* ══════════════════════════════════════════════════
   SIMULATION CATALOG — Professional Hub v3.0
   15 fully-interactive, production-grade simulations
   Clean dark UI — zero glassmorphism
   ══════════════════════════════════════════════════ */

interface Simulation {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  time: string;
  tags: string[];
  color: string;
  icon: string;
  features: string[];
}

const SIMULATIONS: Simulation[] = [
  {
    id: 'sorting-visualizer',
    name: 'Sorting Visualizer',
    category: 'algorithms',
    categoryLabel: 'Algorithms',
    description: 'Visualize Bubble, Selection, Insertion, Merge, Quick, and Heap sort algorithms with step-by-step controls.',
    difficulty: 'Beginner',
    time: '5 min',
    tags: ['O(n²)', 'O(n log n)', 'comparison', 'step mode'],
    color: '#6366f1',
    icon: '▦',
    features: ['6 algorithms', 'Custom array', 'Step mode', 'Speed control', 'Complexity display'],
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'algorithms',
    categoryLabel: 'Algorithms',
    description: 'Watch left, right, and mid pointers converge on a target in a sorted array. Edit the array and target live.',
    difficulty: 'Beginner',
    time: '3 min',
    tags: ['O(log n)', 'sorted', 'divide & conquer'],
    color: '#22c55e',
    icon: '⟨⟩',
    features: ['Custom sorted array', 'Custom target', 'Pointer animation', 'Step-by-step trace'],
  },
  {
    id: 'graph-traversal',
    name: 'Graph Traversal',
    category: 'algorithms',
    categoryLabel: 'Algorithms',
    description: 'Explore BFS and DFS on interactive directed/undirected graphs. Add nodes and edges in real time.',
    difficulty: 'Intermediate',
    time: '8 min',
    tags: ['BFS', 'DFS', 'adjacency list', 'visited set'],
    color: '#f59e0b',
    icon: '⬡',
    features: ['BFS & DFS', 'Add/remove nodes', 'Directed or undirected', 'Traversal order log'],
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Shortest Path",
    category: 'algorithms',
    categoryLabel: 'Algorithms',
    description: 'Find shortest paths in weighted graphs with a priority queue. Edit edge weights and source node interactively.',
    difficulty: 'Advanced',
    time: '10 min',
    tags: ['greedy', 'priority queue', 'weighted graph'],
    color: '#8b5cf6',
    icon: '◈',
    features: ['Custom weights', 'Source node picker', 'Path highlight', 'Distance table'],
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    category: 'data-structures',
    categoryLabel: 'Data Structures',
    description: 'Perform insert, delete, search, and reverse on singly and doubly linked lists with pointer animation.',
    difficulty: 'Beginner',
    time: '5 min',
    tags: ['singly', 'doubly', 'pointer', 'O(n)'],
    color: '#06b6d4',
    icon: '⬤—⬤',
    features: ['Insert head/tail', 'Delete by value', 'Reverse', 'Singly & doubly', 'Pointer animation'],
  },
  {
    id: 'binary-tree',
    name: 'Binary Search Tree',
    category: 'data-structures',
    categoryLabel: 'Data Structures',
    description: 'Build a BST with insert, delete, and three traversal modes. Highlight balanced vs unbalanced states.',
    difficulty: 'Intermediate',
    time: '8 min',
    tags: ['BST', 'inorder', 'preorder', 'postorder'],
    color: '#10b981',
    icon: '⌿',
    features: ['Insert & delete', '3 traversals', 'Search path', 'Min/max highlight', 'Balance indicator'],
  },
  {
    id: 'cpu-scheduling',
    name: 'CPU Scheduling',
    category: 'operating-systems',
    categoryLabel: 'Operating Systems',
    description: 'Compare FCFS, SJF, Round Robin, and Priority scheduling with interactive Gantt charts and metrics.',
    difficulty: 'Intermediate',
    time: '10 min',
    tags: ['FCFS', 'SJF', 'Round Robin', 'Priority', 'Gantt'],
    color: '#f97316',
    icon: '⚙',
    features: ['4 algorithms', 'Custom processes', 'Gantt chart', 'Avg wait time', 'Turnaround time'],
  },
  {
    id: 'memory-management',
    name: 'Page Replacement',
    category: 'operating-systems',
    categoryLabel: 'Operating Systems',
    description: 'Simulate LRU, FIFO, and Optimal page replacement with custom reference strings and frame counts.',
    difficulty: 'Intermediate',
    time: '8 min',
    tags: ['LRU', 'FIFO', 'Optimal', 'page fault', 'frames'],
    color: '#ec4899',
    icon: '▦',
    features: ['LRU, FIFO, Optimal', 'Custom ref string', 'Page fault counter', 'Frame heat map'],
  },
  {
    id: 'tcp-handshake',
    name: 'TCP/IP Networking',
    category: 'networking',
    categoryLabel: 'Networking',
    description: 'Animate the full TCP 3-way handshake and 4-way teardown with packet-level detail and timing diagrams.',
    difficulty: 'Beginner',
    time: '5 min',
    tags: ['SYN', 'ACK', 'FIN', 'handshake', 'teardown'],
    color: '#3b82f6',
    icon: '⇄',
    features: ['3-way handshake', '4-way teardown', 'Packet labels', 'Timing diagram', 'State machine'],
  },
  {
    id: 'neural-network',
    name: 'Neural Network',
    category: 'ai-ml',
    categoryLabel: 'AI / ML',
    description: 'Configure layers, activation functions, and watch forward propagation light up neurons in real time.',
    difficulty: 'Advanced',
    time: '12 min',
    tags: ['layers', 'weights', 'activation', 'forward prop'],
    color: '#a855f7',
    icon: '◎',
    features: ['Custom layer config', 'Weight visualization', 'Activation functions', 'Loss display'],
  },
  {
    id: 'gradient-descent',
    name: 'Gradient Descent',
    category: 'ai-ml',
    categoryLabel: 'AI / ML',
    description: 'Watch a ball roll down a 2D loss landscape. Tweak learning rate and momentum to find minima faster.',
    difficulty: 'Intermediate',
    time: '8 min',
    tags: ['loss surface', 'learning rate', 'momentum', 'SGD'],
    color: '#14b8a6',
    icon: '∇',
    features: ['Loss landscape', 'Learning rate', 'Momentum', 'Loss history chart', 'SGD/Adam'],
  },
  {
    id: 'projectile-motion',
    name: 'Projectile Motion',
    category: 'physics',
    categoryLabel: 'Physics',
    description: 'Launch a projectile with custom angle, velocity, gravity, and air resistance. Trace the parabolic path.',
    difficulty: 'Beginner',
    time: '4 min',
    tags: ['kinematics', 'gravity', 'trajectory', 'parabola'],
    color: '#ef4444',
    icon: '↗',
    features: ['Custom angle/velocity', 'Air resistance', 'Gravity selector', 'Range/height readout'],
  },
  {
    id: 'pendulum',
    name: 'Double Pendulum',
    category: 'physics',
    categoryLabel: 'Physics',
    description: 'Simulate chaotic double pendulum motion with real ODE physics. Visualize the trace and energy chart.',
    difficulty: 'Advanced',
    time: '6 min',
    tags: ['chaos', 'ODE', 'energy', 'damping'],
    color: '#f59e0b',
    icon: '◓',
    features: ['Real physics ODE', 'Energy chart', 'Damping control', 'Chaos trace', 'Angle readout'],
  },
  {
    id: 'compiler-pipeline',
    name: 'Compiler Pipeline',
    category: 'systems',
    categoryLabel: 'Systems',
    description: 'Step through Lexer → Parser → AST → Code Gen pipeline with your own source code input.',
    difficulty: 'Advanced',
    time: '10 min',
    tags: ['lexer', 'parser', 'AST', 'IR', 'code gen'],
    color: '#6366f1',
    icon: '⊕',
    features: ['Custom source input', 'Token stream', 'AST display', 'IR output', 'Machine code'],
  },
  {
    id: 'k-means',
    name: 'K-Means Clustering',
    category: 'ai-ml',
    categoryLabel: 'AI / ML',
    description: 'Place custom data points, pick K, and watch centroids converge iteration by iteration with color coding.',
    difficulty: 'Intermediate',
    time: '6 min',
    tags: ['centroid', 'convergence', 'unsupervised', 'iterations'],
    color: '#8b5cf6',
    icon: '⊙',
    features: ['Custom data points', 'Choose K (2-8)', 'Centroid animation', 'WCSS chart', 'Auto-generate'],
  },
  /* ═══ NEW: 25 MORE ═══ */
  { id: 'hash-table', name: 'Hash Table', category: 'data-structures', categoryLabel: 'Data Structures', description: 'Insert, search, and delete keys with open addressing and chaining. Visualize bucket distribution and collision handling.', difficulty: 'Beginner', time: '5 min', tags: ['hash', 'collision', 'chaining', 'probing'], color: '#06b6d4', icon: '#', features: ['Open addressing', 'Chaining', 'Custom hash function', 'Load factor display'] },
  { id: 'stack-queue', name: 'Stack & Queue', category: 'data-structures', categoryLabel: 'Data Structures', description: 'Push, pop, enqueue, dequeue with animated LIFO/FIFO visualization and undo/redo history.', difficulty: 'Beginner', time: '3 min', tags: ['LIFO', 'FIFO', 'push', 'pop'], color: '#f59e0b', icon: '⊡', features: ['Stack & Queue side-by-side', 'Push/Pop/Enqueue/Dequeue', 'Undo history', 'Custom values'] },
  { id: 'heap', name: 'Heap / Priority Queue', category: 'data-structures', categoryLabel: 'Data Structures', description: 'Build min-heap and max-heap. Insert, extract, and heapify with tree + array dual visualization.', difficulty: 'Intermediate', time: '6 min', tags: ['min-heap', 'max-heap', 'heapify', 'priority'], color: '#22c55e', icon: '△', features: ['Min & Max heap', 'Insert & Extract', 'Heapify animation', 'Tree + array view'] },
  { id: 'a-star', name: 'A* Pathfinding', category: 'algorithms', categoryLabel: 'Algorithms', description: 'Draw walls on a grid, place start/end, and watch A* find the optimal path with heuristic visualization.', difficulty: 'Advanced', time: '12 min', tags: ['heuristic', 'shortest path', 'grid', 'Manhattan'], color: '#ef4444', icon: '⊞', features: ['Draw walls', 'Manhattan/Euclidean', 'Open/closed set', 'Path cost display'] },
  { id: 'convex-hull', name: 'Convex Hull', category: 'algorithms', categoryLabel: 'Algorithms', description: 'Click to place points and watch the convex hull algorithm wrap around them step by step.', difficulty: 'Intermediate', time: '5 min', tags: ['geometry', 'Graham scan', 'Jarvis march'], color: '#a855f7', icon: '⬠', features: ['Click to add points', 'Graham scan', 'Jarvis march', 'Step-by-step'] },
  { id: 'kmp', name: 'String Matching (KMP)', category: 'algorithms', categoryLabel: 'Algorithms', description: 'Visualize the Knuth-Morris-Pratt failure function and pattern matching with character-by-character highlighting.', difficulty: 'Intermediate', time: '6 min', tags: ['KMP', 'pattern', 'failure function', 'O(n+m)'], color: '#3b82f6', icon: '≡', features: ['Custom text & pattern', 'Failure function table', 'Match highlighting', 'Step mode'] },
  { id: 'matrix-multiply', name: 'Matrix Multiplication', category: 'algorithms', categoryLabel: 'Algorithms', description: 'Multiply two matrices with cell-by-cell animation showing dot product computation at each step.', difficulty: 'Beginner', time: '4 min', tags: ['matrix', 'dot product', 'linear algebra'], color: '#14b8a6', icon: '⊠', features: ['Custom matrix size', 'Cell-by-cell animation', 'Dot product highlight', 'Result matrix'] },
  { id: 'fibonacci-dp', name: 'Fibonacci DP', category: 'algorithms', categoryLabel: 'Algorithms', description: 'Compare recursive, memoized, and tabulated approaches. Visualize the call tree and DP table filling.', difficulty: 'Beginner', time: '4 min', tags: ['recursion', 'memoization', 'tabulation', 'O(n)'], color: '#f97316', icon: '🌀', features: ['Recursive call tree', 'Memoization cache', 'Bottom-up table', 'Performance comparison'] },
  { id: 'n-queens', name: 'N-Queens', category: 'algorithms', categoryLabel: 'Algorithms', description: 'Solve the N-Queens backtracking puzzle with step-by-step board placement and conflict visualization.', difficulty: 'Intermediate', time: '8 min', tags: ['backtracking', 'constraint', 'N×N board'], color: '#ec4899', icon: '♛', features: ['Custom N (4-12)', 'Step-by-step', 'Conflict highlight', 'Solution count'] },
  { id: 'tower-of-hanoi', name: 'Tower of Hanoi', category: 'algorithms', categoryLabel: 'Algorithms', description: 'Move disks between pegs following the classic rules. Auto-solve with animated recursive solution.', difficulty: 'Beginner', time: '3 min', tags: ['recursion', 'puzzle', '2^n - 1 moves'], color: '#6366f1', icon: '⊿', features: ['Custom disk count', 'Manual mode', 'Auto-solve', 'Move counter'] },
  { id: 'disk-scheduling', name: 'Disk Scheduling', category: 'operating-systems', categoryLabel: 'Operating Systems', description: 'Compare FCFS, SSTF, SCAN, C-SCAN disk arm scheduling with seek distance visualization.', difficulty: 'Intermediate', time: '8 min', tags: ['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'seek time'], color: '#f97316', icon: '⊚', features: ['4 algorithms', 'Custom request queue', 'Seek chart', 'Total head movement'] },
  { id: 'bankers', name: "Banker's Algorithm", category: 'operating-systems', categoryLabel: 'Operating Systems', description: 'Detect safe states and deadlocks with the Banker algorithm. Edit allocation and max matrices interactively.', difficulty: 'Advanced', time: '10 min', tags: ['deadlock', 'safe state', 'resource allocation'], color: '#ef4444', icon: '🏦', features: ['Custom processes', 'Allocation matrix', 'Need matrix', 'Safe sequence'] },
  { id: 'producer-consumer', name: 'Producer-Consumer', category: 'operating-systems', categoryLabel: 'Operating Systems', description: 'Visualize the classic synchronization problem with buffer, semaphores, and race conditions.', difficulty: 'Intermediate', time: '6 min', tags: ['semaphore', 'mutex', 'buffer', 'synchronization'], color: '#22c55e', icon: '⇆', features: ['Custom buffer size', 'Speed control', 'Race condition demo', 'Semaphore display'] },
  { id: 'dns-resolution', name: 'DNS Resolution', category: 'networking', categoryLabel: 'Networking', description: 'Trace DNS resolution from browser to root, TLD, and authoritative servers with packet animation.', difficulty: 'Beginner', time: '5 min', tags: ['DNS', 'root server', 'TLD', 'query'], color: '#3b82f6', icon: '🌐', features: ['Full DNS chain', 'Cache hits', 'Custom domain', 'TTL display'] },
  { id: 'http-lifecycle', name: 'HTTP Request Lifecycle', category: 'networking', categoryLabel: 'Networking', description: 'Follow an HTTP request through DNS, TCP, TLS, request, response with timing waterfall.', difficulty: 'Intermediate', time: '8 min', tags: ['HTTP', 'HTTPS', 'request', 'response', 'headers'], color: '#6366f1', icon: '⇢', features: ['Full lifecycle', 'Headers display', 'Timing waterfall', 'Status codes'] },
  { id: 'osi-model', name: 'OSI Model', category: 'networking', categoryLabel: 'Networking', description: 'Watch data traverse all 7 OSI layers with encapsulation and de-encapsulation animation.', difficulty: 'Beginner', time: '5 min', tags: ['7 layers', 'encapsulation', 'PDU'], color: '#14b8a6', icon: '⊟', features: ['7 layers animated', 'Encapsulation', 'PDU names', 'Protocol examples'] },
  { id: 'linear-regression', name: 'Linear Regression', category: 'ai-ml', categoryLabel: 'AI / ML', description: 'Plot data points, fit a line with gradient descent, and watch the loss minimize in real time.', difficulty: 'Beginner', time: '5 min', tags: ['regression', 'least squares', 'loss', 'fit'], color: '#22c55e', icon: '📈', features: ['Click to add points', 'Best fit line', 'Loss chart', 'R² display'] },
  { id: 'decision-tree', name: 'Decision Tree', category: 'ai-ml', categoryLabel: 'AI / ML', description: 'Build and visualize a decision tree classifier with custom feature splits and information gain.', difficulty: 'Intermediate', time: '8 min', tags: ['entropy', 'information gain', 'Gini', 'classification'], color: '#f59e0b', icon: '🌳', features: ['Custom data', 'Split visualization', 'Entropy/Gini', 'Tree rendering'] },
  { id: 'perceptron', name: 'Perceptron', category: 'ai-ml', categoryLabel: 'AI / ML', description: 'Train a single-layer perceptron on 2D data. Watch the decision boundary shift as weights update.', difficulty: 'Beginner', time: '4 min', tags: ['perceptron', 'decision boundary', 'weights', 'bias'], color: '#ef4444', icon: '⊛', features: ['Place data points', 'Decision boundary', 'Weight animation', 'Epoch counter'] },
  { id: 'wave-interference', name: 'Wave Interference', category: 'physics', categoryLabel: 'Physics', description: 'Simulate constructive and destructive wave interference with adjustable frequency and amplitude.', difficulty: 'Intermediate', time: '6 min', tags: ['waves', 'frequency', 'amplitude', 'superposition'], color: '#3b82f6', icon: '〰', features: ['Dual wave sources', 'Frequency/Amplitude', 'Superposition', 'Interference pattern'] },
  { id: 'spring-mass', name: 'Spring-Mass System', category: 'physics', categoryLabel: 'Physics', description: 'Simulate a spring-mass-damper system with adjustable spring constant, mass, and damping ratio.', difficulty: 'Intermediate', time: '5 min', tags: ['SHM', 'spring constant', 'damping', 'resonance'], color: '#22c55e', icon: '⌇', features: ['Spring constant', 'Mass', 'Damping', 'Phase portrait'] },
  { id: 'electric-circuit', name: 'Electric Circuit', category: 'physics', categoryLabel: 'Physics', description: 'Build simple series and parallel circuits. Calculate voltage, current, and resistance with Ohm\'s law.', difficulty: 'Beginner', time: '5 min', tags: ['Ohm\'s law', 'series', 'parallel', 'V=IR'], color: '#f59e0b', icon: '⚡', features: ['Series & Parallel', 'Ohm\'s law', 'Current flow animation', 'Custom resistors'] },
  { id: 'db-normalization', name: 'Database Normalization', category: 'systems', categoryLabel: 'Systems', description: 'Step through 1NF, 2NF, 3NF, and BCNF normalization with custom table schemas and dependency diagrams.', difficulty: 'Advanced', time: '10 min', tags: ['1NF', '2NF', '3NF', 'BCNF', 'FD'], color: '#8b5cf6', icon: '⊞', features: ['Custom schema', 'FD diagram', 'Step-by-step normalization', 'Anomaly detection'] },
  { id: 'regex-engine', name: 'Regex Engine', category: 'systems', categoryLabel: 'Systems', description: 'Build and test regular expressions with NFA/DFA state machine visualization and match highlighting.', difficulty: 'Advanced', time: '8 min', tags: ['NFA', 'DFA', 'regex', 'state machine'], color: '#ec4899', icon: '.*', features: ['Custom regex', 'NFA graph', 'DFA conversion', 'Match highlighting'] },
  { id: 'cache-simulator', name: 'Cache Simulator', category: 'systems', categoryLabel: 'Systems', description: 'Simulate direct-mapped, set-associative, and fully-associative cache with hit/miss statistics.', difficulty: 'Advanced', time: '10 min', tags: ['cache', 'hit ratio', 'LRU', 'direct mapped'], color: '#f97316', icon: '⊡', features: ['3 mapping types', 'Custom addresses', 'Hit/miss counter', 'Cache state display'] },
];

const CATEGORIES = [
  { id: 'all', label: 'All Simulations', count: SIMULATIONS.length },
  { id: 'algorithms', label: 'Algorithms', count: SIMULATIONS.filter(s => s.category === 'algorithms').length },
  { id: 'data-structures', label: 'Data Structures', count: SIMULATIONS.filter(s => s.category === 'data-structures').length },
  { id: 'operating-systems', label: 'Operating Systems', count: SIMULATIONS.filter(s => s.category === 'operating-systems').length },
  { id: 'networking', label: 'Networking', count: SIMULATIONS.filter(s => s.category === 'networking').length },
  { id: 'ai-ml', label: 'AI / ML', count: SIMULATIONS.filter(s => s.category === 'ai-ml').length },
  { id: 'physics', label: 'Physics', count: SIMULATIONS.filter(s => s.category === 'physics').length },
  { id: 'systems', label: 'Systems', count: SIMULATIONS.filter(s => s.category === 'systems').length },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: '#22c55e',
  Intermediate: '#f59e0b',
  Advanced: '#ef4444',
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; }

  .sim-hub { min-height: 100vh; background: #0a0a0f; color: #e2e8f0; font-family: 'Inter', system-ui, sans-serif; display: flex; flex-direction: column; }

  .sim-topbar { height: 56px; background: #0f0f17; border-bottom: 1px solid #1e1e2e; display: flex; align-items: center; padding: 0 24px; gap: 20px; flex-shrink: 0; }
  .sim-topbar-brand { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 800; color: #e2e8f0; letter-spacing: -0.02em; }
  .sim-topbar-brand-dot { width: 8px; height: 8px; border-radius: 50%; background: #6366f1; }
  .sim-topbar-divider { width: 1px; height: 20px; background: #1e1e2e; }
  .sim-topbar-title { font-size: 13px; font-weight: 600; color: #94a3b8; }
  .sim-search-wrap { flex: 1; max-width: 380px; margin-left: auto; position: relative; }
  .sim-search { width: 100%; padding: 8px 12px 8px 36px; background: #111118; border: 1px solid #1e1e2e; border-radius: 8px; color: #e2e8f0; font-size: 13px; outline: none; transition: border-color 0.15s; }
  .sim-search:focus { border-color: rgba(99,102,241,0.5); }
  .sim-search::placeholder { color: #475569; }
  .sim-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #475569; }
  .sim-sort { padding: 7px 12px; background: #111118; border: 1px solid #1e1e2e; border-radius: 8px; color: #94a3b8; font-size: 12px; cursor: pointer; outline: none; }

  .sim-body { display: flex; flex: 1; overflow: hidden; }

  .sim-sidebar { width: 220px; flex-shrink: 0; background: #0d0d14; border-right: 1px solid #1e1e2e; padding: 20px 12px; overflow-y: auto; }
  .sim-sidebar-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #475569; padding: 0 8px; margin-bottom: 8px; }
  .sim-cat-btn { width: 100%; text-align: left; padding: 8px 12px; border-radius: 8px; border: 1px solid transparent; background: transparent; color: #94a3b8; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 8px; transition: all 0.15s; margin-bottom: 2px; }
  .sim-cat-btn:hover { background: rgba(99,102,241,0.06); color: #c7d2fe; }
  .sim-cat-btn.active { background: rgba(99,102,241,0.12); border-color: rgba(99,102,241,0.25); color: #a5b4fc; font-weight: 700; }
  .sim-cat-count { font-size: 10px; padding: 1px 7px; border-radius: 999px; background: #1e1e2e; color: #64748b; }
  .sim-cat-btn.active .sim-cat-count { background: rgba(99,102,241,0.2); color: #a5b4fc; }

  .sim-main { flex: 1; overflow-y: auto; padding: 24px; }
  .sim-stats-row { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
  .sim-stat { padding: 12px 18px; background: #111118; border: 1px solid #1e1e2e; border-radius: 10px; display: flex; flex-direction: column; gap: 2px; min-width: 120px; }
  .sim-stat-val { font-size: 22px; font-weight: 800; color: #e2e8f0; letter-spacing: -0.03em; }
  .sim-stat-lbl { font-size: 11px; color: #64748b; font-weight: 500; }

  .sim-section-title { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px; }
  .sim-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }

  .sim-card { background: #111118; border: 1px solid #1e1e2e; border-radius: 14px; overflow: hidden; cursor: pointer; transition: border-color 0.2s, transform 0.2s; display: flex; flex-direction: column; }
  .sim-card:hover { border-color: rgba(99,102,241,0.3); transform: translateY(-2px); }

  .sim-card-header { height: 6px; }
  .sim-card-body { padding: 18px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
  .sim-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
  .sim-card-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .sim-card-meta { display: flex; flex-direction: column; gap: 2px; flex: 1; }
  .sim-card-name { font-size: 15px; font-weight: 800; color: #e2e8f0; letter-spacing: -0.02em; line-height: 1.2; }
  .sim-card-cat { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
  .sim-card-desc { font-size: 12px; color: #64748b; line-height: 1.6; }
  .sim-card-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .sim-card-tag { font-size: 10px; padding: 2px 8px; border-radius: 5px; background: #1e1e2e; color: #94a3b8; }
  .sim-card-features { display: flex; flex-wrap: wrap; gap: 4px; }
  .sim-card-feature { font-size: 10px; padding: 2px 8px; border-radius: 5px; color: #94a3b8; border: 1px solid #1e1e2e; display: flex; align-items: center; gap: 4px; }
  .sim-card-feature::before { content: '✓'; font-size: 9px; }
  .sim-card-footer { padding: 12px 18px; border-top: 1px solid #1e1e2e; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .sim-card-diff { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; }
  .sim-card-time { font-size: 11px; color: #475569; display: flex; align-items: center; gap: 4px; }
  .sim-launch-btn { padding: 7px 16px; border-radius: 8px; border: none; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 5px; }
  .sim-launch-btn:hover { filter: brightness(1.15); }

  .sim-empty { text-align: center; padding: 60px 20px; color: #475569; }
  .sim-empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
  .sim-empty-text { font-size: 16px; font-weight: 700; color: #64748b; }
  .sim-empty-sub { font-size: 13px; margin-top: 6px; }
`;

export default function SimulationsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'name' | 'difficulty'>('name');

  const filtered = useMemo(() => {
    let list = SIMULATIONS.filter(s => {
      const matchCat = activeCategory === 'all' || s.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tags.some(t => t.includes(q));
      return matchCat && matchSearch;
    });
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'difficulty') {
      const ord = { Beginner: 0, Intermediate: 1, Advanced: 2 };
      list = [...list].sort((a, b) => ord[a.difficulty] - ord[b.difficulty]);
    }
    return list;
  }, [activeCategory, search, sort]);

  return (
    <>
      <style>{CSS}</style>
      <div className="sim-hub">
        {/* Top Bar */}
        <div className="sim-topbar">
          <div className="sim-topbar-brand">
            <div className="sim-topbar-brand-dot" />
            EduVision
          </div>
          <div className="sim-topbar-divider" />
          <div className="sim-topbar-title">Simulation Lab</div>
          <div className="sim-search-wrap">
            <svg className="sim-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input
              className="sim-search"
              placeholder="Search simulations…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="sim-sort" value={sort} onChange={e => setSort(e.target.value as 'name' | 'difficulty')}>
            <option value="name">Sort: A–Z</option>
            <option value="difficulty">Sort: Difficulty</option>
          </select>
          <button
            onClick={() => router.push('/simulations/create')}
            style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            + New Simulation
          </button>
        </div>

        <div className="sim-body">
          {/* Sidebar */}
          <div className="sim-sidebar">
            <div className="sim-sidebar-label">Category</div>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`sim-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.label}</span>
                <span className="sim-cat-count">{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Main */}
          <div className="sim-main">
            {/* Stats */}
            <div className="sim-stats-row">
              {[
                { val: SIMULATIONS.length, lbl: 'Total Simulations' },
                { val: CATEGORIES.length - 1, lbl: 'Categories' },
                { val: SIMULATIONS.filter(s => s.difficulty === 'Beginner').length, lbl: 'Beginner' },
                { val: SIMULATIONS.filter(s => s.difficulty === 'Intermediate').length, lbl: 'Intermediate' },
                { val: SIMULATIONS.filter(s => s.difficulty === 'Advanced').length, lbl: 'Advanced' },
              ].map(s => (
                <div key={s.lbl} className="sim-stat">
                  <div className="sim-stat-val">{s.val}</div>
                  <div className="sim-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>

            <div className="sim-section-title">
              {activeCategory === 'all' ? 'All Simulations' : CATEGORIES.find(c => c.id === activeCategory)?.label}
              {' '}— {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </div>

            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sim-empty">
                  <div className="sim-empty-icon">🔭</div>
                  <div className="sim-empty-text">No simulations found</div>
                  <div className="sim-empty-sub">Try a different search or category</div>
                </motion.div>
              ) : (
                <motion.div key="grid" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="sim-grid">
                  {filtered.map((sim, idx) => (
                    <motion.div
                      key={sim.id}
                      className="sim-card"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.03 }}
                      onClick={() => router.push(`/simulations/${sim.id}`)}
                    >
                      <div className="sim-card-header" style={{ background: sim.color }} />
                      <div className="sim-card-body">
                        <div className="sim-card-top">
                          <div className="sim-card-icon" style={{ background: `${sim.color}18`, color: sim.color }}>
                            {sim.icon}
                          </div>
                          <div className="sim-card-meta">
                            <div className="sim-card-name">{sim.name}</div>
                            <div className="sim-card-cat" style={{ color: sim.color }}>{sim.categoryLabel}</div>
                          </div>
                        </div>
                        <div className="sim-card-desc">{sim.description}</div>
                        <div className="sim-card-features">
                          {sim.features.slice(0, 3).map(f => (
                            <span key={f} className="sim-card-feature">{f}</span>
                          ))}
                        </div>
                        <div className="sim-card-tags">
                          {sim.tags.slice(0, 3).map(t => (
                            <span key={t} className="sim-card-tag">#{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="sim-card-footer">
                        <span
                          className="sim-card-diff"
                          style={{ color: DIFFICULTY_COLOR[sim.difficulty], background: `${DIFFICULTY_COLOR[sim.difficulty]}18` }}
                        >
                          {sim.difficulty}
                        </span>
                        <span className="sim-card-time">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                          {sim.time}
                        </span>
                        <button
                          className="sim-launch-btn"
                          style={{ background: `${sim.color}22`, color: sim.color, border: `1px solid ${sim.color}44` }}
                          onClick={e => { e.stopPropagation(); router.push(`/simulations/${sim.id}`); }}
                        >
                          Launch
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
