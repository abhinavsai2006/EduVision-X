'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { CPUSchedulingSim } from './components/CPUSchedulingSim';
import { DijkstraSim } from './components/DijkstraSim';
import { DecisionTreeSim } from './components/DecisionTreeSim';
import { DNSSim } from './components/DNSSim';
import { ElectricCircuitSim } from './components/ElectricCircuitSim';
import { CacheSim } from './components/CacheSim';
import { SortingSim } from './components/SortingSim';
import { BinarySearchSim } from './components/BinarySearchSim';
import { LinkedListSim } from './components/LinkedListSim';
import { ProjectileMotionSim } from './components/ProjectileMotionSim';
import { GraphTraversalSim } from './components/GraphTraversalSim';
import { KMeansSim } from './components/KMeansSim';
import { NeuralNetworkSim } from './components/NeuralNetworkSim';
import { PendulumSim } from './components/PendulumSim';
import { BSTSim } from './components/BSTSim';
import { PageReplacementSim } from './components/PageReplacementSim';
import { TCPHandshakeSim } from './components/TCPHandshakeSim';
import { GradientDescentSim } from './components/GradientDescentSim';
import { CompilerPipelineSim } from './components/CompilerPipelineSim';
import { HashTableSim } from './components/HashTableSim';
import { StackQueueSim } from './components/StackQueueSim';
import { HeapSim } from './components/HeapSim';
import { AStarSim } from './components/AStarSim';
import { ConvexHullSim } from './components/ConvexHullSim';
import { KMPSim } from './components/KMPSim';
import { MatrixMulSim } from './components/MatrixMulSim';
import { FibonacciDPSim } from './components/FibonacciDPSim';
import { NQueensSim } from './components/NQueensSim';
import { HanoiSim } from './components/HanoiSim';
import { DiskSchedulingSim } from './components/DiskSchedulingSim';
import { BankersSim } from './components/BankersSim';
import { ProducerConsumerSim } from './components/ProducerConsumerSim';
import { HTTPLifecycleSim } from './components/HTTPLifecycleSim';
import { OSISim } from './components/OSISim';
import { LinearRegressionSim } from './components/LinearRegressionSim';
import { NormalizationSim } from './components/NormalizationSim';
import { RegexSim } from './components/RegexSim';
import { PerceptronSim } from './components/PerceptronSim';
import { WaveInterferenceSim } from './components/WaveInterferenceSim';
import { SpringMassSim } from './components/SpringMassSim';
import { ComingSoon } from './components/ComingSoon';





/* ═══ Simulation Registry ═══ */
/* ═══ Simulation Registry ═══ */
const SIM_REGISTRY: Record<string, { name: string; component: React.FC<any> }> = {
  'sorting-visualizer': { name: 'Sorting Visualizer', component: SortingSim },
  'binary-search': { name: 'Binary Search', component: BinarySearchSim },
  'graph-traversal': { name: 'Graph Traversal', component: GraphTraversalSim },
  'dijkstra': { name: "Dijkstra's Shortest Path", component: DijkstraSim },
  'linked-list': { name: 'Linked List', component: LinkedListSim },
  'binary-tree': { name: 'Binary Search Tree', component: BSTSim },
  'cpu-scheduling': { name: 'CPU Scheduling', component: CPUSchedulingSim },
  'memory-management': { name: 'Page Replacement', component: PageReplacementSim },
  'tcp-handshake': { name: 'TCP/IP Networking', component: TCPHandshakeSim },
  'neural-network': { name: 'Neural Network', component: NeuralNetworkSim },
  'gradient-descent': { name: 'Gradient Descent', component: GradientDescentSim },
  'projectile-motion': { name: 'Projectile Motion', component: ProjectileMotionSim },
  'pendulum': { name: 'Double Pendulum', component: PendulumSim },
  'compiler-pipeline': { name: 'Compiler Pipeline', component: CompilerPipelineSim },
  'k-means': { name: 'K-Means Clustering', component: KMeansSim },
  'hash-table': { name: 'Hash Table', component: HashTableSim },
  'stack-queue': { name: 'Stack & Queue', component: StackQueueSim },
  'heap': { name: 'Heap / Priority Queue', component: HeapSim },
  'a-star': { name: 'A* Pathfinding', component: AStarSim },
  'convex-hull': { name: 'Convex Hull', component: ConvexHullSim },
  'kmp': { name: 'String Matching (KMP)', component: KMPSim },
  'matrix-multiply': { name: 'Matrix Multiplication', component: MatrixMulSim },
  'fibonacci-dp': { name: 'Fibonacci DP', component: FibonacciDPSim },
  'n-queens': { name: 'N-Queens', component: NQueensSim },
  'tower-of-hanoi': { name: 'Tower of Hanoi', component: HanoiSim },
  'disk-scheduling': { name: 'Disk Scheduling', component: DiskSchedulingSim },
  'bankers': { name: "Banker's Algorithm", component: BankersSim },
  'producer-consumer': { name: 'Producer-Consumer', component: ProducerConsumerSim },
  'dns-resolution': { name: 'DNS Resolution', component: DNSSim },
  'http-lifecycle': { name: 'HTTP Request Lifecycle', component: HTTPLifecycleSim },
  'osi-model': { name: 'OSI Model', component: OSISim },
  'linear-regression': { name: 'Linear Regression', component: LinearRegressionSim },
  'decision-tree': { name: 'Decision Tree', component: DecisionTreeSim },
  'perceptron': { name: 'Perceptron', component: PerceptronSim },
  'wave-interference': { name: 'Wave Interference', component: WaveInterferenceSim },
  'spring-mass': { name: 'Spring-Mass System', component: SpringMassSim },
  'electric-circuit': { name: 'Electric Circuit', component: ElectricCircuitSim },
  'db-normalization': { name: 'Database Normalization', component: NormalizationSim },
  'regex-engine': { name: 'Regex Engine', component: RegexSim },
  'cache-simulator': { name: 'Cache Simulator', component: CacheSim },
};

/* ═══ Theory Context Data ═══ */
const THEORY_DATA: Record<string, { title: string; description: string; timeComplexity?: string; spaceComplexity?: string; note?: string }> = {
  'sorting-visualizer': { title: 'Sorting Algorithms', description: 'Sorting algorithms arrange elements in a specific order (e.g., ascending). They are fundamental to computer science, each offering different trade-offs between time and space complexity based on the dataset characteristics.', timeComplexity: 'O(N^2) to O(N log N)', spaceComplexity: 'O(1) to O(N)' },
  'binary-search': { title: 'Binary Search', description: 'An efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you\'ve narrowed down the possible locations to just one.', timeComplexity: 'O(log N)', spaceComplexity: 'O(1)' },
  'graph-traversal': { title: 'Graph Traversal (BFS/DFS)', description: 'Methods for exploring nodes and edges of a graph. Breadth-First Search (BFS) explores neighbor nodes first, while Depth-First Search (DFS) explores as far as possible along each branch before backtracking.', timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)' },
  'dijkstra': { title: 'Dijkstra\'s Algorithm', description: 'An algorithm for finding the shortest paths between nodes in a graph. It maintains a set of unvisited nodes and calculates tentative distances, updating them as shorter paths are found.', timeComplexity: 'O((V + E) log V)', spaceComplexity: 'O(V)' },
  'linked-list': { title: 'Linked List', description: 'A linear data structure where elements are not stored in contiguous memory locations. Instead, each element (node) contains a data part and a reference (link) to the next node in the sequence.', timeComplexity: 'Search: O(N), Insert/Delete: O(1)', spaceComplexity: 'O(N)' },
  'binary-tree': { title: 'Binary Search Tree', description: 'A node-based binary tree data structure where the left subtree of a node contains only nodes with keys lesser than the node\'s key, and the right subtree contains only nodes with keys greater.', timeComplexity: 'Search: O(log N)', spaceComplexity: 'O(N)' },
  'a-star': { title: 'A* Pathfinding', description: 'A graph traversal and path search algorithm that uses heuristics to guide its search. It is highly performant and accurate, commonly used in games and mapping applications to find the shortest path.', timeComplexity: 'O(E)', spaceComplexity: 'O(V)' },
  'n-queens': { title: 'N-Queens Problem', description: 'The problem of placing N chess queens on an N×N chessboard so that no two queens threaten each other; thus, a solution requires that no two queens share the same row, column, or diagonal.', timeComplexity: 'O(N!)', spaceComplexity: 'O(N)' },
  'producer-consumer': { title: 'Producer-Consumer Problem', description: 'A classic synchronization problem describing two processes, the producer and the consumer, who share a common, fixed-size buffer used as a queue.', note: 'Requires proper mutex locks and semaphores.' },
  'linear-regression': { title: 'Linear Regression', description: 'A simple machine learning algorithm that models the relationship between a scalar response and one or more explanatory variables by fitting a linear equation to observed data.', timeComplexity: 'O(N)', note: 'Uses Gradient Descent to minimize Mean Squared Error (MSE).' },
  'db-normalization': { title: 'Database Normalization', description: 'The process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing a database into two or more tables and defining relationships between them.', note: 'Focuses on 1NF, 2NF, and 3NF.' },
  'regex-engine': { title: 'Regex Engine', description: 'A component that interprets and executes regular expressions, used for pattern matching and string manipulation.', note: 'Implements a non-deterministic finite automaton (NFA).' },
};

/* ═══ Drawing Overlay Component ═══ */
function DrawingOverlay({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution to match display size
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          canvas.width = rect.width;
          canvas.height = rect.height;
          ctx.putImageData(imgData, 0, 0);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#f59e0b'; // Amber color
        }
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [active]);

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!active || !canvasRef.current) return;
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      ctx.beginPath();
      ctx.moveTo(clientX - rect.left, clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !active || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      ctx.lineTo(clientX - rect.left, clientY - rect.top);
      ctx.stroke();
    }
  };

  const endDraw = () => setIsDrawing(false);

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100, pointerEvents: active ? 'auto' : 'none' }}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
        onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        style={{ width: '100%', height: '100%', cursor: active ? 'crosshair' : 'default', touchAction: active ? 'none' : 'auto' }}
      />
      {active && (
        <button onClick={clearCanvas} style={{ position: 'absolute', bottom: 20, right: 20, padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', pointerEvents: 'auto' }}>
          Clear Annotation
        </button>
      )}
    </div>
  );
}

/* ═══ Main Detail Page Shell ═══ */
export default function SimulationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const entry = SIM_REGISTRY[id];
  const [drawMode, setDrawMode] = useState(false);

  if (!entry) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#e2e8f0' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔭</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Simulation not found</div>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>"{id}" is not a valid simulation.</div>
        <button onClick={() => router.push('/simulations')} style={{ padding: '10px 20px', borderRadius: 8, background: '#6366f1', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>← Back to Catalog</button>
      </div>
    );
  }

  const SimComponent = entry.component;
  const theory = THEORY_DATA[id] || { title: entry.name, description: 'Theoretical background and runtime complexity details for this simulation context are being actively developed. Check back soon for comprehensive data structures and algorithmic analyses.' };

  return (
    <div
      suppressHydrationWarning
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0f', color: '#e2e8f0', fontFamily: "'Inter', system-ui, sans-serif", overflowY: 'auto' }}
    >
      {/* Top bar */}
      <div style={{ height: 48, background: '#0f0f17', borderBottom: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0, position: 'sticky', top: 0, zIndex: 200 }}>
        <button onClick={() => router.push('/simulations')} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #1e1e2e', background: 'transparent', color: '#94a3b8', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Catalog
        </button>
        <div style={{ width: 1, height: 18, background: '#1e1e2e' }} />
        <div style={{ fontSize: 14, fontWeight: 800, color: '#e2e8f0' }}>{entry.name}</div>

        <div style={{ flex: 1 }} />

        <button onClick={() => setDrawMode(!drawMode)} style={{ padding: '6px 14px', borderRadius: 6, border: drawMode ? '1px solid #f59e0b' : '1px solid #1e1e2e', background: drawMode ? '#f59e0b20' : '#111118', color: drawMode ? '#f59e0b' : '#94a3b8', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.58 7.58"></path><circle cx="11" cy="11" r="2"></circle></svg>
          {drawMode ? 'Drawing On' : 'Draw/Annotate'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Simulation content area (wrapped in a container for the relative positioning of DrawingOverlay) */}
        <div style={{ minHeight: 600, flexShrink: 0, borderBottom: '1px solid #1e1e2e', position: 'relative', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
          <SimComponent />
          <DrawingOverlay active={drawMode} />
        </div>

        {/* Theoretical Context Section */}
        <div style={{ padding: '60px 40px', background: '#0d0d14', borderTop: '1px solid #1e1e2e', flex: 1 }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Theoretical Context</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', margin: '0 0 24px 0' }}>{theory.title}</h2>

            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, marginBottom: 32 }}>
              {theory.description}
            </p>

            {(theory.timeComplexity || theory.spaceComplexity) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
                {theory.timeComplexity && (
                  <div style={{ padding: 24, background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Time Complexity</div>
                    <div style={{ fontSize: 20, color: '#fbbf24', fontFamily: 'monospace', fontWeight: 800 }}>{theory.timeComplexity}</div>
                  </div>
                )}
                {theory.spaceComplexity && (
                  <div style={{ padding: 24, background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Space Complexity</div>
                    <div style={{ fontSize: 20, color: '#34d399', fontFamily: 'monospace', fontWeight: 800 }}>{theory.spaceComplexity}</div>
                  </div>
                )}
              </div>
            )}

            {theory.note && (
              <div style={{ padding: '20px 24px', background: 'rgba(99, 102, 241, 0.1)', borderLeft: '4px solid #6366f1', borderRadius: '0 8px 8px 0', fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 }}>
                <strong style={{ color: '#fff', fontWeight: 800, marginRight: 8 }}>NOTE:</strong> {theory.note}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
