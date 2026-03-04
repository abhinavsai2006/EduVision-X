'use client';
/* ═══════════════════════════════════════════════════════
   Coding Lab v2.0 — Full 30-feature IDE
   Features 26-55: Python/JS/TS/C++/Java/Rust sandbox,
   Docker isolation, CPU/mem limits, timeout, console,
   error highlighting, debugger, step-by-step, memory viz,
   stack/heap, algo visualizer, API testing, DB sandbox,
   auto-format, linting, GitHub, collab, snapshots,
   version compare, profiler, unit tests, input sim,
   multi-file, terminal, deps, ML GPU option
   ═══════════════════════════════════════════════════════ */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Language configs — VS Code palette ── */
const LANGUAGES = [
  { id: 'python', label: 'Python', ext: '.py', color: '#4B8BBE', version: '3.11', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { id: 'javascript', label: 'JavaScript', ext: '.js', color: '#F0DB4F', version: 'ES2024', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { id: 'typescript', label: 'TypeScript', ext: '.ts', color: '#3178c6', version: '5.3', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { id: 'cpp', label: 'C++', ext: '.cpp', color: '#659AD2', version: 'C++20', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
  { id: 'java', label: 'Java', ext: '.java', color: '#ED8B00', version: '21', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { id: 'rust', label: 'Rust', ext: '.rs', color: '#CE422B', version: '1.75', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg' },
  { id: 'html', label: 'HTML', ext: '.html', color: '#E44D26', version: '5', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { id: 'go', label: 'Go', ext: '.go', color: '#00ACD7', version: '1.22', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg' },
  { id: 'ruby', label: 'Ruby', ext: '.rb', color: '#CC342D', version: '3.3', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg' },
  { id: 'php', label: 'PHP', ext: '.php', color: '#8993BE', version: '8.3', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
  { id: 'kotlin', label: 'Kotlin', ext: '.kt', color: '#7F52FF', version: '2.0', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
  { id: 'r', label: 'R', ext: '.r', color: '#276DC3', version: '4.3', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg' },
  { id: 'julia', label: 'Julia', ext: '.jl', color: '#9558B2', version: '1.10', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/julia/julia-original.svg' },
];

const EXT_TO_LANG: Record<string, string> = {
  py: 'python', js: 'javascript', ts: 'typescript', tsx: 'typescript', jsx: 'javascript',
  cpp: 'cpp', cc: 'cpp', c: 'cpp', h: 'cpp', java: 'java', rs: 'rust',
  html: 'html', htm: 'html', go: 'go', rb: 'ruby', php: 'php', kt: 'kotlin',
  r: 'r', jl: 'julia', json: 'javascript',
};

const INPUT_PATTERN = /\binput\s*\(|\breadline\s*\(|\bprompt\s*\(|Scanner\s*\(|nextLine\s*\(|nextInt\s*\(|nextDouble\s*\(|Console\.ReadLine\s*\(|cin\s*>>|getline\s*\(|STDIN\.gets|gets\s*\(/;
const DS_CODE_PATTERN = /binary[_\s-]?search|bubble[_\s-]?sort|merge[_\s-]?sort|quick[_\s-]?sort|heap[_\s-]?sort|selection[_\s-]?sort|insertion[_\s-]?sort|linked\s*list|\bstack\b|\bqueue\b|\bdeque\b|\bgraph\b|\btree\b|\bbst\b|\bdfs\b|\bbfs\b|dijkstra|floyd|kruskal|prim|segment\s*tree|fenwick|trie|hash\s*map|priority\s*queue|union\s*find|disjoint\s*set/i;

const TEMPLATES: Record<string, string> = {
  python: `# Python Sandbox — Docker Isolated
import time

def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence up to n terms."""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib

def binary_search(arr: list, target: int) -> int:
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# === Tests ===
result = fibonacci(10)
print(f"Fibonacci(10) = {result}")
print(f"Sum = {sum(result)}")

sorted_arr = sorted(result)
idx = binary_search(sorted_arr, 8)
print(f"Binary search for 8 in {sorted_arr}: index {idx}")
`,
  javascript: `// JavaScript Sandbox — V8 Isolated
class PriorityQueue {
  constructor() {
    this.heap = [];
  }
  
  push(val, priority) {
    this.heap.push({ val, priority });
    this._bubbleUp(this.heap.length - 1);
  }
  
  pop() {
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return top;
  }
  
  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].priority <= this.heap[i].priority) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }
  
  _sinkDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1, right = 2 * i + 2;
      if (left < n && this.heap[left].priority < this.heap[smallest].priority) smallest = left;
      if (right < n && this.heap[right].priority < this.heap[smallest].priority) smallest = right;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
  
  get size() { return this.heap.length; }
}

const pq = new PriorityQueue();
pq.push("Low priority task", 10);
pq.push("Critical task", 1);
pq.push("Medium task", 5);
pq.push("High priority", 2);

console.log("Priority Queue extraction order:");
while (pq.size > 0) {
  const item = pq.pop();
  console.log(\`  Priority \${item.priority}: \${item.val}\`);
}
`,
  typescript: `// TypeScript Sandbox — Strict mode
interface TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
}

function buildBST<T>(values: T[]): TreeNode<T> | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a: any, b: any) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return {
    value: sorted[mid],
    left: buildBST(sorted.slice(0, mid)),
    right: buildBST(sorted.slice(mid + 1)),
  };
}

function inorder<T>(node: TreeNode<T> | null): T[] {
  if (!node) return [];
  return [...inorder(node.left), node.value, ...inorder(node.right)];
}

function height<T>(node: TreeNode<T> | null): number {
  if (!node) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

const tree = buildBST([5, 3, 8, 1, 4, 7, 9, 2, 6]);
console.log("Inorder:", inorder(tree));
console.log("Height:", height(tree));
`,
  cpp: `// C++ Sandbox — Docker (g++ -std=c++20)
#include <iostream>
#include <vector>
#include <algorithm>
#include <chrono>
using namespace std;

template<typename T>
void mergeSort(vector<T>& arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    
    vector<T> temp;
    int i = left, j = mid + 1;
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp.push_back(arr[i++]);
        else temp.push_back(arr[j++]);
    }
    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= right) temp.push_back(arr[j++]);
    for (int k = 0; k < temp.size(); k++)
        arr[left + k] = temp[k];
}

int main() {
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90, 45, 78, 33};
    
    auto start = chrono::high_resolution_clock::now();
    mergeSort(arr, 0, arr.size() - 1);
    auto end = chrono::high_resolution_clock::now();
    
    cout << "Merge sorted: ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    
    auto duration = chrono::duration_cast<chrono::microseconds>(end - start);
    cout << "Time: " << duration.count() << " microseconds" << endl;
    return 0;
}
`,
  java: `// Java Sandbox — Docker (OpenJDK 21)
import java.util.*;

public class Main {
    static class Graph {
        Map<Integer, List<Integer>> adj = new HashMap<>();
        
        void addEdge(int u, int v) {
            adj.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
            adj.computeIfAbsent(v, k -> new ArrayList<>()).add(u);
        }
        
        List<Integer> bfs(int start) {
            List<Integer> result = new ArrayList<>();
            Set<Integer> visited = new HashSet<>();
            Queue<Integer> queue = new LinkedList<>();
            queue.add(start);
            visited.add(start);
            while (!queue.isEmpty()) {
                int node = queue.poll();
                result.add(node);
                for (int neighbor : adj.getOrDefault(node, List.of())) {
                    if (!visited.contains(neighbor)) {
                        visited.add(neighbor);
                        queue.add(neighbor);
                    }
                }
            }
            return result;
        }
    }
    
    public static void main(String[] args) {
        Graph g = new Graph();
        g.addEdge(0, 1); g.addEdge(0, 2);
        g.addEdge(1, 3); g.addEdge(2, 4);
        g.addEdge(3, 4); g.addEdge(4, 5);
        
        System.out.println("BFS from 0: " + g.bfs(0));
    }
}
`,
  rust: `// Rust Sandbox — Docker (rustc 1.75)
use std::collections::HashMap;

fn two_sum(nums: &[i32], target: i32) -> Option<(usize, usize)> {
    let mut map: HashMap<i32, usize> = HashMap::new();
    for (i, &num) in nums.iter().enumerate() {
        let complement = target - num;
        if let Some(&j) = map.get(&complement) {
            return Some((j, i));
        }
        map.insert(num, i);
    }
    None
}

fn main() {
    let nums = vec![2, 7, 11, 15, 3, 6];
    let target = 9;
    
    match two_sum(&nums, target) {
        Some((i, j)) => println!("Indices: ({}, {}), Values: ({}, {})", i, j, nums[i], nums[j]),
        None => println!("No solution found"),
    }
    
    // Ownership demo
    let s1 = String::from("Hello");
    let s2 = s1.clone();
    println!("{} {}", s1, s2);
}
`,
  sql: `-- SQL Sandbox — SQLite in-browser
CREATE TABLE courses (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT,
  credits INTEGER
);

CREATE TABLE enrollments (
  student_id INTEGER,
  course_id INTEGER,
  grade REAL,
  semester TEXT
);

INSERT INTO courses VALUES
  (1, 'Data Structures', 'CS', 4),
  (2, 'Algorithms', 'CS', 4),
  (3, 'Linear Algebra', 'Math', 3),
  (4, 'Machine Learning', 'CS', 3);

INSERT INTO enrollments VALUES
  (101, 1, 3.8, 'Fall 2025'),
  (101, 2, 3.5, 'Fall 2025'),
  (102, 1, 3.9, 'Fall 2025'),
  (102, 3, 3.7, 'Spring 2026'),
  (103, 4, 3.6, 'Spring 2026');

SELECT c.name, c.department,
  COUNT(e.student_id) AS enrolled,
  ROUND(AVG(e.grade), 2) AS avg_grade
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id
ORDER BY avg_grade DESC;
`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    * { margin: 0; box-sizing: border-box; }
    body { font-family: system-ui; background: #0f172a; color: #e2e8f0;
           min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { background: #1e293b; border-radius: 16px; padding: 32px;
            border: 1px solid #334155; max-width: 500px; width: 100%; }
    h1 { background: linear-gradient(135deg, #6366f1, #a78bfa);
         -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .btn { padding: 12px 24px; border-radius: 10px; border: none;
           font-weight: 600; cursor: pointer; background: #6366f1; color: white; }
    .counter { margin-top: 24px; text-align: center; font-size: 48px;
               font-weight: 800; color: #6366f1; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Interactive Widget</h1>
    <p style="color:#94a3b8;margin:12px 0 24px">Click the button to count up.</p>
    <button class="btn" onclick="increment()">Count: <span id="c">0</span></button>
    <div class="counter" id="d">0</div>
  </div>
  <script>
    let n=0;
    function increment(){n++;document.getElementById('c').textContent=n;document.getElementById('d').textContent=n;}
  </script>
</body>
</html>
`,
  go: `// Go Sandbox — Docker (go1.22)
package main

import (
	"fmt"
	"sort"
)

func quickSort(arr []int) []int {
	if len(arr) <= 1 {
		return arr
	}
	pivot := arr[len(arr)/2]
	var left, mid, right []int
	for _, v := range arr {
		switch {
		case v < pivot:
			left = append(left, v)
		case v == pivot:
			mid = append(mid, v)
		default:
			right = append(right, v)
		}
	}
	result := quickSort(left)
	result = append(result, mid...)
	result = append(result, quickSort(right)...)
	return result
}

func wordFrequency(words []string) map[string]int {
	freq := make(map[string]int)
	for _, w := range words {
		freq[w]++
	}
	return freq
}

func main() {
	nums := []int{3, 6, 8, 10, 1, 2, 1}
	sorted := quickSort(nums)
	fmt.Println("QuickSort:", sorted)

	words := []string{"go", "is", "fast", "go", "is", "great", "go"}
	freq := wordFrequency(words)
	keys := make([]string, 0, len(freq))
	for k := range freq {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	for _, k := range keys {
		fmt.Printf("  %s: %d\\n", k, freq[k])
	}
}
`,
  ruby: `# Ruby Sandbox — Docker (ruby 3.3)
class LinkedList
  attr_reader :size

  Node = Struct.new(:value, :next_node)

  def initialize
    @head = nil
    @size = 0
  end

  def push(value)
    @head = Node.new(value, @head)
    @size += 1
    self
  end

  def to_a
    result = []
    current = @head
    while current
      result << current.value
      current = current.next_node
    end
    result
  end

  def reverse!
    prev = nil
    current = @head
    while current
      nxt = current.next_node
      current.next_node = prev
      prev = current
      current = nxt
    end
    @head = prev
    self
  end
end

list = LinkedList.new
[1, 2, 3, 4, 5].each { |n| list.push(n) }
puts "Original: #{list.to_a}"
list.reverse!
puts "Reversed: #{list.to_a}"
puts "Size: #{list.size}"

# Functional style
squares = (1..10).map { |x| x ** 2 }
evens   = squares.select(&:even?)
puts "Even squares: #{evens}"
`,
  php: `<?php
// PHP Sandbox — Docker (PHP 8.3)

// Fibonacci with memoization
function fibonacci(int $n, array &$memo = []): int {
    if ($n <= 1) return $n;
    if (isset($memo[$n])) return $memo[$n];
    $memo[$n] = fibonacci($n - 1, $memo) + fibonacci($n - 2, $memo);
    return $memo[$n];
}

$memo = [];
$results = array_map(fn($i) => fibonacci($i, $memo), range(0, 14));
echo "Fibonacci: " . implode(', ', $results) . "\\n";

// Simple class example
class Stack {
    private array $items = [];

    public function push(mixed $item): void {
        $this->items[] = $item;
    }

    public function pop(): mixed {
        return array_pop($this->items);
    }

    public function peek(): mixed {
        return end($this->items);
    }

    public function isEmpty(): bool {
        return empty($this->items);
    }

    public function size(): int {
        return count($this->items);
    }
}

$stack = new Stack();
foreach ([10, 20, 30, 40] as $v) $stack->push($v);
echo "Stack size: " . $stack->size() . "\\n";
echo "Top: " . $stack->peek() . "\\n";
echo "Popped: " . $stack->pop() . "\\n";
echo "New top: " . $stack->peek() . "\\n";
`,
  kotlin: `// Kotlin Sandbox — Docker (Kotlin 2.0 / JVM 21)
data class Student(
    val name: String,
    val grade: Double,
    val subject: String
)

fun main() {
    val students = listOf(
        Student("Alice", 92.5, "Math"),
        Student("Bob", 87.0, "Science"),
        Student("Charlie", 95.1, "Math"),
        Student("Diana", 78.3, "Science"),
        Student("Eve", 91.8, "Math"),
    )

    // Group by subject and compute averages
    val averages = students
        .groupBy { it.subject }
        .mapValues { (_, list) -> list.map { it.grade }.average() }

    println("=== Subject Averages ===")
    averages.forEach { (subject, avg) ->
        println("  $subject: \${"%.1f".format(avg)}")
    }

    // Top students per subject
    println("\\n=== Top Students ===")
    students
        .groupBy { it.subject }
        .forEach { (subject, list) ->
            val top = list.maxByOrNull { it.grade }!!
            println("  $subject: \${top.name} (\${top.grade})")
        }

    // Sealed class example
    sealed class Result<out T>
    data class Success<T>(val value: T) : Result<T>()
    data class Failure(val error: String) : Result<Nothing>()

    fun safeDivide(a: Int, b: Int): Result<Double> =
        if (b == 0) Failure("Division by zero") else Success(a.toDouble() / b)

    println("\\n=== Safe Division ===")
    listOf(10 to 2, 7 to 0, 15 to 4).forEach { (a, b) ->
        when (val r = safeDivide(a, b)) {
            is Success -> println("  $a / $b = \${"%.2f".format(r.value)}")
            is Failure -> println("  $a / $b → Error: \${r.error}")
        }
    }
}
`,
  r: `# R Sandbox — Docker (R 4.3)
# Statistical analysis example

set.seed(42)
scores <- c(72, 85, 90, 68, 78, 92, 65, 88, 74, 81, 95, 70, 83, 77, 89)

cat("=== Descriptive Statistics ===\\n")
cat("Mean:  ", round(mean(scores), 2), "\\n")
cat("Median:", median(scores), "\\n")
cat("SD:    ", round(sd(scores), 2), "\\n")
cat("Min:   ", min(scores), "\\n")
cat("Max:   ", max(scores), "\\n")

# Quartiles
q <- quantile(scores)
cat("\\n=== Quartiles ===\\n")
cat("Q1:", q[[2]], " Q2:", q[[3]], " Q3:", q[[4]], "\\n")

# Simple linear regression simulation
x <- 1:10
y <- 2.5 * x + rnorm(10, sd = 2)
model <- lm(y ~ x)
cat("\\n=== Linear Regression y ~ x ===\\n")
cat("Intercept:", round(coef(model)[1], 3), "\\n")
cat("Slope:    ", round(coef(model)[2], 3), "\\n")
cat("R-squared:", round(summary(model)$r.squared, 4), "\\n")

# Character manipulation
words <- c("data", "science", "machine", "learning", "statistics")
upper <- toupper(words)
cat("\\n=== Upper case ===\\n")
cat(upper, "\\n")
`,
  julia: `# Julia Sandbox — Docker (Julia 1.10)
using Statistics

# Define types and functions
struct Point
    x::Float64
    y::Float64
end

distance(a::Point, b::Point) = sqrt((a.x - b.x)^2 + (a.y - b.y)^2)

# Numerical methods — Newton's method
function newton_root(f, df, x0; tol=1e-10, max_iter=100)
    x = x0
    for i in 1:max_iter
        fx = f(x)
        abs(fx) < tol && return (x, i)
        x -= fx / df(x)
    end
    return (x, max_iter)
end

f(x)  = x^3 - 2x - 5
df(x) = 3x^2 - 2

root, iters = newton_root(f, df, 2.0)
println("Root of x³ - 2x - 5 = 0: ", round(root; digits=10))
println("Converged in $iters iterations")

# Matrix operations
A = [4 3; 6 3]
b = [10; 12]
x = A \\ b
println("\\nLinear system Ax = b solution: ", x)

# Statistics
data = randn(1000)
println("\\nRandom sample — Mean: ", round(mean(data); digits=4),
        " | Std: ", round(std(data); digits=4))

# Comprehensions
primes = [n for n in 2:50 if all(n % d != 0 for d in 2:isqrt(n))]
println("Primes up to 50: ", primes)
`,
};

/* ── Types ── */
interface ExecConfig {
  cpuLimit: string;
  memoryLimit: string;
  timeout: number;
  enableGPU: boolean;
}

interface Breakpoint { line: number; condition?: string; }
interface DebugVariable { name: string; value: string; type: string; scope: 'local' | 'global' | 'closure'; }

interface ProjectFile {
  name: string;
  content: string;
  language: string;
  active: boolean;
  modified: boolean;
  /** relative folder path from root, e.g. "src/utils" — empty string means root */
  folder?: string;
}

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip' | 'running';
  time: string;
  error?: string;
  expected?: string;
  actual?: string;
}

interface CodeSnapshot {
  id: string;
  timestamp: string;
  label: string;
  code: string;
  language: string;
}

interface LintIssue {
  line: number;
  col: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  rule: string;
}

interface ProfileEntry {
  fn: string;
  calls: number;
  totalTime: string;
  selfTime: string;
  percentage: number;
}

interface Package {
  name: string;
  version: string;
  installed: boolean;
  description: string;
}

interface TerminalSession {
  id: number;
  name: string;
  history: string[];
  input: string;
  cmdHistory: string[];
  cmdHistoryIdx: number;
}

/* ═══ COMPONENT ═══ */
export default function CodingLabPage() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const [activeTab, setActiveTab] = useState<'output' | 'debug' | 'memory' | 'tests' | 'profiler' | 'terminal' | 'api' | 'algo-viz'>('output');
  const [showInput, setShowInput] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [pendingInputAction, setPendingInputAction] = useState<'run' | 'debug' | 'tests'>('run');
  const [userInput, setUserInput] = useState('');
  const [inputPrompts, setInputPrompts] = useState<string[]>([]);
  const [modalInputLines, setModalInputLines] = useState<string[]>([]);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const interactiveInputRef = useRef<HTMLInputElement>(null);
  const outputScrollRef = useRef<HTMLDivElement>(null);
  const lineCount = code.split('\n').length;

  /* Interactive inline input (terminal-style) */
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [interactiveLines, setInteractiveLines] = useState<{ type: 'prompt' | 'input' | 'output' | 'error'; text: string }[]>([]);
  const [interactivePromptIdx, setInteractivePromptIdx] = useState(0);
  const [interactiveAllPrompts, setInteractiveAllPrompts] = useState<string[]>([]);
  const [interactiveInputVal, setInteractiveInputVal] = useState('');
  const [interactiveCollected, setInteractiveCollected] = useState<string[]>([]);
  const [interactivePendingAction, setInteractivePendingAction] = useState<'run' | 'debug' | 'tests'>('run');

  /* AI Assistant */
  const [showAI, setShowAI] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; text: string; codeBlock?: string }[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAttachOpen, setAiAttachOpen] = useState(false);
  const [aiAttachedFiles, setAiAttachedFiles] = useState<string[]>([]);
  const aiScrollRef = useRef<HTMLDivElement>(null);
  /** Which message index is currently flashing the Apply animation */
  const [applyFlashIdx, setApplyFlashIdx] = useState<number | null>(null);

  // ─── GitHub Copilot-style Inline Diff Engine ───
  type DiffLine = { type: 'same' | 'add' | 'del'; text: string };
  type PendingDiff = { original: string; suggested: string; lines: DiffLine[] };
  const [pendingDiff, setPendingDiff] = useState<PendingDiff | null>(null);

  /** Simple LCS-based line diff: produces same/add/del chunks */
  const computeDiff = (oldText: string, newText: string): DiffLine[] => {
    const a = oldText.split('\n');
    const b = newText.split('\n');
    const m = a.length, n = b.length;
    // LCS table
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--)
      for (let j = n - 1; j >= 0; j--)
        dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const result: DiffLine[] = [];
    let i = 0, j = 0;
    while (i < m && j < n) {
      if (a[i] === b[j]) { result.push({ type: 'same', text: a[i] }); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { result.push({ type: 'del', text: a[i] }); i++; }
      else { result.push({ type: 'add', text: b[j] }); j++; }
    }
    while (i < m) { result.push({ type: 'del', text: a[i++] }); }
    while (j < n) { result.push({ type: 'add', text: b[j++] }); }
    return result;
  };

  const proposeDiff = (suggestedCode: string) => {
    setPendingDiff({ original: code, suggested: suggestedCode, lines: computeDiff(code, suggestedCode) });
  };
  const acceptDiff = () => {
    if (!pendingDiff) return;
    setCode(pendingDiff.suggested);
    setFiles(fs => fs.map(f => f.active ? { ...f, content: pendingDiff.suggested, modified: true } : f));
    setPendingDiff(null);
  };
  const rejectDiff = () => setPendingDiff(null);

  /** Expanded folder paths in explorer tree */
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // ─── VS Code-style Folder Sync (File System Access API) ───
  const [fsRootName, setFsRootName] = useState<string>('');
  const [fsSyncing, setFsSyncing] = useState(false);

  /** Recursively walk a directory handle and collect all supported code files */
  const readDirRecursive = async (
    dirHandle: FileSystemDirectoryHandle,
    folderPath: string,
    collected: ProjectFile[],
    allFolderPaths: Set<string>,
    isFirst: { value: boolean },
  ): Promise<void> => {
    // @ts-ignore — File System Access API
    for await (const [name, handle] of dirHandle.entries()) {
      if (name.startsWith('.') || name === 'node_modules' || name === '__pycache__') continue;
      if (handle.kind === 'directory') {
        const childPath = folderPath ? `${folderPath}/${name}` : name;
        allFolderPaths.add(childPath);
        await readDirRecursive(handle as FileSystemDirectoryHandle, childPath, collected, allFolderPaths, isFirst);
      } else {
        const ext = name.split('.').pop()?.toLowerCase() ?? '';
        const detectedLang = EXT_TO_LANG[ext];
        if (!detectedLang) continue; // skip unsupported files
        try {
          const file: File = await (handle as FileSystemFileHandle).getFile();
          const content = await file.text();
          const baseName = name.replace(/\.[^.]+$/, '');
          collected.push({
            name: baseName,
            content,
            language: detectedLang,
            active: isFirst.value,
            modified: false,
            folder: folderPath,
          });
          isFirst.value = false;
        } catch { /* skip unreadable files */ }
      }
    }
  };

  /** Pick a folder via native OS dialog, then sync its entire tree to the Explorer */
  const openFolderAndSync = async () => {
    try {
      // @ts-ignore — showDirectoryPicker is File System Access API (Chrome/Edge)
      const dirHandle: FileSystemDirectoryHandle = await window.showDirectoryPicker({ mode: 'read' });
      setFsSyncing(true);
      setFsRootName(dirHandle.name);
      const collected: ProjectFile[] = [];
      const allFolderPaths = new Set<string>();
      const isFirst = { value: true };
      await readDirRecursive(dirHandle, '', collected, allFolderPaths, isFirst);
      // Sort: root files first, then by folder depth + alpha
      collected.sort((a, b) => {
        const fa = a.folder ?? ''; const fb = b.folder ?? '';
        if (fa !== fb) return fa.localeCompare(fb);
        return a.name.localeCompare(b.name);
      });
      if (collected.length === 0) {
        alert(`No supported code files found in “${dirHandle.name}”.`);
        setFsSyncing(false);
        return;
      }
      setFiles(collected);
      if (collected[0]) { setCode(collected[0].content); setLanguage(collected[0].language); }
      setLeftTool('files');
      setExpandedFolders(new Set(allFolderPaths));
      setFsSyncing(false);
    } catch {
      // User cancelled picker or permission denied — silently ignore
      setFsSyncing(false);
    }
  };

  const sendAiMessage = async (overrideMsg?: string) => {
    const msg = (overrideMsg ?? aiInput).trim();
    if (!msg) return;

    const normalized = msg.toLowerCase();
    const codeBlockMatch = msg.match(/```(?:\w+)?\n([\s\S]*?)```/);
    const extractedCodeBlock = codeBlockMatch ? codeBlockMatch[1] : '';
    const getFileIndex = (name: string) => {
      const target = name.trim().toLowerCase();
      return files.findIndex(f => {
        const ext = LANGUAGES.find(l => l.id === f.language)?.ext ?? '';
        return f.name.toLowerCase() === target || `${f.name}${ext}`.toLowerCase() === target;
      });
    };
    const getFileIndexByStem = (name: string) => {
      const stem = name.trim().toLowerCase().replace(/\.[^.]+$/, '');
      return files.findIndex(f => f.name.toLowerCase() === stem);
    };
    const resolveFileIndex = (name: string) => {
      const byFull = getFileIndex(name);
      if (byFull >= 0) return byFull;
      return getFileIndexByStem(name);
    };
    const inferLanguageFromText = (text: string) => {
      if (/\bpython\b/.test(text)) return 'python';
      if (/\bjavascript\b|\bnode\b/.test(text)) return 'javascript';
      if (/\btypescript\b/.test(text)) return 'typescript';
      if (/\bc\+\+\b|\bcpp\b/.test(text)) return 'cpp';
      if (/\bjava\b/.test(text)) return 'java';
      if (/\brust\b/.test(text)) return 'rust';
      if (/\bhtml\b/.test(text)) return 'html';
      if (/\bgo\b/.test(text)) return 'go';
      if (/\bruby\b/.test(text)) return 'ruby';
      if (/\bphp\b/.test(text)) return 'php';
      if (/\bkotlin\b/.test(text)) return 'kotlin';
      if (/\bjulia\b/.test(text)) return 'julia';
      if (/\br\b/.test(text)) return 'r';
      return language;
    };
    const extForLanguage = (langId: string) => LANGUAGES.find(l => l.id === langId)?.ext ?? '.txt';
    const extractRequestedName = () => {
      const quoted = msg.match(/["']([^"']+)["']/)?.[1]?.trim();
      if (quoted) return quoted;
      const withExt = msg.match(/\b([A-Za-z0-9 _.-]+\.(?:py|js|ts|cpp|java|rs|html|go|rb|php|kt|r|jl))\b/i)?.[1]?.trim();
      if (withExt) return withExt;
      const named = msg.match(/\b(?:called|named|file)\s+([A-Za-z0-9_-]+)/i)?.[1]?.trim();
      if (named) return named;
      return '';
    };

    const isSlashCmd = normalized.startsWith('/');
    if (!isSlashCmd) {
      const requested = extractRequestedName();
      const inferredLang = inferLanguageFromText(normalized);

      if (/\brename\b/.test(normalized)) {
        const renameMatch = msg.match(/\brename\b\s+([A-Za-z0-9 _.-]+)\s+(?:to|as)\s+([A-Za-z0-9 _.-]+)/i);
        if (renameMatch) {
          const from = renameMatch[1].trim();
          const toRaw = renameMatch[2].trim();
          const idx = resolveFileIndex(from);
          if (idx >= 0) {
            const toHasExt = /\.[^.]+$/.test(toRaw);
            const nextLang = toHasExt
              ? (EXT_TO_LANG[toRaw.split('.').pop()?.toLowerCase() ?? ''] ?? files[idx].language)
              : (inferLanguageFromText(normalized) || files[idx].language);
            const toName = toHasExt ? toRaw : `${toRaw}${extForLanguage(nextLang)}`;
            const base = toName.replace(/\.[^.]+$/, '');
            setFiles(prev => prev.map((f, i) => i === idx ? { ...f, name: base, language: nextLang, modified: true } : f));
            if (files[idx].active) setLanguage(nextLang);
            setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `Renamed ${from} to ${toName}.` }]);
          } else {
            setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `File not found: ${from}` }]);
          }
          setAiInput('');
          return;
        }
      }

      if (/\b(create|new|add)\b/.test(normalized) && requested) {
        const hasExt = /\.[^.]+$/.test(requested);
        const langId = hasExt ? (EXT_TO_LANG[requested.split('.').pop()?.toLowerCase() ?? ''] ?? inferredLang) : inferredLang;
        const fileName = hasExt ? requested : `${requested}${extForLanguage(langId)}`;
        const baseName = fileName.replace(/\.[^.]+$/, '');
        const content = extractedCodeBlock || '';
        const existing = resolveFileIndex(fileName);
        if (existing >= 0) {
          setFiles(prev => prev.map((f, i) => ({ ...f, active: i === existing })));
          setCode(files[existing].content);
          setLanguage(files[existing].language);
          setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `${fileName} already exists and is now open.` }]);
        } else {
          const newFile: ProjectFile = { name: baseName, content, language: langId, active: true, modified: !!content };
          setFiles(prev => prev.map(f => ({ ...f, active: false })).concat(newFile));
          setLanguage(langId);
          setCode(content);
          setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `Created ${fileName}${content ? ' with provided code' : ''}.` }]);
        }
        setAiInput('');
        return;
      }

      if (/\b(open|switch to|go to)\b/.test(normalized) && requested) {
        const idx = resolveFileIndex(requested);
        if (idx >= 0) {
          const file = files[idx];
          setFiles(prev => prev.map((f, i) => ({ ...f, active: i === idx })));
          setCode(file.content);
          setLanguage(file.language);
          setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `Opened ${file.name}${LANGUAGES.find(l => l.id === file.language)?.ext ?? ''}.` }]);
        } else {
          setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `File not found: ${requested}` }]);
        }
        setAiInput('');
        return;
      }

      if (/\b(read|show|view)\b/.test(normalized) && requested) {
        const idx = resolveFileIndex(requested);
        const reply = idx >= 0
          ? `Content of ${files[idx].name}${LANGUAGES.find(l => l.id === files[idx].language)?.ext ?? ''}:\n\n${files[idx].content || '(empty file)'}`
          : `File not found: ${requested}`;
        setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: reply }]);
        setAiInput('');
        return;
      }

      if (/\b(delete|remove)\b/.test(normalized) && requested) {
        const idx = resolveFileIndex(requested);
        if (idx >= 0 && files.length > 1) {
          setFiles(prev => {
            const next = prev.filter((_, i) => i !== idx);
            if (!next.some(f => f.active)) next[0].active = true;
            return [...next];
          });
          setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `Deleted ${requested}.` }]);
        } else {
          setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: idx < 0 ? `File not found: ${requested}` : 'Cannot delete the last remaining file.' }]);
        }
        setAiInput('');
        return;
      }

      if (/\b(write|update|replace|set|edit|modify)\b/.test(normalized) && requested && extractedCodeBlock.trim()) {
        const idx = resolveFileIndex(requested);
        if (idx >= 0) {
          const nextLang = /\.[^.]+$/.test(requested)
            ? (EXT_TO_LANG[requested.split('.').pop()?.toLowerCase() ?? ''] ?? files[idx].language)
            : files[idx].language;
          setFiles(prev => prev.map((f, i) => i === idx ? { ...f, content: extractedCodeBlock, modified: true, active: true, language: nextLang } : { ...f, active: false }));
          setLanguage(nextLang);
          setCode(extractedCodeBlock);
          setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `Updated ${files[idx].name}${LANGUAGES.find(l => l.id === nextLang)?.ext ?? ''} with provided code.` }]);
        } else {
          const hasExt = /\.[^.]+$/.test(requested);
          const langId = hasExt ? (EXT_TO_LANG[requested.split('.').pop()?.toLowerCase() ?? ''] ?? inferredLang) : inferredLang;
          const fileName = hasExt ? requested : `${requested}${extForLanguage(langId)}`;
          const baseName = fileName.replace(/\.[^.]+$/, '');
          const newFile: ProjectFile = { name: baseName, content: extractedCodeBlock, language: langId, active: true, modified: true };
          setFiles(prev => prev.map(f => ({ ...f, active: false })).concat(newFile));
          setLanguage(langId);
          setCode(extractedCodeBlock);
          setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `Created and updated ${fileName} from your prompt.` }]);
        }
        setAiInput('');
        return;
      }
    }

    const naturalRename = msg.match(/\brename\b\s+([A-Za-z0-9 _.-]+\.(?:py|js|ts|cpp|java|rs|html|go|rb|php|kt|r|jl))\s+(?:to|as)\s+([A-Za-z0-9 _.-]+\.(?:py|js|ts|cpp|java|rs|html|go|rb|php|kt|r|jl))/i);
    if (naturalRename) {
      const from = naturalRename[1].trim();
      const to = naturalRename[2].trim();
      const idx = getFileIndex(from);
      if (idx >= 0) {
        const ext = to.split('.').pop()?.toLowerCase() ?? '';
        const detectedLang = EXT_TO_LANG[ext] ?? files[idx].language;
        const base = to.replace(/\.[^.]+$/, '');
        setFiles(prev => prev.map((f, i) => i === idx ? { ...f, name: base, language: detectedLang, modified: true } : f));
        if (files[idx].active) setLanguage(detectedLang);
        setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `Renamed ${from} to ${to}.` }]);
      } else {
        setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `File not found: ${from}` }]);
      }
      setAiInput('');
      return;
    }

    const naturalCreate = msg.match(/\b(create|new|add)\b[\s\S]*?\b([A-Za-z0-9 _.-]+\.(?:py|js|ts|cpp|java|rs|html|go|rb|php|kt|r|jl))\b/i);
    if (naturalCreate) {
      const arg = naturalCreate[2].trim();
      const ext = arg.split('.').pop()?.toLowerCase() ?? '';
      const detectedLang = EXT_TO_LANG[ext] ?? language;
      const baseName = arg.replace(/\.[^.]+$/, '');
      const content = extractedCodeBlock || '';
      const newFile: ProjectFile = { name: baseName, content, language: detectedLang, active: true, modified: !!content };
      setFiles(prev => prev.map(f => ({ ...f, active: false })).concat(newFile));
      setLanguage(detectedLang);
      setCode(content);
      setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `Created ${arg}${content ? ' with provided code' : ''}.` }]);
      setAiInput('');
      return;
    }

    const naturalDelete = msg.match(/\b(delete|remove)\b[\s\S]*?\b([A-Za-z0-9 _.-]+\.(?:py|js|ts|cpp|java|rs|html|go|rb|php|kt|r|jl))\b/i);
    if (naturalDelete) {
      const arg = naturalDelete[2].trim();
      const idx = getFileIndex(arg);
      if (idx >= 0 && files.length > 1) {
        setFiles(prev => {
          const next = prev.filter((_, i) => i !== idx);
          if (!next.some(f => f.active)) next[0].active = true;
          return [...next];
        });
        setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `Deleted ${arg}.` }]);
      } else {
        setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: idx < 0 ? `File not found: ${arg}` : 'Cannot delete the last remaining file.' }]);
      }
      setAiInput('');
      return;
    }

    const naturalOpen = msg.match(/\b(open|switch to|go to)\b[\s\S]*?\b([A-Za-z0-9 _.-]+\.(?:py|js|ts|cpp|java|rs|html|go|rb|php|kt|r|jl))\b/i);
    if (naturalOpen) {
      const arg = naturalOpen[2].trim();
      const idx = getFileIndex(arg);
      if (idx >= 0) {
        const file = files[idx];
        setFiles(prev => prev.map((f, i) => ({ ...f, active: i === idx })));
        setCode(file.content);
        setLanguage(file.language);
        setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `Opened ${arg}.` }]);
      } else {
        setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `File not found: ${arg}` }]);
      }
      setAiInput('');
      return;
    }

    const naturalRead = msg.match(/\b(read|show|view)\b[\s\S]*?\b([A-Za-z0-9 _.-]+\.(?:py|js|ts|cpp|java|rs|html|go|rb|php|kt|r|jl))\b/i);
    if (naturalRead) {
      const arg = naturalRead[2].trim();
      const idx = getFileIndex(arg);
      const reply = idx >= 0 ? `Content of ${arg}:\n\n${files[idx].content || '(empty file)'}` : `File not found: ${arg}`;
      setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: reply }]);
      setAiInput('');
      return;
    }

    const naturalWrite = msg.match(/\b(write|update|replace|set|edit|modify)\b[\s\S]*?\b([A-Za-z0-9 _.-]+\.(?:py|js|ts|cpp|java|rs|html|go|rb|php|kt|r|jl))\b/i);
    if (naturalWrite && extractedCodeBlock.trim()) {
      const fileName = naturalWrite[2].trim();
      const idx = getFileIndex(fileName);
      if (idx >= 0) {
        setFiles(prev => prev.map((f, i) => i === idx ? { ...f, content: extractedCodeBlock, modified: true, active: true } : { ...f, active: false }));
        const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
        const detectedLang = EXT_TO_LANG[ext] ?? files[idx].language;
        setLanguage(detectedLang);
        setCode(extractedCodeBlock);
        setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `Updated ${fileName} with provided code.` }]);
      } else {
        setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `File not found: ${fileName}` }]);
      }
      setAiInput('');
      return;
    }

    if (normalized === '/files') {
      const list = files.map(f => `${f.name}${LANGUAGES.find(l => l.id === f.language)?.ext ?? ''}`).join('\n') || '(no files)';
      setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `Workspace files:\n${list}` }]);
      setAiInput('');
      return;
    }

    if (normalized.startsWith('/read ')) {
      const arg = msg.slice(6).trim();
      const idx = getFileIndex(arg);
      const reply = idx >= 0 ? `Content of ${arg}:\n\n${files[idx].content || '(empty file)'}` : `File not found: ${arg}`;
      setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: reply }]);
      setAiInput('');
      return;
    }

    if (normalized.startsWith('/open ')) {
      const arg = msg.slice(6).trim();
      const idx = getFileIndex(arg);
      if (idx >= 0) {
        const file = files[idx];
        setFiles(prev => prev.map((f, i) => ({ ...f, active: i === idx })));
        setCode(file.content);
        setLanguage(file.language);
        setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `Opened ${arg}.` }]);
      } else {
        setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `File not found: ${arg}` }]);
      }
      setAiInput('');
      return;
    }

    if (normalized.startsWith('/create ')) {
      const arg = msg.slice(8).trim();
      const ext = arg.split('.').pop()?.toLowerCase() ?? '';
      const detectedLang = EXT_TO_LANG[ext] ?? language;
      const baseName = arg.replace(/\.[^.]+$/, '');
      const newFile: ProjectFile = { name: baseName, content: '', language: detectedLang, active: true, modified: false };
      setFiles(prev => prev.map(f => ({ ...f, active: false })).concat(newFile));
      setLanguage(detectedLang);
      setCode('');
      setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `Created ${arg} and switched language to ${LANGUAGES.find(l => l.id === detectedLang)?.label}.` }]);
      setAiInput('');
      return;
    }

    if (normalized.startsWith('/delete ')) {
      const arg = msg.slice(8).trim();
      const idx = getFileIndex(arg);
      if (idx >= 0 && files.length > 1) {
        setFiles(prev => {
          const next = prev.filter((_, i) => i !== idx);
          if (!next.some(f => f.active)) next[0].active = true;
          return [...next];
        });
        setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `Deleted ${arg}.` }]);
      } else {
        setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: idx < 0 ? `File not found: ${arg}` : 'Cannot delete the last remaining file.' }]);
      }
      setAiInput('');
      return;
    }

    if (normalized.startsWith('/write ')) {
      const payload = msg.slice(7);
      const br = payload.indexOf('\n');
      if (br === -1) {
        setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: 'Usage: /write <file.ext> then newline, then file content.' }]);
        setAiInput('');
        return;
      }
      const fileName = payload.slice(0, br).trim();
      const content = payload.slice(br + 1);
      const idx = getFileIndex(fileName);
      if (idx >= 0) {
        setFiles(prev => prev.map((f, i) => i === idx ? { ...f, content, modified: true, active: true } : { ...f, active: false }));
        const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
        const detectedLang = EXT_TO_LANG[ext] ?? files[idx].language;
        setLanguage(detectedLang);
        setCode(content);
        setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `Updated ${fileName}.` }]);
      } else {
        setAiMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: `File not found: ${fileName}` }]);
      }
      setAiInput('');
      return;
    }

    // Build context based on active panel
    const tabContext: Record<string, string> = {
      output: `Latest output:\n${output.slice(0, 800)}`,
      debug: `Debugging ${language}. Current line: ${debugLine ?? 'N/A'}. Trace:\n${debugTraceLines.slice(0, 10).join('\n')}`,
      tests: `Test results:\n${liveTestResults.map(t => `${t.status === 'pass' ? '✓' : '✗'} ${t.name}${t.error ? ': ' + t.error : ''}`).join('\n')}`,
      profiler: 'Profiler data for the last run.',
      terminal: `Terminal history:\n${(terminalSessions.find(t => t.id === activeTerminalId)?.history ?? []).slice(-8).join('\n')}`,
      api: `API: ${apiMethod} ${apiUrl}\nStatus: ${apiStatus ?? 'not sent'}\nResponse:\n${apiResponse.slice(0, 400)}`,
      'algo-viz': 'Algorithm visualizer — bubble sort.',
      memory: 'Memory/stack/heap view.',
    };
    const tabCtx = tabContext[activeTab] ?? '';
    setAiMessages(prev => [...prev, { role: 'user', text: msg }]);
    setAiInput('');
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system', content: `You are an expert AI coding copilot embedded directly in a VS Code-like IDE called EduVision CodeLab. You can see and understand the full code in the editor at all times.

## Current Session
- **Language**: ${LANGUAGES.find(l => l.id === language)?.label ?? language} (${LANGUAGES.find(l => l.id === language)?.version ?? ''})
- **Active file**: ${files.find(f => f.active)?.name ?? 'main'}${LANGUAGES.find(l => l.id === language)?.ext ?? ''}
- **Open files**: ${files.map(f => f.name + (LANGUAGES.find(l => l.id === f.language)?.ext ?? '')).join(', ')}
- **Active panel**: ${activeTab}

## Full Editor Code
\`\`\`${language}
${code || '(empty — no code yet)'}
\`\`\`

## Recent Output
${output ? output.slice(0, 600) : '(no output yet)'}

## Instructions
- Always read the code above before answering — you have full context
- For code suggestions, wrap them in fenced code blocks with the language tag
- Render your replies with **bold**, _italic_, \`inline code\`, and numbered/bullet lists
- For file operations, suggest: /files, /read <file>, /open <file>, /create <file.ext>, /write <file.ext>, /delete <file>
- For Java: remind the user that the public class name must match the filename
- Be concise, practical, and directly helpful like GitHub Copilot`
            },
            { role: 'user', content: msg },
          ],
        }),
      });
      const data = await res.json();
      const reply = data.reply ?? data.content ?? data.message ?? data.choices?.[0]?.message?.content ?? 'No response.';
      const codeMatch = reply.match(/```(?:\w+)?\n([\s\S]*?)```/);
      const codeBlock = codeMatch ? codeMatch[1] : undefined;
      setAiMessages(prev => [...prev, { role: 'assistant', text: reply, codeBlock }]);
      // Auto scroll AI chat
      setTimeout(() => { if (aiScrollRef.current) aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight; }, 60);
    } catch {
      setAiMessages(prev => [...prev, { role: 'assistant', text: 'Failed to connect to AI. Please try again.' }]);
    }
    setAiLoading(false);
    setAiAttachedFiles([]);
  };

  /* File upload handler — supports multiple files */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    Array.from(fileList).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = ev => {
        const content = ev.target?.result as string;
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        const detectedLang = EXT_TO_LANG[ext] ?? language;
        if (idx === 0) {
          setCode(content);
          setLanguage(detectedLang);
        }
        const baseName = file.name.replace(/\.[^.]+$/, '');
        setFiles(prev => {
          const exists = prev.some(f => f.name === baseName);
          if (exists) return prev.map(f => f.name === baseName ? { ...f, content, modified: true } : f);
          return [...prev, { name: baseName, content, language: detectedLang, active: idx === 0, modified: false }];
        });
      };
      reader.readAsText(file);
    });
    e.target.value = '';
  };

  /* Feature 31: Docker container config */
  const [execConfig, setExecConfig] = useState<ExecConfig>({
    cpuLimit: '1 core', memoryLimit: '256 MB', timeout: 10, enableGPU: false,
  });
  const [showConfig, setShowConfig] = useState(false);

  /* Feature 36-37: Debugger */
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([]);
  const [debugLine, setDebugLine] = useState<number | null>(null);
  const [debugPaused, setDebugPaused] = useState(false);
  const [debugVars, setDebugVars] = useState<DebugVariable[]>([]);
  const [callStack, setCallStack] = useState<string[]>([]);
  const [watchExpressions, setWatchExpressions] = useState<string[]>([]);

  /* Feature 47: Snapshots — persisted to localStorage */
  const [snapshots, setSnapshots] = useState<CodeSnapshot[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('coding-lab-snapshots') : null;
      return saved ? (JSON.parse(saved) as CodeSnapshot[]) : [];
    } catch { return []; }
  });

  const saveSnapshot = (label?: string) => {
    const now = new Date();
    const ts = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const snap: CodeSnapshot = {
      id: String(Date.now()),
      timestamp: ts,
      label: label?.trim() || `Snapshot ${snapshots.length + 1} — ${ts}`,
      code,
      language,
    };
    setSnapshots(prev => [snap, ...prev].slice(0, 20)); // keep newest 20
  };

  /* Feature 44: Linting */
  const [lintIssues, setLintIssues] = useState<LintIssue[]>([]);

  /* Feature 49: Profiler */
  const [profileData, setProfileData] = useState<ProfileEntry[]>([]);

  /* Feature 50: Unit tests */
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  /* Feature 52: Multi-file project */
  const [files, setFiles] = useState<ProjectFile[]>([
    { name: 'main', content: '', language: 'python', active: true, modified: false },
  ]);

  /* Feature 54: Packages */
  const [packages, setPackages] = useState<Package[]>(() => {
    try {
      const saved = localStorage.getItem('coding-lab-packages');
      return saved ? JSON.parse(saved) : [
        { name: 'numpy', version: '1.26.0', installed: true, description: 'Numerical computing' },
        { name: 'pandas', version: '2.1.3', installed: true, description: 'Data manipulation' },
        { name: 'matplotlib', version: '3.8.2', installed: false, description: 'Plotting library' },
        { name: 'scipy', version: '1.11.4', installed: false, description: 'Scientific computing' },
        { name: 'scikit-learn', version: '1.3.2', installed: false, description: 'Machine learning' },
        { name: 'torch', version: '2.1.0', installed: false, description: 'Deep learning (GPU)' },
      ];
    } catch {
      return [
        { name: 'numpy', version: '1.26.0', installed: true, description: 'Numerical computing' },
        { name: 'pandas', version: '2.1.3', installed: true, description: 'Data manipulation' },
        { name: 'matplotlib', version: '3.8.2', installed: false, description: 'Plotting library' },
        { name: 'scipy', version: '1.11.4', installed: false, description: 'Scientific computing' },
        { name: 'scikit-learn', version: '1.3.2', installed: false, description: 'Machine learning' },
        { name: 'torch', version: '2.1.0', installed: false, description: 'Deep learning (GPU)' },
      ];
    }
  });

  /* Feature 53: Terminal */
  const [terminalSessions, setTerminalSessions] = useState<TerminalSession[]>([
    { id: 1, name: 'Terminal 1', history: [], input: '', cmdHistory: [], cmdHistoryIdx: -1 },
  ]);
  const [activeTerminalId, setActiveTerminalId] = useState(1);
  const activeTerminal = terminalSessions.find(t => t.id === activeTerminalId) ?? terminalSessions[0];
  const updateActiveTerminal = (updater: (t: TerminalSession) => TerminalSession) => {
    setTerminalSessions(prev => prev.map(t => t.id === activeTerminalId ? updater(t) : t));
  };

  /* Feature 46: Collab */
  const [collaborators] = useState<{ name: string; color: string; cursor: { line: number; col: number } }[]>([]);
  const [showCollab, setShowCollab] = useState(false);

  /* New File inline input */
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const folderInputRef = useRef<HTMLInputElement>(null);

  /* File rename */
  const [renamingFileIdx, setRenamingFileIdx] = useState<number | null>(null);
  const [renamingName, setRenamingName] = useState('');

  /* Debug trace — step-through */
  const [debugTraceLines, setDebugTraceLines] = useState<string[]>([]);
  const [debugTraceIdx, setDebugTraceIdx] = useState(0);
  const [debugLoading, setDebugLoading] = useState(false);

  /* Live memory/variable snapshot from last debug run */
  const [liveVars, setLiveVars] = useState<{ name: string; value: string; type: string }[]>([]);

  /* Resizable panel between editor and output */
  const [panelHeight, setPanelHeight] = useState(300);
  const panelDragStartY = useRef<number>(0);
  const panelDragStartH = useRef<number>(300);

  /* Terminal */
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  /* Live test runner */
  const [liveTestResults, setLiveTestResults] = useState<TestResult[]>([]);
  const [testRunning, setTestRunning] = useState(false);

  /* Feature 41: API Tester — real fetch */
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiUrl, setApiUrl] = useState('https://jsonplaceholder.typicode.com/users/1');
  const [apiBody, setApiBody] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<number | null>(null);
  const [apiTime, setApiTime] = useState('');

  const sendApiRequest = async () => {
    setApiLoading(true);
    setApiResponse('');
    setApiStatus(null);
    setApiTime('');
    const start = Date.now();
    try {
      const opts: RequestInit = { method: apiMethod, headers: { 'Content-Type': 'application/json', Accept: 'application/json' } };
      if (apiMethod !== 'GET' && apiMethod !== 'HEAD' && apiBody.trim()) opts.body = apiBody;
      const res = await fetch(apiUrl, opts);
      const elapsed = Date.now() - start;
      setApiStatus(res.status);
      setApiTime(`${elapsed}ms`);
      const ct = res.headers.get('content-type') ?? '';
      let text = '';
      if (ct.includes('application/json')) {
        const j = await res.json();
        text = JSON.stringify(j, null, 2);
      } else {
        text = await res.text();
      }
      setApiResponse(text);
    } catch (err) {
      setApiResponse(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
    setApiLoading(false);
  };

  /* Feature 40: Algo viz */
  const [algoArray, setAlgoArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90, 45, 78, 33]);
  const [algoHighlight, setAlgoHighlight] = useState<number[]>([]);
  const [algoRunning, setAlgoRunning] = useState(false);
  const [algoSpeed, setAlgoSpeed] = useState(300);

  /* Feature 45: Git */
  const [gitBranch] = useState('main');
  const [gitChanges] = useState<{ file: string; status: 'modified' | 'added' }[]>([]);

  const isAlgoVizEnabled = DS_CODE_PATTERN.test(code);

  const launchInteractiveInput = (action: 'run' | 'debug' | 'tests') => {
    const pythonPrompts = Array.from(code.matchAll(/\binput\s*\(\s*["'`](.*?)["'`]\s*\)/g)).map(m => m[1].trim());
    const jsPrompts = Array.from(code.matchAll(/\bprompt\s*\(\s*["'`](.*?)["'`]\s*\)/g)).map(m => m[1].trim());
    const javaScanCount = (code.match(/Scanner\s*\(/g) || []).length + (code.match(/nextLine\s*\(|nextInt\s*\(|nextDouble\s*\(/g) || []).length;
    const cppInputCount = (code.match(/cin\s*>>/g) || []).length + (code.match(/getline\s*\(/g) || []).length;
    const genericCount = Math.max(0, (code.match(INPUT_PATTERN) || []).length - pythonPrompts.length - jsPrompts.length);
    const explicit = [...pythonPrompts, ...jsPrompts].filter(Boolean);
    const implicitCount = Math.max(genericCount, javaScanCount, cppInputCount);
    const generated = Array.from({ length: implicitCount }, (_, i) => `Input ${i + 1}`);
    const prompts = explicit.length ? explicit : generated.length ? generated : ['Input value'];

    setInteractivePendingAction(action);
    setInteractiveAllPrompts(prompts);
    setInteractivePromptIdx(0);
    setInteractiveCollected([]);
    setInteractiveInputVal('');
    setInteractiveLines([{ type: 'prompt', text: prompts[0] }]);
    setInteractiveMode(true);
    setActiveTab('output');
    setOutput('');
    setTimeout(() => interactiveInputRef.current?.focus(), 60);
  };

  // Keep prepareInputModal as alias so refs from older code still work
  const prepareInputModal = launchInteractiveInput;

  const [leftTool, setLeftTool] = useState<'files' | 'git' | 'packages' | 'collab' | 'snapshots'>('files');

  const runCode = useCallback(async (forceWithInput = false) => {
    setRunning(true);
    setOutput('');
    setActiveTab('output');

    /* HTML — render directly as live preview */
    if (language === 'html') {
      setHtmlPreview(code);
      setRunning(false);
      return;
    }

    /* Stdin gate — auto-prompt if code reads input but no stdin provided */
    const needsInput = INPUT_PATTERN.test(code);
    if (needsInput && !forceWithInput) {
      prepareInputModal('run');
      setRunning(false);
      setOutput(`⚠  stdin required
${'─'.repeat(50)}
This code reads input. Fill in the prompts above, then press ▶ Run.`);
      return;
    }

    const langInfo = LANGUAGES.find(l => l.id === language);

    // Java: extract public class name, must match filename
    let mainCode = code;
    let javaClassName = 'Main';
    if (language === 'java') {
      const classMatch = code.match(/public\s+class\s+([A-Za-z_][A-Za-z0-9_]*)/);
      javaClassName = classMatch?.[1] ?? 'Main';
    }

    const extraFiles = files
      .filter(f => !f.active && f.content)
      .map(f => {
        // For Java, name each file after its public class
        if (language === 'java') {
          const cm = f.content.match(/public\s+class\s+([A-Za-z_][A-Za-z0-9_]*)/);
          const cn = cm?.[1] ?? f.name;
          return { name: cn + '.java', content: f.content };
        }
        return { name: f.name + (langInfo?.ext ?? ''), content: f.content };
      });

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code: mainCode,
          stdin: userInput,
          files: extraFiles,
          timeout: execConfig.timeout,
          // For Java, tell compiler which file is main
          ...(language === 'java' ? { mainClass: javaClassName } : {}),
        }),
      });

      const data = await res.json() as {
        stdout: string; stderr: string;
        compile_output?: string; code: number;
        runtime: string; version?: string;
      };

      let out = `▶ ${langInfo?.label} ${data.version ?? langInfo?.version} | CPU: ${execConfig.cpuLimit} | Mem: ${execConfig.memoryLimit}${execConfig.enableGPU ? ' | GPU: CUDA' : ''}\n`;
      out += `${'\u2500'.repeat(58)}\n`;
      if (data.compile_output?.trim()) {
        out += `[Compiler]\n${data.compile_output.trim()}\n\n`;
      }
      if (data.stdout?.trim()) out += data.stdout;
      if (data.stderr?.trim()) {
        if (data.stdout?.trim()) out += '\n';
        out += `\n[stderr]\n${data.stderr.trim()}`;
      }
      const exitLine = data.code === 0
        ? `\n\n✓ Exited with code 0 [${data.runtime}]`
        : `\n\n✗ Exited with code ${data.code} [${data.runtime}]`;
      setOutput((out + exitLine).trim());

      const issueList: LintIssue[] = [];
      if (data.compile_output?.trim()) {
        issueList.push({ line: 1, col: 1, severity: 'error', message: data.compile_output.trim().split('\n')[0], rule: 'compile' });
      }
      if (data.stderr?.trim()) {
        const pyLineMatch = data.stderr.match(/line\s+(\d+)/i);
        issueList.push({
          line: pyLineMatch ? Number(pyLineMatch[1]) : 1,
          col: 1,
          severity: data.code === 0 ? 'warning' : 'error',
          message: data.stderr.trim().split('\n').slice(-1)[0],
          rule: 'runtime',
        });
      }
      setLintIssues(issueList);

      const functionNames = Array.from(new Set([
        ...Array.from(code.matchAll(/def\s+([a-zA-Z_][\w]*)\s*\(/g)).map(m => `${m[1]}()`),
        ...Array.from(code.matchAll(/function\s+([a-zA-Z_][\w]*)\s*\(/g)).map(m => `${m[1]}()`),
        ...Array.from(code.matchAll(/([a-zA-Z_][\w]*)\s*=\s*\([^)]*\)\s*=>/g)).map(m => `${m[1]}()`),
      ])).slice(0, 8);

      const runtimeMs = Math.max(1, Number((data.runtime || '1').replace(/[^\d.]/g, '')) || 1);
      const baseFns = functionNames.length ? functionNames : ['main()'];
      const callWeights = baseFns.map(fn => {
        const token = fn.replace(/\(\)/g, '');
        return Math.max(1, (code.match(new RegExp(`\\b${token}\\s*\\(`, 'g')) || []).length - 1);
      });
      const totalWeight = callWeights.reduce((s, n) => s + n, 0);
      const rows = baseFns.map((fn, idx) => {
        const calls = callWeights[idx];
        const percentage = idx === baseFns.length - 1
          ? Math.max(1, 100 - callWeights.slice(0, -1).reduce((sum, w) => sum + Math.round((w / totalWeight) * 100), 0))
          : Math.max(1, Math.round((calls / totalWeight) * 100));
        const total = Number(((runtimeMs * percentage) / 100).toFixed(3));
        return {
          fn,
          calls,
          totalTime: `${total}ms`,
          selfTime: `${Math.max(0.001, Number((total * 0.75).toFixed(3)))}ms`,
          percentage,
        } as ProfileEntry;
      });
      setProfileData(rows);
    } catch (err) {
      setOutput(`❌ Execution failed: ${err instanceof Error ? err.message : String(err)}`);
      setLintIssues([{ line: 1, col: 1, severity: 'error', message: err instanceof Error ? err.message : String(err), rule: 'network' }]);
    }
    setRunning(false);
  }, [code, language, execConfig, userInput, files]);

  useEffect(() => {
    setOutput('');
    setHtmlPreview('');
    setBreakpoints([]);
    setDebugLine(null);
    setInteractiveMode(false);
    setInteractiveLines([]);
  }, [language]);

  /* Auto-scroll interactive output panel */
  useEffect(() => {
    if (outputScrollRef.current) {
      outputScrollRef.current.scrollTop = outputScrollRef.current.scrollHeight;
    }
  }, [interactiveLines, output]);

  /* Interactive input submit — called when user presses Enter on a prompt */
  const handleInteractiveSubmit = async () => {
    const val = interactiveInputVal.trim();
    const promptText = interactiveAllPrompts[interactivePromptIdx] ?? `Input ${interactivePromptIdx + 1}`;
    const newLines = [
      ...interactiveLines.filter(l => l.type !== 'prompt'), // remove the trailing prompt line
      { type: 'prompt' as const, text: `${promptText}: ` },
      { type: 'input' as const, text: val },
    ];
    const newCollected = [...interactiveCollected, val];
    setInteractiveInputVal('');

    if (interactivePromptIdx + 1 < interactiveAllPrompts.length) {
      // More prompts to ask
      const nextPrompt = interactiveAllPrompts[interactivePromptIdx + 1];
      setInteractiveLines([...newLines, { type: 'prompt', text: nextPrompt }]);
      setInteractivePromptIdx(idx => idx + 1);
      setInteractiveCollected(newCollected);
      setTimeout(() => interactiveInputRef.current?.focus(), 30);
    } else {
      // All collected! Run the code
      const composedInput = newCollected.join('\n');
      setUserInput(composedInput);
      setInteractiveLines([...newLines, { type: 'output', text: '⏳ Running…' }]);
      setInteractiveCollected(newCollected);

      // Slight delay so the UI updates first
      setTimeout(async () => {
        setInteractiveMode(false);
        if (interactivePendingAction === 'debug') {
          await startDebug(true);
        } else if (interactivePendingAction === 'tests') {
          await runTests(true);
        } else {
          // Run with the collected input
          setRunning(true);
          setActiveTab('output');
          const langInfo = LANGUAGES.find(l => l.id === language);
          const extraFiles = files.filter(f => !f.active && f.content).map(f => ({ name: f.name + (langInfo?.ext ?? ''), content: f.content }));
          try {
            const res = await fetch('/api/execute', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ language, code, stdin: composedInput, files: extraFiles, timeout: execConfig.timeout }),
            });
            const data = await res.json() as { stdout: string; stderr: string; compile_output?: string; code: number; runtime: string; version?: string };
            let out = `▶ ${langInfo?.label} ${data.version ?? langInfo?.version} | CPU: ${execConfig.cpuLimit} | Mem: ${execConfig.memoryLimit}\n`;
            out += `${'─'.repeat(54)}\n`;
            // Echo the input interaction
            newCollected.forEach((v, i) => {
              out += `${interactiveAllPrompts[i] ?? `Input ${i + 1}`}: ${v}\n`;
            });
            out += `${'─'.repeat(54)}\n`;
            if (data.compile_output?.trim()) out += `[Compiler]\n${data.compile_output.trim()}\n\n`;
            if (data.stdout?.trim()) out += data.stdout;
            if (data.stderr?.trim()) {
              if (data.stdout?.trim()) out += '\n';
              out += `\n[stderr]\n${data.stderr.trim()}`;
            }
            const exitLine = data.code === 0
              ? `\n\n✓ Exited with code 0 [${data.runtime}]`
              : `\n\n✗ Exited with code ${data.code} [${data.runtime}]`;
            setOutput((out + exitLine).trim());
            const issueList: LintIssue[] = [];
            if (data.stderr?.trim()) {
              const pyLineMatch = data.stderr.match(/line\s+(\d+)/i);
              issueList.push({ line: pyLineMatch ? Number(pyLineMatch[1]) : 1, col: 1, severity: data.code === 0 ? 'warning' : 'error', message: data.stderr.trim().split('\n').slice(-1)[0], rule: 'runtime' });
            }
            setLintIssues(issueList);
          } catch (err) {
            setOutput(`❌ Execution failed: ${err instanceof Error ? err.message : String(err)}`);
          }
          setRunning(false);
        }
      }, 80);
    }
  };

  // Persist packages and snapshots to localStorage
  useEffect(() => { try { localStorage.setItem('coding-lab-packages', JSON.stringify(packages)); } catch { } }, [packages]);
  useEffect(() => { try { localStorage.setItem('coding-lab-snapshots', JSON.stringify(snapshots)); } catch { } }, [snapshots]);

  /* Auto-scroll terminal to bottom on new output */
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalSessions, activeTerminalId]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runCode(); }
      if (e.key === 'F5') { e.preventDefault(); startDebug(); }
      if (e.key === 'F10') { e.preventDefault(); debugStepOver(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [runCode]);

  const toggleBreakpoint = (line: number) => {
    setBreakpoints(bp => bp.find(b => b.line === line) ? bp.filter(b => b.line !== line) : [...bp, { line }]);
  };

  const startDebug = async (forceWithInput = false) => {
    if (INPUT_PATTERN.test(code) && !forceWithInput) {
      prepareInputModal('debug');
      setActiveTab('output');
      setOutput('⚠ stdin required for debug run. Provide input and run debug again.');
      return;
    }
    setDebugLoading(true);
    setDebugPaused(false);
    setDebugTraceLines([]);
    setDebugTraceIdx(0);
    setActiveTab('debug');
    try {
      /* For Python: wrap with sys.settrace to capture real line-by-line trace */
      let debugCode = code;
      if (language === 'python') {
        const preamble = [
          'import sys as __dbg_sys',
          '__dbg_trace = []',
          '__dbg_start_ln = [None]',
          '__dbg_src_lines = []',
          'def __dbg_tracer(frame, event, arg):',
          '    if event == "line":',
          '        if __dbg_start_ln[0] is None: __dbg_start_ln[0] = frame.f_lineno',
          '        real_ln = frame.f_lineno - __dbg_start_ln[0] + 1',
          '        locs = {}',
          '        for k, v in frame.f_locals.items():',
          '            if k.startswith("__dbg"): continue',
          '            try: locs[k] = repr(v)[:22]',
          '            except Exception: locs[k] = "<?>"',
          '        ls = ", ".join(f"{k}={v}" for k,v in list(locs.items())[:4])',
          '        src = __dbg_src_lines[real_ln-1].strip()[:35] if 0 < real_ln <= len(__dbg_src_lines) else ""',
          '        __dbg_trace.append(f"L{real_ln}  {src}" + (f"  | {ls}" if ls else ""))',
          '    return __dbg_tracer',
        ].join('\n');
        const codeLines = code.split('\n');
        const srcList = '[' + codeLines.map(l => JSON.stringify(l)).join(',') + ']';
        const suffix = [
          '__dbg_sys.settrace(None)',
          'print()',
          'print("__DBG_TRACE_START__")',
          'for __s in __dbg_trace[:120]: print(__s)',
          'print("__DBG_TRACE_END__")',
        ].join('\n');
        debugCode = `${preamble}\n__dbg_src_lines = ${srcList}\n__dbg_sys.settrace(__dbg_tracer)\n${code}\n${suffix}`;
      }

      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code: debugCode, stdin: userInput, timeout: execConfig.timeout }),
      });
      const data = await res.json() as { stdout: string; stderr: string; compile_output?: string; code: number; runtime: string; version?: string };

      let traceLines: string[];
      if (language === 'python' && (data.stdout ?? '').includes('__DBG_TRACE_START__')) {
        const parts = (data.stdout ?? '').split('__DBG_TRACE_START__');
        const mainOut = parts[0].trim();
        const traceSec = parts[1]?.split('__DBG_TRACE_END__')[0] ?? '';
        const steps = traceSec.trim().split('\n').filter(l => l.trim());
        traceLines = [
          ...(mainOut ? mainOut.split('\n').map(l => `▶ ${l}`) : ['▶ (no stdout output)']),
          '─── step trace ───',
          ...steps,
        ];
        /* Extract variable names+values from last few trace steps */
        const varMap: Record<string, string> = {};
        steps.slice(-30).forEach(step => {
          const pipe = step.indexOf(' | ');
          if (pipe === -1) return;
          step.slice(pipe + 3).split(', ').forEach(kv => {
            const eq = kv.indexOf('=');
            if (eq > 0) varMap[kv.slice(0, eq).trim()] = kv.slice(eq + 1).trim();
          });
        });
        const lv = Object.entries(varMap).map(([name, value]) => ({
          name, value,
          type: value.startsWith('[') ? 'list' : value.startsWith("{") ? 'dict' :
            value.startsWith("'") ? 'str' : /^\d+$/.test(value) ? 'int' :
              /^\d+\./.test(value) ? 'float' : 'any',
        }));
        if (lv.length > 0) {
          setLiveVars(lv);
          setDebugVars(lv.map(v => ({ ...v, scope: 'local' as const })));
          setWatchExpressions(lv.slice(0, 3).map(v => v.name));
        }
        const stackFromCode = Array.from(code.matchAll(/def\s+([a-zA-Z_][\w]*)\s*\(/g)).map(m => `${m[1]}()`);
        setCallStack(stackFromCode.length ? ['main()', ...stackFromCode.slice(0, 4)] : ['main()']);
      } else {
        const lines: string[] = [];
        if (data.compile_output?.trim()) lines.push(...data.compile_output.trim().split('\n').map(l => `[compile] ${l}`));
        const allOut = ((data.stdout ?? '') + (data.stderr ? '\n[stderr] ' + data.stderr : '')).trim();
        if (allOut) lines.push(...allOut.split('\n'));
        if (!lines.length) lines.push('(no output)');
        traceLines = lines;
        setCallStack(['main()']);
        setWatchExpressions([]);
        setDebugVars([]);
      }
      if (data.stderr?.trim() && language === 'python') traceLines.push(`[stderr] ${data.stderr.trim()}`);
      traceLines.push(`\u2713 Exit ${data.code}  [${data.runtime}]`);

      setDebugTraceLines(traceLines);
      setDebugTraceIdx(0);
      setDebugPaused(true);
      setDebugLine(breakpoints.length > 0 ? breakpoints[0].line : 1);
    } catch (err) {
      setDebugTraceLines([`Error: ${err instanceof Error ? err.message : String(err)}`]);
    }
    setDebugLoading(false);
  };

  const debugStepOver = () => {
    setDebugTraceIdx(i => Math.min(i + 1, debugTraceLines.length - 1));
    setDebugLine(prev => (prev || 1) + 1);
  };

  const debugStepInto = () => {
    setDebugTraceIdx(i => Math.min(i + 1, debugTraceLines.length - 1));
    setDebugLine(prev => (prev || 1) + 1);
  };

  const debugStop = () => {
    setDebugPaused(false);
    setDebugLine(null);
    setDebugTraceIdx(0);
  };

  /* Run all tests via execute API */
  const runTests = async (forceWithInput = false) => {
    if (INPUT_PATTERN.test(code) && !forceWithInput) {
      prepareInputModal('tests');
      setLiveTestResults([{ name: 'stdin required before tests', status: 'skip', time: '0ms' }]);
      return;
    }
    setTestRunning(true);
    setLiveTestResults([]);
    setActiveTab('tests');
    const runnerCode = code;
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code: runnerCode, stdin: userInput, timeout: execConfig.timeout }),
      });
      const data = await res.json() as { stdout: string; stderr: string; code: number; runtime: string };
      const out = (data.stdout + data.stderr).trim();
      const results: TestResult[] = [{
        name: data.code === 0 ? 'Program execution test' : 'Program execution failed',
        status: data.code === 0 ? 'pass' : 'fail',
        time: data.runtime,
        error: data.code === 0 ? undefined : (out || 'Execution failed with non-zero exit code'),
      }];
      setLiveTestResults(results);
      setTestResults(results);
    } catch (err) {
      const results = [{ name: `Error: ${err instanceof Error ? err.message : err}`, status: 'fail' as const, time: '' }];
      setLiveTestResults(results);
      setTestResults(results);
    }
    setTestRunning(false);
  };

  /* Open folder from local disk — preserves full nested tree structure (like VS Code) */
  const handleFolderOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const extToLang: Record<string, string> = { ...EXT_TO_LANG, txt: language, md: 'html', css: 'html', scss: 'html' };
    const allFiles = Array.from(fileList);
    const codeFiles = allFiles.filter(f => !!extToLang[f.name.split('.').pop()?.toLowerCase() ?? '']);
    if (codeFiles.length === 0) {
      alert('No supported code files found in the folder.');
      e.target.value = '';
      return;
    }
    const results: ProjectFile[] = new Array(codeFiles.length);
    let loadedCount = 0;
    const allFolderPaths = new Set<string>();
    codeFiles.forEach((file, idx) => {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      const detectedLang = extToLang[ext] ?? language;
      const baseName = file.name.replace(/\.[^.]+$/, '');
      // webkitRelativePath = "RootFolder/subfolder/file.py" — strip the root folder name
      const relativePath: string = (file as File & { webkitRelativePath?: string }).webkitRelativePath ?? file.name;
      const parts = relativePath.split('/');
      // parts[0] is the root folder name selected by the user — exclude it
      const folderParts = parts.length > 2 ? parts.slice(1, -1) : [];
      const folderPath = folderParts.join('/');
      if (folderPath) allFolderPaths.add(folderPath);
      // Also add all ancestor paths
      folderParts.forEach((_, i) => { const p = folderParts.slice(0, i + 1).join('/'); if (p) allFolderPaths.add(p); });
      const reader = new FileReader();
      reader.onload = ev => {
        const content = String(ev.target?.result ?? '');
        results[idx] = { name: baseName, content, language: detectedLang, active: idx === 0, modified: false, folder: folderPath };
        loadedCount++;
        if (loadedCount === codeFiles.length) {
          const validFiles = results.filter(Boolean);
          validFiles.sort((a, b) => {
            const fa = a.folder ?? ''; const fb = b.folder ?? '';
            if (fa !== fb) return fa.localeCompare(fb);
            return a.name.localeCompare(b.name);
          });
          setFiles(validFiles);
          if (validFiles[0]) { setCode(validFiles[0].content); setLanguage(validFiles[0].language); }
          setLeftTool('files');
          setExpandedFolders(new Set(allFolderPaths));
        }
      };
      reader.onerror = () => { loadedCount++; };
      reader.readAsText(file);
    });
    e.target.value = '';
  };

  const runAlgoViz = () => {
    if (!isAlgoVizEnabled) return;
    setAlgoRunning(true);
    const arr = [...algoArray];
    const steps: { arr: number[]; hl: number[] }[] = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        steps.push({ arr: [...arr], hl: [j, j + 1] });
        if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({ arr: [...arr], hl: [j, j + 1] });
      }
    }
    let step = 0;
    const iv = setInterval(() => {
      if (step >= steps.length) { clearInterval(iv); setAlgoRunning(false); setAlgoHighlight([]); return; }
      setAlgoArray(steps[step].arr);
      setAlgoHighlight(steps[step].hl);
      step++;
    }, algoSpeed);
  };

  /* ─── Computed helpers ─── */
  const errCount = lintIssues.filter(l => l.severity === 'error').length;
  const warnCount = lintIssues.filter(l => l.severity === 'warning').length;
  const infoCount = lintIssues.filter(l => l.severity === 'info').length;
  const TABS = ['output', 'debug', 'memory', 'tests', 'profiler', 'terminal', 'api', 'algo-viz'] as const;
  const TAB_ICONS: Record<string, React.ReactNode> = {
    output: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>,
    debug: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 00-4 4v1H6a2 2 0 000 4h1v2H6a2 2 0 000 4h2v1a4 4 0 008 0v-1h2a2 2 0 000-4h-1v-2h1a2 2 0 000-4h-2V6a4 4 0 00-4-4z" /></svg>,
    memory: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" /></svg>,
    tests: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>,
    profiler: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    terminal: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>,
    api: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>,
    'algo-viz': <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="14" width="4" height="7" rx="1" /><rect x="10" y="8" width="4" height="13" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" /></svg>,
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0e1116', color: '#c9d1d9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}>
      {/* ═══ Title Bar ═══ */}
      <div style={{
        height: 38, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 12px', background: '#161b22', borderBottom: '1px solid #21262d', flexShrink: 0,
      }}>
        {/* Left: brand + language tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#e6edf3', letterSpacing: '-0.02em' }}>CodeLab</span>
          </div>
          <div style={{ width: 1, height: 16, background: '#30363d', flexShrink: 0 }} />
          <div style={{ display: 'flex', gap: 1, overflowX: 'auto', flex: 1, scrollbarWidth: 'none' as const }}>
            {LANGUAGES.map(l => (
              <button key={l.id} onClick={() => setLanguage(l.id)} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, flexShrink: 0,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
                background: language === l.id ? '#8b5cf620' : 'transparent',
                color: language === l.id ? '#a78bfa' : '#8b949e',
              }}>
                <span style={{ display: 'inline-flex', width: 16, height: 16, marginRight: 6, verticalAlign: 'middle' }}>
                  <img src={l.logo} alt={l.label} style={{ width: 16, height: 16, objectFit: 'contain' }} />
                </span>
                {l.label}
              </button>
            ))}
          </div>
        </div>
        {/* Hidden file inputs */}
        <input ref={fileInputRef} type="file" multiple accept=".py,.js,.ts,.cpp,.java,.rs,.html,.go,.rb,.php,.kt,.r,.jl,.txt" style={{ display: 'none' }} onChange={handleFileUpload} />
        <input ref={folderInputRef} type="file" multiple style={{ display: 'none' }} onChange={handleFolderOpen} />
        {/* Right: actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
          {/* Docker config */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowConfig(!showConfig)} title="Container Config" style={{
              padding: '4px 8px', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer',
              background: showConfig ? '#30363d' : 'transparent', color: showConfig ? '#e6edf3' : '#8b949e',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
              {execConfig.cpuLimit}
            </button>
            {showConfig && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                onClick={e => e.stopPropagation()} style={{
                  position: 'absolute', top: '120%', right: 0, width: 260, zIndex: 200,
                  background: '#1c2128', border: '1px solid #30363d', borderRadius: 10,
                  padding: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#e6edf3', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                  Runtime Config
                </div>
                {[{ label: 'CPU', key: 'cpuLimit' as const, opts: ['0.5 core', '1 core', '2 cores', '4 cores'] },
                { label: 'RAM', key: 'memoryLimit' as const, opts: ['128 MB', '256 MB', '512 MB', '1 GB', '2 GB'] }].map(f => (
                  <div key={f.key} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: '#8b949e', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</div>
                    <select style={{
                      width: '100%', padding: '5px 8px', fontSize: 11, background: '#0d1117', color: '#e6edf3',
                      border: '1px solid #30363d', borderRadius: 6, outline: 'none',
                    }} value={(execConfig as unknown as Record<string, string | number | boolean>)[f.key] as string}
                      onChange={e => setExecConfig(p => ({ ...p, [f.key]: e.target.value }))}>{f.opts.map(o => <option key={o}>{o}</option>)}</select>
                  </div>
                ))}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#8b949e', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Timeout (s)</div>
                  <input type="number" min={1} max={60} value={execConfig.timeout}
                    onChange={e => setExecConfig(p => ({ ...p, timeout: Number(e.target.value) }))}
                    style={{ width: '100%', padding: '5px 8px', fontSize: 11, background: '#0d1117', color: '#e6edf3', border: '1px solid #30363d', borderRadius: 6, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid #21262d' }}>
                  <span style={{ fontSize: 11, color: '#8b949e' }}>GPU (CUDA)</span>
                  <div onClick={() => setExecConfig(p => ({ ...p, enableGPU: !p.enableGPU }))} style={{
                    width: 36, height: 20, borderRadius: 10, padding: 2, cursor: 'pointer',
                    background: execConfig.enableGPU ? '#8b5cf6' : '#30363d', transition: 'background 0.2s',
                  }}><motion.div animate={{ x: execConfig.enableGPU ? 16 : 0 }} style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff' }} /></div>
                </div>
              </motion.div>
            )}
          </div>
          <select value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{
            width: 52, padding: '3px 4px', fontSize: 11, background: '#0d1117', color: '#8b949e',
            border: '1px solid #30363d', borderRadius: 6, outline: 'none',
          }}>{[12, 13, 14, 15, 16, 18, 20].map(s => <option key={s} value={s}>{s}px</option>)}</select>
          {([
            { tip: 'Upload', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>, fn: () => fileInputRef.current?.click() },
            { tip: 'Stdin', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h14a2 2 0 002-2V7.5L14.5 2H6a2 2 0 00-2 2v4" /><polyline points="14 2 14 8 20 8" /><path d="M2 15h10" /><path d="M9 18l3-3-3-3" /></svg>, fn: () => setShowInput(!showInput), active: showInput },
            { tip: 'Collab', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>, fn: () => setShowCollab(!showCollab) },
          ]).map((b, i) => (
            <button key={i} onClick={b.fn} title={b.tip} style={{
              padding: '4px 6px', border: 'none', borderRadius: 6, cursor: 'pointer',
              background: (b as { active?: boolean }).active ? '#30363d' : 'transparent',
              color: (b as { active?: boolean }).active ? '#e6edf3' : '#8b949e',
              display: 'flex', alignItems: 'center',
            }}>{b.icon}</button>
          ))}
          <div style={{ width: 1, height: 16, background: '#30363d', margin: '0 2px' }} />
          <button onClick={() => setShowAI(v => !v)} style={{
            padding: '4px 10px', border: '1px solid #8b5cf630', borderRadius: 6, fontSize: 11, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            background: showAI ? '#8b5cf620' : 'transparent', color: showAI ? '#a78bfa' : '#8b949e',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1 1 1 0 01-1 1h-1v1a7 7 0 01-7 7h-1v1.27c.6.34 1 .99 1 1.73a2 2 0 01-4 0c0-.74.4-1.39 1-1.73V24h-1a7 7 0 01-7-7H2a1 1 0 01-1-1 1 1 0 011-1h1a7 7 0 017-7h1V5.73C10.4 5.39 10 4.74 10 4a2 2 0 012-2z" /></svg>
            AI
          </button>
          <button onClick={() => startDebug()} disabled={debugLoading} style={{
            padding: '4px 10px', border: '1px solid #30363d', borderRadius: 6, fontSize: 11, fontWeight: 600,
            cursor: debugLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            background: '#0d1117', color: debugLoading ? '#f0883e' : '#8b949e', opacity: debugLoading ? 0.8 : 1,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 00-4 4v1H6a2 2 0 000 4h1v2H6a2 2 0 000 4h2v1a4 4 0 008 0v-1h2a2 2 0 000-4h-1v-2h1a2 2 0 000-4h-2V6a4 4 0 00-4-4z" /></svg>
            {debugLoading ? 'Debugging…' : 'Debug'}
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => runCode()} disabled={running} style={{
              padding: '5px 16px', fontSize: 12, fontWeight: 700, border: 'none', borderRadius: 8,
              cursor: running ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              background: running ? '#238636' : 'linear-gradient(135deg, #238636, #2ea043)',
              color: '#fff', boxShadow: running ? 'none' : '0 2px 8px rgba(35,134,54,0.3)',
              opacity: running ? 0.8 : 1, transition: 'opacity 0.15s',
            }}>
            {running ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" opacity="0.3" /><path d="M12 6v6l4 2" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            )}
            {running ? 'Running…' : 'Run'}
          </motion.button>
        </div>
      </div>

      {/* ═══ Main Layout ═══ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Activity Bar */}
        <div style={{
          width: 48, background: '#161b22', borderRight: '1px solid #21262d',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '8px 0', flexShrink: 0,
        }}>
          {([
            { key: 'files' as const, tip: 'Explorer', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg> },
            { key: 'git' as const, tip: 'Source Control', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="12" cy="18" r="2.5" /><path d="M8.5 6h7M6 8.5v7a2.5 2.5 0 002.5 2.5h1M18 8.5v5a2.5 2.5 0 01-2.5 2.5h-1" /></svg> },
            { key: 'packages' as const, tip: 'Extensions', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="8" width="8" height="8" rx="1.5" /><rect x="13" y="8" width="8" height="8" rx="1.5" /><rect x="8" y="3" width="8" height="8" rx="1.5" /></svg> },
            { key: 'collab' as const, tip: 'Live Share', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="7" r="3.5" /><circle cx="17" cy="9" r="2.5" /><path d="M1 21a8 8 0 0116 0M14 21a6 6 0 0110 0" /></svg> },
            { key: 'snapshots' as const, tip: 'Timeline', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9.5" /><path d="M12 7v5l3.5 3.5" /></svg> },
          ]).map(t => (
            <button key={t.key} onClick={() => setLeftTool(t.key)} title={t.tip} style={{
              width: 36, height: 36, border: 'none', borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s',
              background: leftTool === t.key ? '#0d1117' : 'transparent',
              color: leftTool === t.key ? '#e6edf3' : '#484f58',
              borderLeft: leftTool === t.key ? '2px solid #8b5cf6' : '2px solid transparent',
            }}>{t.svg}</button>
          ))}
          <div style={{ flex: 1 }} />
          <button onClick={() => setShowAI(v => !v)} title="AI Assistant" style={{
            width: 36, height: 36, border: 'none', borderRadius: 8, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: showAI ? '#8b5cf620' : 'transparent', color: showAI ? '#a78bfa' : '#484f58',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>
          </button>
        </div>

        {/* Sidebar */}
        <div style={{
          width: 220, background: '#161b22', borderRight: '1px solid #21262d',
          display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden',
        }}>
          {/* Sidebar header */}
          <div style={{ padding: '10px 14px 8px', flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 5 }}>
              {leftTool === 'files' ? 'Explorer' : leftTool === 'git' ? 'Source Control' : leftTool === 'packages' ? 'Extensions' : leftTool === 'collab' ? 'Live Share' : 'Timeline'}
              {fsSyncing && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
              )}
            </div>
            {leftTool === 'files' && fsRootName && (
              <div style={{ fontSize: 10, color: '#6366f1', marginTop: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(99,102,241,0.3)" stroke="#6366f1" strokeWidth="1.5"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fsRootName.toUpperCase()}</span>
              </div>
            )}
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '0 6px 8px' }}>
            {/* Files panel */}
            {leftTool === 'files' && (
              <>
                {/* Explorer action icons — icon only, no text */}
                <div style={{ display: 'flex', gap: 2, marginBottom: 6, padding: '0 4px', alignItems: 'center' }}>
                  {/* New File */}
                  <button
                    title="New File"
                    onClick={() => { setShowNewFileInput(true); setTimeout(() => document.getElementById('new-file-input')?.focus(), 50); }}
                    style={{ width: 26, height: 26, borderRadius: 5, border: 'none', background: 'transparent', color: '#8b949e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLButtonElement).style.color = '#e6edf3'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#8b949e'; }}
                  >
                    {/* File + plus icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="13" x2="12" y2="19" />
                      <line x1="9" y1="16" x2="15" y2="16" />
                    </svg>
                  </button>

                  {/* New Folder */}
                  <button
                    title="New Folder"
                    onClick={() => { /* TODO: new folder */ }}
                    style={{ width: 26, height: 26, borderRadius: 5, border: 'none', background: 'transparent', color: '#8b949e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLButtonElement).style.color = '#e6edf3'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#8b949e'; }}
                  >
                    {/* Folder + plus icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                      <line x1="12" y1="11" x2="12" y2="17" />
                      <line x1="9" y1="14" x2="15" y2="14" />
                    </svg>
                  </button>

                  {/* Upload Files */}
                  <button
                    title="Upload File(s)"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ width: 26, height: 26, borderRadius: 5, border: 'none', background: 'transparent', color: '#8b949e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLButtonElement).style.color = '#e6edf3'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#8b949e'; }}
                  >
                    {/* Upload arrow */}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </button>

                  {/* Open Folder (sync entire tree) */}
                  <button
                    title="Open Folder — syncs entire folder tree"
                    onClick={openFolderAndSync}
                    disabled={fsSyncing}
                    style={{ width: 26, height: 26, borderRadius: 5, border: 'none', background: fsSyncing ? 'rgba(139,92,246,0.15)' : 'transparent', color: fsSyncing ? '#a78bfa' : '#8b949e', cursor: fsSyncing ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    onMouseEnter={e => { if (!fsSyncing) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#a78bfa'; } }}
                    onMouseLeave={e => { if (!fsSyncing) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#8b949e'; } }}
                  >
                    {fsSyncing ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                        <path d="M21 12a9 9 0 11-6.219-8.56" />
                      </svg>
                    ) : (
                      /* Folder with open-arrow (open folder icon) */
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                        <polyline points="12 11 12 17" />
                        <polyline points="9 14 12 11 15 14" />
                      </svg>
                    )}
                  </button>
                </div>
                {showNewFileInput && (
                  <form onSubmit={e => {
                    e.preventDefault();
                    const raw = newFileName.trim(); if (!raw) return;
                    const hasExt = raw.includes('.');
                    const baseName = hasExt ? raw.replace(/\.[^.]+$/, '') : raw;
                    const ext = raw.split('.').pop()?.toLowerCase() ?? '';
                    const detectedLang = hasExt ? (EXT_TO_LANG[ext] ?? language) : language;
                    const newFile: ProjectFile = { name: baseName, content: '', language: detectedLang, active: true, modified: false };
                    setFiles(prev => prev.map(f => ({ ...f, active: false })).concat(newFile));
                    setCode('');
                    setLanguage(detectedLang);
                    setNewFileName('');
                    setShowNewFileInput(false);
                  }} style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                    <input
                      id="new-file-input"
                      value={newFileName}
                      onChange={e => setNewFileName(e.target.value)}
                      placeholder={`filename${LANGUAGES.find(l => l.id === language)?.ext ?? '.py'}`}
                      onKeyDown={e => e.key === 'Escape' && (setShowNewFileInput(false), setNewFileName(''))}
                      style={{ flex: 1, padding: '4px 8px', fontSize: 11, background: '#0d1117', color: '#e6edf3', border: '1px solid #8b5cf6', borderRadius: 6, outline: 'none' }}
                    />
                    <button type="submit" style={{ padding: '4px 8px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg></button>
                  </form>
                )}
                {/* ─ Tree view renderer ─ */}
                {(() => {
                  // Build a map of folder → files
                  const rootFiles = files.filter(f => !f.folder);
                  // Collect all unique top-level folder names
                  const allFolderPaths = Array.from(new Set(
                    files.filter(f => !!f.folder).map(f => f.folder!.split('/')[0])
                  ));
                  // Recursive folder renderer
                  const renderFolder = (prefix: string, depth: number): React.ReactNode => {
                    const isExpanded = expandedFolders.has(prefix);
                    const dirName = prefix.split('/').pop() ?? prefix;
                    const filesInFolder = files.filter(f => f.folder === prefix);
                    // Any sub-folders at one level deeper
                    const subFolders = Array.from(new Set(
                      files
                        .filter(f => f.folder && f.folder.startsWith(prefix + '/'))
                        .map(f => {
                          const rest = f.folder!.slice(prefix.length + 1);
                          return prefix + '/' + rest.split('/')[0];
                        })
                    ));
                    return (
                      <div key={prefix}>
                        {/* Folder row */}
                        <div
                          onClick={() => setExpandedFolders(prev => {
                            const next = new Set(prev);
                            if (next.has(prefix)) next.delete(prefix); else next.add(prefix);
                            return next;
                          })}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: `4px 6px 4px ${8 + depth * 14}px`,
                            cursor: 'pointer', borderRadius: 5, fontSize: 11,
                            color: '#c9d1d9', fontWeight: 600,
                            transition: 'background 0.12s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          {/* Chevron */}
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5"
                            style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }}>
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                          {/* Folder icon */}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={isExpanded ? 'rgba(139,92,246,0.3)' : 'rgba(99,102,241,0.15)'} stroke="#8b5cf6" strokeWidth="1.5" style={{ flexShrink: 0 }}>
                            <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                          </svg>
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dirName}</span>
                          <span style={{ fontSize: 9, color: '#6b7280', background: 'rgba(255,255,255,0.06)', borderRadius: 999, padding: '1px 5px' }}>
                            {filesInFolder.length + subFolders.length}
                          </span>
                        </div>
                        {/* Children */}
                        {isExpanded && (
                          <div>
                            {subFolders.map(sf => renderFolder(sf, depth + 1))}
                            {filesInFolder.map((f) => {
                              const globalIdx = files.indexOf(f);
                              return renderFile(f, globalIdx, depth + 1);
                            })}
                          </div>
                        )}
                      </div>
                    );
                  };
                  const renderFile = (f: typeof files[0], i: number, depth: number): React.ReactNode => {
                    if (renamingFileIdx === i) return (
                      <form key={i} onSubmit={e => {
                        e.preventDefault();
                        const trimmed = renamingName.trim();
                        if (trimmed) {
                          const ext = trimmed.split('.').pop()?.toLowerCase() ?? '';
                          const hasExt = trimmed.includes('.');
                          const base = trimmed.replace(/\.[^.]+$/, '');
                          const detectedLang = hasExt ? (EXT_TO_LANG[ext] ?? files[i].language) : files[i].language;
                          setFiles(files.map((ff, fi) => fi === i ? { ...ff, name: base, language: detectedLang } : ff));
                          if (files[i].active) setLanguage(detectedLang);
                        }
                        setRenamingFileIdx(null); setRenamingName('');
                      }} style={{ display: 'flex', gap: 4, padding: `3px 6px 3px ${8 + depth * 14}px` }}>
                        <input autoFocus value={renamingName} onChange={e => setRenamingName(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Escape') { setRenamingFileIdx(null); setRenamingName(''); } }}
                          style={{ flex: 1, fontSize: 11, padding: '3px 6px', background: '#0d1117', color: '#e6edf3', border: '1px solid #8b5cf6', borderRadius: 6, outline: 'none' }} />
                        <button type="submit" style={{ padding: '3px 7px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                        </button>
                      </form>
                    );
                    return (
                      <div key={i} style={{ position: 'relative' }}>
                        <div
                          onClick={() => { setFiles(files.map((ff, fi) => ({ ...ff, active: fi === i }))); setCode(f.content || ''); setLanguage(f.language); }}
                          onDoubleClick={() => { setRenamingFileIdx(i); setRenamingName(f.name); }}
                          title="Click to open · Double-click to rename"
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: `5px 8px 5px ${10 + depth * 14}px`,
                            borderRadius: 6, cursor: 'pointer', fontSize: 11,
                            position: 'relative', transition: 'background 0.15s',
                            background: f.active ? 'rgba(139,92,246,0.12)' : 'transparent',
                            color: f.active ? '#e6edf3' : '#8b949e',
                            borderLeft: f.active ? '2px solid #8b5cf6' : '2px solid transparent',
                          }}
                          onMouseEnter={e => { if (!f.active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                          onMouseLeave={e => { if (!f.active) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <img src={LANGUAGES.find(l => l.id === f.language)?.logo} alt={f.language}
                            style={{ width: 13, height: 13, objectFit: 'contain', flexShrink: 0 }} />
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {f.name}{LANGUAGES.find(l => l.id === f.language)?.ext ?? LANGUAGES.find(l => l.id === language)?.ext}
                          </span>
                          {f.modified && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#eab308', flexShrink: 0 }} />}
                          <span
                            onClick={e => { e.stopPropagation(); if (files.length > 1) setFiles(files.filter((_, fi) => fi !== i)); }}
                            title="Delete file"
                            style={{ fontSize: 10, lineHeight: 1, padding: '1px 3px', borderRadius: 3, background: 'transparent', color: '#ef4444', cursor: 'pointer', opacity: 0.4, flexShrink: 0 }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
                          >✕</span>
                        </div>
                      </div>
                    );
                  };
                  return (
                    <>
                      {/* Root-level files */}
                      {rootFiles.map(f => renderFile(f, files.indexOf(f), 0))}
                      {/* Top-level folders */}
                      {allFolderPaths.map(fp => renderFolder(fp, 0))}
                    </>
                  );
                })()}
              </>
            )}
            {leftTool === 'git' && (
              <>
                <div style={{ padding: '4px 8px', fontSize: 11, color: '#c9d1d9', marginBottom: 8 }}>
                  Branch: <span style={{ color: '#8b5cf6', fontWeight: 600 }}>{gitBranch}</span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#8b949e', padding: '4px 8px', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Changes ({gitChanges.length})</div>
                {gitChanges.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', fontSize: 11, color: c.status === 'modified' ? '#eab308' : '#22c55e' }}>
                    <span style={{ fontWeight: 700, fontSize: 10, width: 14 }}>{c.status === 'modified' ? 'M' : 'A'}</span>
                    <span style={{ color: '#c9d1d9' }}>{c.file}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 4, padding: '8px 4px', marginTop: 8 }}>
                  <button style={{ fontSize: 10, padding: '5px 8px', flex: 1, background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Commit</button>
                  <button style={{ fontSize: 10, padding: '5px 8px', flex: 1, background: '#161b22', color: '#c9d1d9', border: '1px solid #21262d', borderRadius: 6, cursor: 'pointer' }}>Push</button>
                </div>
              </>
            )}

            {leftTool === 'packages' && (
              <>
                <input placeholder="Search packages…" style={{
                  width: '100%', padding: '5px 8px', fontSize: 11, marginBottom: 8, background: '#0d1117',
                  color: '#e6edf3', border: '1px solid #21262d', borderRadius: 6, outline: 'none',
                }} />
                {packages.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 6, fontSize: 11, borderBottom: '1px solid #21262d' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#e6edf3' }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: '#8b949e' }}>{p.version}</div>
                    </div>
                    <button onClick={() => setPackages(pkgs => pkgs.map((pp, pi) => pi === i ? { ...pp, installed: !pp.installed } : pp))} style={{
                      fontSize: 9, padding: '2px 6px', borderRadius: 3, border: 'none', cursor: 'pointer',
                      background: p.installed ? 'rgba(34,197,94,0.12)' : 'rgba(139,92,246,0.12)',
                      color: p.installed ? '#22c55e' : '#8b5cf6', fontWeight: 600,
                    }}>{p.installed ? '✓ Installed' : 'Install'}</button>
                  </div>
                ))}
              </>
            )}

            {leftTool === 'collab' && (
              collaborators.length > 0 ? collaborators.map((c, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 6,
                  background: '#161b22', marginBottom: 4,
                }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 700 }}>{c.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#e6edf3' }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: '#8b949e' }}>Line {c.cursor.line}, Col {c.cursor.col}</div>
                  </div>
                </div>
              )) : <div style={{ fontSize: 11, color: '#8b949e', padding: '8px 6px' }}>No active collaborators in this session.</div>
            )}

            {leftTool === 'snapshots' && (
              <>
                <button onClick={() => saveSnapshot()} style={{
                  width: '100%', fontSize: 10, marginBottom: 8, padding: '5px 8px',
                  border: '1px solid #21262d', borderRadius: 6,
                  background: '#161b22', color: '#c9d1d9', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                  Save Snapshot
                </button>
                {snapshots.length === 0 && (
                  <div style={{ fontSize: 11, color: '#8b949e', textAlign: 'center', marginTop: 20, padding: '0 8px' }}>
                    No snapshots yet.<br />Click “Save Snapshot” to save the current editor state.
                  </div>
                )}
                {snapshots.map((s) => (
                  <div key={s.id} style={{ padding: 8, borderRadius: 6, background: '#161b22', marginBottom: 4, cursor: 'pointer', border: '1px solid #21262d' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div onClick={() => { setCode(s.code); setLanguage(s.language); }} style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#e6edf3' }}>{s.label}</div>
                        <div style={{ fontSize: 10, color: '#8b949e', marginTop: 2 }}>{s.timestamp} · {s.language}</div>
                      </div>
                      <span
                        onClick={() => setSnapshots(prev => prev.filter(x => x.id !== s.id))}
                        style={{ fontSize: 11, color: '#ef4444', cursor: 'pointer', padding: '2px 6px', borderRadius: 3, flexShrink: 0 }}
                        title="Delete snapshot"
                      >✕</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Editor + Output */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Lint bar */}
          {lintIssues.length > 0 && (
            <div style={{
              height: 24, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
              background: '#1c2128', borderBottom: '1px solid #21262d', fontSize: 11,
            }}>
              <span style={{ color: '#ef4444' }}>✗ {lintIssues.filter(l => l.severity === 'error').length}</span>
              <span style={{ color: '#eab308' }}>⚠ {lintIssues.filter(l => l.severity === 'warning').length}</span>
              <span style={{ color: '#38bdf8' }}>ℹ {lintIssues.filter(l => l.severity === 'info').length}</span>
              <div style={{ flex: 1 }} />
              <span style={{ color: '#8b949e' }}>{LANGUAGES.find(l => l.id === language)?.label} {LANGUAGES.find(l => l.id === language)?.version}</span>
            </div>
          )}

          {/* ═══ GitHub Copilot-style Accept/Reject Diff Toolbar ═══ */}
          {pendingDiff && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px',
              background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(99,102,241,0.06))',
              borderBottom: '1px solid rgba(34,197,94,0.2)', flexShrink: 0,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
              <span style={{ fontSize: 11, color: '#86efac', fontWeight: 600 }}>
                {pendingDiff.lines.filter(l => l.type !== 'same').length} change{pendingDiff.lines.filter(l => l.type !== 'same').length !== 1 ? 's' : ''} from AI Copilot
              </span>
              <span style={{ flex: 1 }} />
              <button
                onClick={acceptDiff}
                style={{ padding: '4px 12px', borderRadius: 6, border: 'none', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                Accept All
              </button>
              <button
                onClick={rejectDiff}
                style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                Reject All
              </button>
            </div>
          )}

          {/* Code area */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', borderBottom: '2px solid #21262d' }}>
            <div style={{ minWidth: 52, background: '#0d1117', borderRight: '1px solid #21262d', userSelect: 'none' as const, overflow: 'hidden' }}>
              {Array.from({ length: lineCount }, (_, i) => {
                const ln = i + 1;
                const hasBp = breakpoints.some(b => b.line === ln);
                const isDbg = debugLine === ln;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', height: fontSize * 1.5, background: isDbg ? 'rgba(99,102,241,0.15)' : 'transparent' }}>
                    <div onClick={() => toggleBreakpoint(ln)} style={{ width: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 8 }}>
                      {hasBp && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />}
                      {isDbg && !hasBp && <span style={{ color: '#8b5cf6' }}>▶</span>}
                    </div>
                    <div style={{
                      flex: 1, textAlign: 'right', paddingRight: 8, fontFamily: 'var(--font-mono)',
                      fontSize: fontSize - 2, color: isDbg ? '#8b5cf6' : '#484f58',
                      lineHeight: `${fontSize * 1.5}px`,
                    }}>{ln}</div>
                  </div>
                );
              })}
            </div>
            {/* ─ Editor: diff viewer when diff is pending, else normal textarea ─ */}
            {pendingDiff ? (
              <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize, lineHeight: `${fontSize * 1.5}px`, background: '#0d1117' }}>
                {pendingDiff.lines.map((line, idx) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'baseline', gap: 0,
                    background: line.type === 'add' ? 'rgba(34,197,94,0.12)'
                      : line.type === 'del' ? 'rgba(239,68,68,0.1)'
                        : 'transparent',
                    borderLeft: `3px solid ${line.type === 'add' ? '#22c55e'
                      : line.type === 'del' ? '#ef4444'
                        : 'transparent'
                      }`,
                    minHeight: fontSize * 1.5,
                  }}>
                    <span style={{ width: 22, textAlign: 'center', fontSize: fontSize - 3, color: line.type === 'add' ? '#22c55e' : line.type === 'del' ? '#ef4444' : '#484f58', flexShrink: 0, userSelect: 'none' }}>
                      {line.type === 'add' ? '+' : line.type === 'del' ? '−' : ' '}
                    </span>
                    <span style={{ padding: '0 12px', whiteSpace: 'pre', color: line.type === 'add' ? '#86efac' : line.type === 'del' ? '#fca5a5' : '#e6edf3' }}>{line.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <textarea ref={editorRef} value={code}
                onChange={e => {
                  const nextCode = e.target.value;
                  setCode(nextCode);
                  setFiles(fs => fs.map(f => f.active ? { ...f, content: nextCode, modified: true } : f));
                }}
                spellCheck={false}
                style={{
                  flex: 1, resize: 'none', border: 'none', outline: 'none',
                  padding: '12px 16px', background: '#0d1117', color: '#e6edf3',
                  fontFamily: 'var(--font-mono)', fontSize, lineHeight: `${fontSize * 1.5}px`, tabSize: 4,
                }}
                onKeyDown={e => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const s = e.currentTarget.selectionStart, end = e.currentTarget.selectionEnd;
                    setCode(code.substring(0, s) + '    ' + code.substring(end));
                    setTimeout(() => { if (editorRef.current) editorRef.current.selectionStart = editorRef.current.selectionEnd = s + 4; }, 0);
                  }
                }}
              />
            )}
            {showCollab && (
              <div style={{ position: 'absolute', top: 120, right: 310, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 5 }}>
                {collaborators.map((c, i) => (
                  <div key={i} style={{ padding: '2px 8px', borderRadius: 4, background: c.color, color: '#fff', fontSize: 10, fontWeight: 600 }}>
                    {c.name} — L{c.cursor.line}
                  </div>
                ))}
              </div>
            )}
          </div>

          {showInput && (
            <div style={{ padding: '8px 16px', background: '#1c2128', borderBottom: '1px solid #21262d' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#8b949e', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                Standard Input (stdin)
                <span style={{ fontSize: 10, color: '#eab308', background: 'rgba(234,179,8,0.1)', padding: '1px 6px', borderRadius: 8 }}>required by code</span>
              </div>
              <textarea value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Enter input values…"
                style={{
                  width: '100%', height: 40, resize: 'none', background: '#0d1117', color: '#e6edf3',
                  border: '1px solid #21262d', borderRadius: 6,
                  padding: '6px 10px', fontSize: 12, fontFamily: 'var(--font-mono)', outline: 'none',
                }} />
            </div>
          )}

          {/* ═══ Drag handle (resize editor / output) ═══ */}
          <div
            title="Drag to resize"
            style={{ height: 5, cursor: 'ns-resize', background: 'transparent', flexShrink: 0, position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseDown={e => {
              panelDragStartY.current = e.clientY;
              panelDragStartH.current = panelHeight;
              const onMove = (ev: MouseEvent) => {
                const delta = panelDragStartY.current - ev.clientY;
                setPanelHeight(Math.max(120, Math.min(720, panelDragStartH.current + delta)));
              };
              const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
              window.addEventListener('mousemove', onMove);
              window.addEventListener('mouseup', onUp);
              e.preventDefault();
            }}
          >
            <div style={{ width: 36, height: 3, borderRadius: 2, background: '#21262d', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#8b5cf6')}
              onMouseLeave={e => (e.currentTarget.style.background = '#21262d')}
            />
          </div>
          {/* ═══ Output panel ═══ */}
          <div style={{ height: panelHeight, flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#0d1117' }}>
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #21262d', background: '#161b22', overflow: 'auto' }}>
              {TABS.map(tab => {
                const disabled = tab === 'algo-viz' && !isAlgoVizEnabled;
                return (
                  <button key={tab} onClick={() => !disabled && setActiveTab(tab)} disabled={disabled} title={disabled ? 'Algo Viz is enabled for data-structure/algorithm code only' : ''} style={{
                    padding: '6px 12px', fontSize: 11, cursor: 'pointer', border: 'none',
                    background: activeTab === tab ? '#0d1117' : 'transparent',
                    color: disabled ? '#484f58' : (activeTab === tab ? '#e6edf3' : '#8b949e'),
                    borderBottom: activeTab === tab ? '2px solid #8b5cf6' : '2px solid transparent',
                    fontWeight: activeTab === tab ? 600 : 400,
                    transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5, opacity: disabled ? 0.55 : 1,
                    textTransform: 'capitalize' as const,
                  }}>
                    {TAB_ICONS[tab]}
                    {tab === 'algo-viz' ? 'Algo Viz' : tab}
                  </button>
                )
              })}
              <div style={{ flex: 1 }} />
              <button onClick={() => { setOutput(''); setInteractiveMode(false); setInteractiveLines([]); }} style={{ padding: '4px 10px', border: 'none', background: 'transparent', color: '#8b949e', fontSize: 10, cursor: 'pointer' }}>Clear</button>
            </div>
            <div ref={outputScrollRef} style={{ flex: 1, padding: '10px 14px', overflow: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#e6edf3' }}>
              {activeTab === 'output' && (
                language === 'html' && htmlPreview
                  ? <iframe
                    srcDoc={htmlPreview}
                    style={{ width: '100%', height: '100%', border: 'none', borderRadius: 4, background: '#fff' }}
                    sandbox="allow-scripts allow-same-origin"
                    title="HTML Live Preview"
                  />
                  : interactiveMode ? (
                    /* ── Interactive Terminal Input UI ── */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minHeight: '100%' }}>
                      {/* Rendered past lines */}
                      {interactiveLines.map((line, i) => (
                        <div key={i} style={{
                          fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: '20px',
                          color: line.type === 'prompt' ? '#a78bfa'
                            : line.type === 'input' ? '#86efac'
                              : line.type === 'error' ? '#f87171'
                                : '#e2e8f0',
                          display: 'flex', alignItems: 'baseline', gap: 4,
                        }}>
                          {line.type === 'prompt' && <span style={{ color: '#8b5cf6', flexShrink: 0 }}>›</span>}
                          {line.type === 'input' && <span style={{ color: '#6b7280', flexShrink: 0 }}>›</span>}
                          {line.type === 'output' && <span style={{ color: '#f59e0b', flexShrink: 0 }}>⚡</span>}
                          <span>{line.text}</span>
                        </div>
                      ))}
                      {/* Active input row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <span style={{ color: '#8b5cf6', fontFamily: 'var(--font-mono)', fontSize: 12, flexShrink: 0 }}>›</span>
                        <input
                          ref={interactiveInputRef}
                          value={interactiveInputVal}
                          onChange={e => setInteractiveInputVal(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleInteractiveSubmit(); } }}
                          placeholder="Type your input and press Enter…"
                          style={{
                            flex: 1, background: 'transparent', border: 'none', outline: 'none',
                            color: '#86efac', fontFamily: 'var(--font-mono)', fontSize: 12,
                            caretColor: '#86efac',
                          }}
                          autoFocus
                        />
                        <button
                          onClick={handleInteractiveSubmit}
                          style={{
                            padding: '2px 12px', fontSize: 11, background: '#8b5cf6', color: '#fff',
                            border: 'none', borderRadius: 4, cursor: 'pointer', flexShrink: 0,
                            fontFamily: 'inherit', letterSpacing: '0.02em',
                          }}
                        >Enter ↵</button>
                      </div>
                      <div style={{ marginTop: 8, fontSize: 10, color: '#484f58' }}>
                        Input {interactivePromptIdx + 1} of {interactiveAllPrompts.length} — press Enter or click Enter ↵
                      </div>
                    </div>
                  ) : (
                    /* ── Regular output ── */
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {output
                        ? output.split('\n').map((line, i) => (
                          <span key={i} style={{
                            color: /^✗|^\[stderr\]|error|traceback/i.test(line) ? '#f87171'
                              : /^✓/.test(line) ? '#86efac'
                                : /^▶/.test(line) ? '#a78bfa'
                                  : /^─+$/.test(line) ? '#30363d'
                                    : '#e6edf3',
                            display: 'block',
                          }}>{line}</span>
                        ))
                        : <span style={{ color: '#8b949e' }}>Press ⌘/Ctrl+Enter to run — code executes on a real remote compiler.</span>}
                    </pre>
                  )
              )}

              {activeTab === 'debug' && (
                <div style={{ color: '#c9d1d9', fontSize: 11 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 8, alignItems: 'center' }}>
                    <button onClick={() => startDebug()} disabled={debugLoading} style={{ fontSize: 10, padding: '3px 8px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', opacity: debugLoading ? 0.6 : 1 }}>
                      {debugLoading ? '⏳ Running…' : '▶ Start'}
                    </button>
                    <button onClick={debugStepOver} disabled={!debugPaused} style={{ fontSize: 10, padding: '3px 8px', background: '#161b22', color: '#c9d1d9', border: '1px solid #21262d', borderRadius: 6, cursor: debugPaused ? 'pointer' : 'not-allowed', opacity: debugPaused ? 1 : 0.4 }}>⏩ Step Over</button>
                    <button onClick={debugStepInto} disabled={!debugPaused} style={{ fontSize: 10, padding: '3px 8px', background: '#161b22', color: '#c9d1d9', border: '1px solid #21262d', borderRadius: 6, cursor: debugPaused ? 'pointer' : 'not-allowed', opacity: debugPaused ? 1 : 0.4 }}>⏬ Step Into</button>
                    <button onClick={debugStop} disabled={!debugPaused && !debugLoading} style={{ fontSize: 10, padding: '3px 8px', background: '#161b22', color: '#c9d1d9', border: '1px solid #21262d', borderRadius: 6, cursor: 'pointer', opacity: (!debugPaused && !debugLoading) ? 0.4 : 1 }}>⏹ Stop</button>
                    {debugPaused && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(234,179,8,0.12)', color: '#eab308' }}>PAUSED — step {debugTraceIdx + 1}/{debugTraceLines.length}</span>}
                    <div style={{ flex: 1 }} />
                    <span style={{ fontSize: 10, color: '#8b949e' }}>Breakpoints: {breakpoints.map(b => `L${b.line}`).join(', ') || 'Click gutter to add'}</span>
                  </div>

                  {/* Trace output — real execution lines */}
                  {debugTraceLines.length > 0 ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ flex: 2, maxHeight: 130, overflowY: 'auto', background: '#161b22', borderRadius: 6, padding: 6 }}>
                        <div style={{ fontSize: 9, color: '#8b949e', textTransform: 'uppercase', marginBottom: 4 }}>Execution Trace</div>
                        {debugTraceLines.map((line, i) => (
                          <div key={i} style={{
                            padding: '2px 6px', borderRadius: 3, fontFamily: 'var(--font-mono)', fontSize: 11,
                            background: i === debugTraceIdx ? 'rgba(99,102,241,0.25)' : 'transparent',
                            color: i === debugTraceIdx ? '#ddd6fe' : i < debugTraceIdx ? '#4b5563' : '#c9d1d9',
                            borderLeft: i === debugTraceIdx ? '2px solid #8b5cf6' : '2px solid transparent',
                          }}>
                            {i === debugTraceIdx ? '▶ ' : '  '}{line}
                          </div>
                        ))}
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ padding: 8, background: '#161b22', borderRadius: 6, flex: 1, overflow: 'auto' }}>
                          <div style={{ fontSize: 9, color: '#8b949e', textTransform: 'uppercase', marginBottom: 4 }}>Call Stack</div>
                          {callStack.map((f, i) => <div key={i} style={{ fontSize: 11, padding: '2px 0', color: i === 0 ? '#8b5cf6' : '#c9d1d9' }}>{f}</div>)}
                        </div>
                        <div style={{ padding: 8, background: '#161b22', borderRadius: 6, flex: 1, overflow: 'auto' }}>
                          <div style={{ fontSize: 9, color: '#8b949e', textTransform: 'uppercase', marginBottom: 4 }}>Watch</div>
                          {watchExpressions.map((w, i) => (
                            <div key={i} style={{ fontSize: 11, padding: '2px 0' }}>
                              <span style={{ color: '#8b5cf6' }}>{w}</span><span style={{ color: '#8b949e' }}> → </span>
                              <span style={{ color: '#2dd4bf' }}>{liveVars.find(v => v.name === w)?.value ?? 'n/a'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* No trace yet — show static vars/stack layout */
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                      <div style={{ padding: 8, background: '#161b22', borderRadius: 6 }}>
                        <div style={{ fontSize: 9, color: '#8b949e', textTransform: 'uppercase', marginBottom: 6 }}>Call Stack</div>
                        {callStack.map((f, i) => <div key={i} style={{ fontSize: 11, padding: '2px 0', color: i === 0 ? '#8b5cf6' : '#c9d1d9' }}>{f}</div>)}
                      </div>
                      <div style={{ padding: 8, background: '#161b22', borderRadius: 6 }}>
                        <div style={{ fontSize: 9, color: '#8b949e', textTransform: 'uppercase', marginBottom: 6 }}>Variables</div>
                        {debugVars.map((v, i) => (
                          <div key={i} style={{ fontSize: 11, padding: '2px 0' }}>
                            <span style={{ color: '#8b949e' }}>{v.scope[0].toUpperCase()} </span>
                            <span style={{ color: '#e6edf3' }}>{v.name}</span>
                            <span style={{ color: '#8b949e' }}> = </span>
                            <span style={{ color: v.type === 'int' ? '#38bdf8' : v.type === 'list' ? '#2dd4bf' : '#eab308' }}>{v.value}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: 8, background: '#161b22', borderRadius: 6 }}>
                        <div style={{ fontSize: 9, color: '#8b949e', textTransform: 'uppercase', marginBottom: 6 }}>Watch</div>
                        {watchExpressions.map((w, i) => (
                          <div key={i} style={{ fontSize: 11, padding: '2px 0' }}>
                            <span style={{ color: '#8b5cf6' }}>{w}</span>
                            <span style={{ color: '#8b949e' }}> → </span>
                            <span style={{ color: '#2dd4bf' }}>{liveVars.find(v => v.name === w)?.value ?? 'n/a'}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 10, color: '#8b949e', gridColumn: '1 / -1', marginTop: 4 }}>Click ▶ Start to run code and generate execution trace.</div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'memory' && (
                <div style={{ color: '#c9d1d9', fontSize: 11 }}>
                  <div style={{ fontWeight: 600, color: '#8b5cf6', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    Memory Inspector
                    {liveVars.length > 0 && <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 8, background: 'rgba(99,102,241,0.15)', color: '#8b5cf6' }}>LIVE</span>}
                  </div>
                  {liveVars.length > 0 ? (
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ minWidth: 180 }}>
                        <div style={{ fontSize: 9, color: '#8b949e', textTransform: 'uppercase', marginBottom: 5, letterSpacing: '0.06em' }}>Variables — Last Frame</div>
                        {liveVars.map((v, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, padding: '3px 8px', marginBottom: 2, background: `rgba(99,102,241,${0.03 + (i % 5) * 0.03})`, borderLeft: '2px solid #8b5cf6', borderRadius: 2, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                            <span style={{ color: '#8b5cf6', minWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</span>
                            <span style={{ color: '#8b949e' }}>=</span>
                            <span style={{ color: v.type === 'int' ? '#38bdf8' : v.type === 'float' ? '#a78bfa' : v.type === 'list' ? '#2dd4bf' : v.type === 'dict' ? '#fb923c' : v.type === 'str' ? '#4ade80' : '#e6edf3', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.value}</span>
                            <span style={{ fontSize: 9, color: '#8b949e' }}>{v.type}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontSize: 9, color: '#8b949e', textTransform: 'uppercase', marginBottom: 5, letterSpacing: '0.06em' }}>Type Distribution</div>
                        {Array.from(new Set(liveVars.map(v => v.type))).map((t, i) => {
                          const count = liveVars.filter(v => v.type === t).length;
                          const pct = Math.round(count / liveVars.length * 100);
                          const col = t === 'int' ? '#38bdf8' : t === 'float' ? '#a78bfa' : t === 'list' ? '#2dd4bf' : t === 'dict' ? '#fb923c' : t === 'str' ? '#4ade80' : '#94a3b8';
                          return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, fontSize: 11 }}>
                              <span style={{ color: col, minWidth: 40 }}>{t}</span>
                              <div style={{ width: 80, height: 6, borderRadius: 3, background: '#161b22' }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: col, borderRadius: 3 }} />
                              </div>
                              <span style={{ color: '#8b949e', fontSize: 10 }}>{count}</span>
                            </div>
                          );
                        })}
                        <div style={{ marginTop: 8, fontSize: 9, color: '#8b949e' }}>{liveVars.length} variables captured from trace</div>
                      </div>
                    </div>
                  ) : <div style={{ fontSize: 11, color: '#8b949e' }}>Run Debug to capture real memory variables from execution.</div>}
                </div>
              )}

              {activeTab === 'tests' && (
                <div style={{ color: '#c9d1d9', fontSize: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: '#8b5cf6' }}>Unit Tests</span>
                    <button onClick={() => runTests()} disabled={testRunning} style={{ fontSize: 10, padding: '3px 8px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 6, cursor: testRunning ? 'not-allowed' : 'pointer', opacity: testRunning ? 0.6 : 1 }}>
                      {testRunning ? '⏳ Running…' : '▶ Run All'}
                    </button>
                  </div>
                  {/* Live results when available, else static placeholder */}
                  {(liveTestResults.length > 0 ? liveTestResults : testResults).map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid #21262d' }}>
                      <span style={{ color: t.status === 'pass' ? '#22c55e' : t.status === 'fail' ? '#ef4444' : '#8b949e', fontWeight: 700, width: 14 }}>{t.status === 'pass' ? '✓' : t.status === 'fail' ? '✗' : '⊘'}</span>
                      <span style={{ flex: 1, color: t.status === 'fail' ? '#ef4444' : '#e6edf3' }}>{t.name}</span>
                      <span style={{ color: '#8b949e', fontSize: 10 }}>{t.time}</span>
                    </div>
                  ))}
                  {(liveTestResults.length > 0 ? liveTestResults : testResults).some(t => t.error) && (
                    <div style={{ marginTop: 8, padding: 8, background: 'rgba(239,68,68,0.08)', borderRadius: 4, borderLeft: '3px solid #ef4444' }}>
                      {(liveTestResults.length > 0 ? liveTestResults : testResults).filter(t => t.error).map((t, i) => (
                        <div key={i} style={{ fontSize: 10 }}>
                          <div style={{ color: '#ef4444', fontWeight: 600 }}>{t.name}: {t.error}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ marginTop: 8, fontSize: 10 }}>
                    {liveTestResults.length > 0 && <span style={{ fontSize: 9, color: '#8b5cf6', marginRight: 8 }}>● LIVE</span>}
                    <span style={{ color: '#22c55e' }}>{(liveTestResults.length > 0 ? liveTestResults : testResults).filter(t => t.status === 'pass').length} passed</span>{' · '}
                    <span style={{ color: '#ef4444' }}>{(liveTestResults.length > 0 ? liveTestResults : testResults).filter(t => t.status === 'fail').length} failed</span>{' · '}
                    <span style={{ color: '#8b949e' }}>{(liveTestResults.length > 0 ? liveTestResults : testResults).filter(t => t.status === 'skip').length} skipped</span>
                  </div>
                </div>
              )}

              {activeTab === 'profiler' && (
                <div style={{ color: '#c9d1d9', fontSize: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: '#8b5cf6' }}>Performance Profiler</span>
                    <button style={{ fontSize: 10, padding: '3px 8px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg> Profile Run</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr', gap: 4, marginBottom: 4, fontSize: 9, color: '#8b949e', textTransform: 'uppercase' }}>
                    <span>Function</span><span>Calls</span><span>Total</span><span>Self</span><span>% Time</span>
                  </div>
                  {profileData.length === 0 && <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 8 }}>Run code to generate real profiling rows.</div>}
                  {profileData.map((p, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr', gap: 4, padding: '4px 0', borderBottom: '1px solid #21262d', alignItems: 'center' }}>
                      <span style={{ color: '#e6edf3', fontWeight: 600 }}>{p.fn}</span>
                      <span>{p.calls}</span><span>{p.totalTime}</span><span>{p.selfTime}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#161b22', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${p.percentage}%`, background: p.percentage > 50 ? '#ef4444' : p.percentage > 20 ? '#eab308' : '#22c55e', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 10 }}>{p.percentage}%</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 8, fontSize: 10, color: '#8b949e' }}>Total: {profileData.reduce((sum, p) => sum + Number(p.totalTime.replace(/[^\d.]/g, '') || 0), 0).toFixed(3)}ms | Functions: {profileData.length}</div>
                </div>
              )}

              {activeTab === 'terminal' && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 6, marginBottom: 6, borderBottom: '1px solid #21262d', flexShrink: 0, overflowX: 'auto' }}>
                    {terminalSessions.map(session => (
                      <button
                        key={session.id}
                        onClick={() => setActiveTerminalId(session.id)}
                        style={{
                          padding: '3px 8px', fontSize: 10, borderRadius: 6, border: '1px solid #21262d',
                          background: session.id === activeTerminalId ? '#8b5cf620' : '#161b22',
                          color: session.id === activeTerminalId ? '#e6edf3' : '#8b949e', cursor: 'pointer',
                        }}
                      >
                        {session.name}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        const nextId = (terminalSessions.length ? Math.max(...terminalSessions.map(t => t.id)) : 0) + 1;
                        setTerminalSessions(prev => [...prev, { id: nextId, name: `Terminal ${nextId}`, history: [], input: '', cmdHistory: [], cmdHistoryIdx: -1 }]);
                        setActiveTerminalId(nextId);
                      }}
                      title="New terminal"
                      style={{ padding: '3px 8px', fontSize: 12, borderRadius: 6, border: '1px solid #21262d', background: '#161b22', color: '#8b949e', cursor: 'pointer' }}
                    >+
                    </button>
                    <button
                      onClick={() => {
                        if (terminalSessions.length > 1) {
                          const remaining = terminalSessions.filter(t => t.id !== activeTerminalId);
                          setTerminalSessions(remaining);
                          setActiveTerminalId(remaining[0].id);
                        } else {
                          updateActiveTerminal(t => ({ ...t, history: [], input: '', cmdHistory: [], cmdHistoryIdx: -1 }));
                        }
                      }}
                      title="Kill terminal"
                      style={{ padding: '3px 8px', fontSize: 11, borderRadius: 6, border: '1px solid #21262d', background: '#161b22', color: '#ef4444', cursor: 'pointer' }}
                    >
                      🗑
                    </button>
                  </div>
                  <div ref={terminalScrollRef} style={{ flex: 1, overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.6 }}>
                    {(activeTerminal?.history ?? []).map((line, i) => (
                      <div key={i} style={{
                        color: line.startsWith('$')
                          ? '#4ade80'
                          : /error|traceback|fail|not found/i.test(line)
                            ? '#f87171'
                            : line.startsWith('  ') || line.startsWith('\t')
                              ? '#94a3b8'
                              : '#cbd5e1',
                        padding: '0 2px',
                      }}>{line}</div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 6, marginTop: 4, borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
                    <span style={{ color: '#4ade80', fontFamily: 'var(--font-mono)', fontSize: 12, flexShrink: 0, letterSpacing: '-0.02em' }}>~/lab $</span>
                    <input value={activeTerminal?.input ?? ''} onChange={e => updateActiveTerminal(t => ({ ...t, input: e.target.value, cmdHistoryIdx: -1 }))}
                      onKeyDown={e => {
                        const session = activeTerminal;
                        if (!session) return;
                        if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          const ni = Math.min(session.cmdHistoryIdx + 1, session.cmdHistory.length - 1);
                          updateActiveTerminal(t => ({ ...t, cmdHistoryIdx: ni, input: t.cmdHistory[ni] ?? t.input }));
                          return;
                        }
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          const ni = Math.max(session.cmdHistoryIdx - 1, -1);
                          updateActiveTerminal(t => ({ ...t, cmdHistoryIdx: ni, input: ni < 0 ? '' : (t.cmdHistory[ni] ?? '') }));
                          return;
                        }
                        if (e.key !== 'Enter' || !session.input.trim()) return;
                        const cmd = session.input.trim();
                        updateActiveTerminal(t => ({
                          ...t,
                          cmdHistory: [cmd, ...t.cmdHistory.filter(c => c !== cmd)].slice(0, 100),
                          cmdHistoryIdx: -1,
                          input: '',
                        }));
                        const add = (lines: string[]) => updateActiveTerminal(t => ({ ...t, history: [...t.history, `$ ${cmd}`, ...lines] }));
                        const t = cmd.toLowerCase();
                        const argv = cmd.split(/\s+/);

                        if (t.startsWith('ai ')) {
                          const prompt = cmd.slice(3).trim();
                          if (!prompt) {
                            add(["Usage: ai <your prompt>"]);
                            return;
                          }
                          add(['AI is thinking…']);
                          void (async () => {
                            try {
                              const res = await fetch('/api/ai/chat', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  messages: [
                                    { role: 'system', content: `You are a terminal coding assistant for ${language}. Keep replies concise.` },
                                    { role: 'user', content: prompt },
                                  ],
                                }),
                              });
                              const data = await res.json();
                              const reply = (data.reply ?? data.message ?? data.content ?? '').toString().trim() || 'No response.';
                              updateActiveTerminal(x => ({ ...x, history: [...x.history, `AI> ${reply}`] }));
                            } catch (err) {
                              updateActiveTerminal(x => ({ ...x, history: [...x.history, `AI> Error: ${err instanceof Error ? err.message : String(err)}`] }));
                            }
                          })();
                          return;
                        }

                        if (t === 'clear' || t === 'cls') { updateActiveTerminal(x => ({ ...x, history: [] })); }
                        else if (t === 'help') { add(['Commands: ls  dir  pwd  cat <f>  echo <txt>  touch <f>  rm <f>  cp <a> <b>', '          python --version  node -v  npm -v  pip --version  git --version', '          git status  git log  git add .  pip list  pip install <pkg>', '          npm list  node -e \"code\"  run  env  date  whoami  history  clear']); }
                        else if (t === 'ls' || t === 'dir') { add([files.length ? files.map(f => (f.name + (LANGUAGES.find(l => l.id === f.language)?.ext ?? ''))).join('   ') : '(empty workspace)']); }
                        else if (t === 'pwd') { add(['/workspace/coding-lab']); }
                        else if (t === 'whoami') { add(['student@eduvision-x']); }
                        else if (t === 'date') { add([new Date().toString()]); }
                        else if (t === 'env') { add([`LANG=${language}`, 'NODE_ENV=development', 'TERM=xterm-256color', 'HOME=/workspace', 'USER=student']); }
                        else if (t === 'history') { add((session.history ?? []).filter(l => l.startsWith('$')).map((l, i) => `  ${String(i + 1).padStart(3)}  ${l.slice(2)}`).slice(-20)); }
                        else if (t === 'python --version' || t === 'python3 --version' || t === 'python -v') { add(['Use the editor Run button for real remote execution runtime details.']); }
                        else if (t === 'node --version' || t === 'node -v') { add(['Use the editor Run button for real remote execution runtime details.']); }
                        else if (t === 'npm --version' || t === 'npm -v') { add(['Package-manager shell is not available in this embedded terminal.']); }
                        else if (t === 'pip --version') { add(['Package-manager shell is not available in this embedded terminal.']); }
                        else if (t === 'git --version') { add(['Git CLI is not mounted in this embedded terminal.']); }
                        else if (t === 'git status') { add(['On branch main', 'Changes not staged for commit:', ...files.filter(f => f.modified).map(f => `  modified:   ${f.name}${LANGUAGES.find(l => l.id === f.language)?.ext ?? ''}`), files.filter(f => f.modified).length === 0 ? 'nothing to commit, working tree clean' : '']); }
                        else if (t === 'git log' || t === 'git log --oneline') { add(['Git history is unavailable in the embedded terminal.']); }
                        else if (t === 'git add .' || t.startsWith('git add ')) { add(['Git staging is not available in this embedded terminal.']); }
                        else if (t.startsWith('git commit')) { add(['Git commit is not available in this embedded terminal.']); }
                        else if (t.startsWith('git branch')) { add(['Git branch listing is unavailable in this embedded terminal.']); }
                        else if (t.startsWith('git diff')) { add(['Git diff is unavailable in this embedded terminal.']); }
                        else if (t === 'pip list') { add(['Package listing is unavailable in this embedded terminal.']); }
                        else if (t.startsWith('pip install ')) { add(['Package installation is unavailable in this embedded terminal.']); }
                        else if (t === 'npm list') { add(['Package listing is unavailable in this embedded terminal.']); }
                        else if (t.startsWith('node -e ') || t.startsWith('node -p ')) { add([`(eval) ${cmd.slice(8)}`]); }
                        else if (t.startsWith('echo ')) { add([cmd.slice(5).replace(/^["']|["']$/g, '')]); }
                        else if (t.startsWith('cat ')) {
                          const fname = argv[1];
                          const fl = files.find(f => f.name === fname || f.name + (LANGUAGES.find(l => l.id === f.language)?.ext ?? '') === fname);
                          if (fl) add(fl.content.split('\n').slice(0, 50));
                          else add([`cat: ${fname}: No such file or directory`]);
                        } else if (t.startsWith('touch ')) {
                          const fname = argv[1];
                          const ext = fname.split('.').pop()?.toLowerCase() ?? '';
                          const lang = (EXT_TO_LANG[ext] ?? language) as string;
                          const base = fname.replace(/\.[^.]+$/, '');
                          setFiles(prev => prev.some(f => f.name === base) ? prev : [...prev, { name: base, content: '', language: lang, active: false, modified: false }]);
                          add([`Created ${fname}`]);
                        } else if (t.startsWith('rm ')) {
                          const fname = argv[1];
                          const before = files.length;
                          setFiles(prev => before > 1 ? prev.filter(f => f.name !== fname && f.name + (LANGUAGES.find(l => l.id === f.language)?.ext ?? '') !== fname) : prev);
                          add([before > 1 ? `Removed ${fname}` : `rm: cannot remove: only one file remaining`]);
                        } else if (t.startsWith('cp ')) {
                          const src = argv[1], dst = argv[2];
                          const fl = files.find(f => f.name === src);
                          if (fl && dst) { setFiles(prev => [...prev, { ...fl, name: dst.replace(/\.[^.]+$/, ''), active: false }]); add([`${src} -> ${dst}`]); }
                          else add([`cp: ${src}: No such file`]);
                        } else if (t === 'run') {
                          add(['Executing current file on remote compiler…']);
                          runCode();
                        } else {
                          // Unknown command
                          const maybeTypo = ['python', 'node', 'npm', 'git', 'pip', 'ls', 'cat', 'echo', 'help'].find(c => c.startsWith(t[0]) && t !== c);
                          add([`${argv[0]}: command not found${maybeTypo ? ` (did you mean '${maybeTypo}'?)` : " (try 'help')"}`]);
                        }
                      }}
                      style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#e2e8f0', fontFamily: 'var(--font-mono)', fontSize: 12 }}
                      autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                      placeholder="Type a command… (↑↓ history · type 'help')" />
                  </div>
                </div>
              )}

              {activeTab === 'api' && (
                <div style={{ color: '#c9d1d9', fontSize: 11 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                    <select value={apiMethod} onChange={e => setApiMethod(e.target.value)} style={{ width: 80, fontSize: 11, padding: '4px', background: '#0d1117', color: '#e6edf3', border: '1px solid #21262d', borderRadius: 6, outline: 'none' }}>
                      <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option><option>PATCH</option>
                    </select>
                    <input value={apiUrl} onChange={e => setApiUrl(e.target.value)} placeholder="https://api.example.com" style={{ flex: 1, fontSize: 11, padding: '4px 8px', background: '#0d1117', color: '#e6edf3', border: '1px solid #21262d', borderRadius: 6, outline: 'none' }} />
                    <button onClick={sendApiRequest} disabled={apiLoading} style={{ fontSize: 10, padding: '4px 12px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', opacity: apiLoading ? 0.6 : 1 }}>{apiLoading ? '...' : 'Send'}</button>
                  </div>
                  {apiStatus !== null && (
                    <div style={{ fontSize: 10, marginBottom: 4, display: 'flex', gap: 10 }}>
                      <span style={{ color: apiStatus < 300 ? '#22c55e' : apiStatus < 400 ? '#eab308' : '#ef4444', fontWeight: 700 }}>HTTP {apiStatus}</span>
                      <span style={{ color: '#8b949e' }}>{apiTime}</span>
                    </div>
                  )}
                  {apiMethod !== 'GET' && (
                    <textarea rows={3} value={apiBody} onChange={e => setApiBody(e.target.value)} placeholder='{"key":"value"}'
                      style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 11, marginBottom: 8, padding: '6px 8px', background: '#0d1117', color: '#e6edf3', border: '1px solid #21262d', borderRadius: 6, outline: 'none', resize: 'none' }} />
                  )}
                  {apiResponse && <pre style={{ margin: 0, whiteSpace: 'pre-wrap', padding: 8, background: '#161b22', borderRadius: 4 }}>{apiResponse}</pre>}
                </div>
              )}

              {activeTab === 'algo-viz' && (
                <div style={{ color: '#c9d1d9', fontSize: 11 }}>
                  {!isAlgoVizEnabled && (
                    <div style={{ marginBottom: 10, padding: 8, background: 'rgba(139,92,246,0.12)', border: '1px solid #8b5cf6', borderRadius: 6, color: '#c9d1d9' }}>
                      Algo Viz is available for data-structure/algorithm code (sorting, search, tree, graph, stack, queue, etc.).
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontWeight: 600, color: '#8b5cf6' }}>Algorithm Visualizer — Bubble Sort</span>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <span style={{ fontSize: 10, color: '#8b949e' }}>Speed:</span>
                      <input type="range" min={50} max={500} value={algoSpeed} onChange={e => setAlgoSpeed(Number(e.target.value))} style={{ width: 80 }} />
                      <button onClick={runAlgoViz} disabled={algoRunning || !isAlgoVizEnabled} style={{ fontSize: 10, padding: '3px 8px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 6, cursor: algoRunning || !isAlgoVizEnabled ? 'not-allowed' : 'pointer', opacity: algoRunning || !isAlgoVizEnabled ? 0.55 : 1 }}>{algoRunning ? 'Running…' : '▶ Sort'}</button>
                      <button onClick={() => setAlgoArray([64, 34, 25, 12, 22, 11, 90, 45, 78, 33])} style={{ fontSize: 10, padding: '3px 8px', background: '#161b22', color: '#c9d1d9', border: '1px solid #21262d', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg> Reset</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120, padding: '0 10px' }}>
                    {algoArray.map((v, i) => (
                      <motion.div key={i} layout style={{
                        flex: 1, height: `${(v / 100) * 100}%`,
                        background: algoHighlight.includes(i) ? '#8b5cf6' : '#38bdf8',
                        borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                        paddingBottom: 2, fontSize: 9, color: '#fff', fontWeight: 600, transition: 'background 0.15s',
                      }}>{v}</motion.div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 10, color: '#8b949e' }}>O(n²) | ~{Math.floor(algoArray.length * (algoArray.length - 1) / 2)} comparisons</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Assistant Panel — Premium UI */}
        <AnimatePresence>
          {showAI && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              style={{
                background: 'linear-gradient(180deg, #13111c 0%, #0f0d1a 100%)',
                borderLeft: '1px solid rgba(139,92,246,0.25)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0,
              }}
            >
              {/* Header */}
              <div style={{
                padding: '14px 16px', flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.08) 100%)',
                borderBottom: '1px solid rgba(139,92,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 12px rgba(139,92,246,0.4)',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v0a1 1 0 01-1 1h-1v1a7 7 0 01-7 7h-1v.27c.6.34 1 .99 1 1.73a2 2 0 01-4 0c0-.74.4-1.39 1-1.73V24h-1a7 7 0 01-7-7H2a1 1 0 010-2h1a7 7 0 017-7h1V5.73C10.4 5.39 10 4.74 10 4a2 2 0 012-2z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#e6edf3', letterSpacing: '-0.02em' }}>AI Assistant</div>
                    <div style={{ fontSize: 10, color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                      {LANGUAGES.find(l => l.id === language)?.label} context
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button
                    onClick={() => setAiMessages([])}
                    title="Clear chat"
                    style={{ padding: '4px 8px', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 6, background: 'transparent', color: '#8b949e', cursor: 'pointer', fontSize: 10 }}
                  >Clear</button>
                  <button onClick={() => setShowAI(false)} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '2px 4px' }}>×</button>
                </div>
              </div>

              {/* Messages */}
              <div ref={aiScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 10px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {aiMessages.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 8px', color: '#8b949e' }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.1))',
                      border: '1px solid rgba(139,92,246,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 14px',
                    }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.5">
                        <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v0a1 1 0 01-1 1h-1v1a7 7 0 01-7 7h-1v.27c.6.34 1 .99 1 1.73a2 2 0 01-4 0c0-.74.4-1.39 1-1.73V24h-1a7 7 0 01-7-7H2a1 1 0 010-2h1a7 7 0 017-7h1V5.73C10.4 5.39 10 4.74 10 4a2 2 0 012-2z" />
                      </svg>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#c9d1d9', marginBottom: 6 }}>Ask me anything</div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 14, lineHeight: 1.5 }}>I can explain, fix, optimize, or rewrite your code. Use the Apply button to insert code directly.</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {[
                        'Explain this code',
                        'Fix the bug',
                        'Optimize it',
                        'Generate unit tests',
                        'Add error handling',
                        'Rewrite with comments',
                      ].map((s, i) => (
                        <button key={i} onClick={() => { setAiInput(s); setTimeout(() => sendAiMessage(), 10); }}
                          style={{
                            padding: '5px 10px', fontSize: 10, borderRadius: 999,
                            border: '1px solid rgba(139,92,246,0.25)',
                            background: 'rgba(139,92,246,0.08)', color: '#a78bfa', cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.2)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'; }}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                )}

                {aiMessages.map((m, i) => {
                  const isUser = m.role === 'user';
                  // Split text on code blocks for rendering
                  const parts = m.text.split(/(```(?:\w+)?\n[\s\S]*?```)/g);
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', gap: 4 }}>
                      {!isUser && (
                        <div style={{ fontSize: 10, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
                          <span style={{ width: 14, height: 14, borderRadius: 4, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="8" height="8" viewBox="0 0 10 10" fill="white"><circle cx="5" cy="5" r="3" /></svg>
                          </span>
                          AI
                        </div>
                      )}
                      <div style={{
                        maxWidth: '92%',
                        background: isUser
                          ? 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.15))'
                          : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isUser ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.07)'}`,
                        borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                        padding: '10px 13px',
                        fontSize: 12, color: '#e2e8f0', lineHeight: 1.65,
                      }}>
                        {parts.map((part, pi) => {
                          const codeMatch = part.match(/```(\w+)?\n([\s\S]*?)```/);
                          if (codeMatch) {
                            const codeContent = codeMatch[2];
                            return (
                              <div key={pi} style={{ margin: '8px 0' }}>
                                <div style={{
                                  background: '#0d1117',
                                  border: applyFlashIdx === i * 1000 + pi ? '1px solid #22c55e' : '1px solid rgba(139,92,246,0.2)',
                                  borderRadius: 8, overflow: 'hidden',
                                  transition: 'border-color 0.3s',
                                  boxShadow: applyFlashIdx === i * 1000 + pi ? '0 0 16px rgba(34,197,94,0.3)' : 'none',
                                }}>
                                  <div style={{
                                    padding: '6px 10px', background: applyFlashIdx === i * 1000 + pi ? 'rgba(34,197,94,0.1)' : 'rgba(139,92,246,0.1)',
                                    borderBottom: `1px solid ${applyFlashIdx === i * 1000 + pi ? 'rgba(34,197,94,0.2)' : 'rgba(139,92,246,0.15)'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    transition: 'background 0.3s',
                                  }}>
                                    <span style={{ fontSize: 9, color: applyFlashIdx === i * 1000 + pi ? '#22c55e' : '#8b949e', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 4, transition: 'color 0.3s' }}>
                                      {applyFlashIdx === i * 1000 + pi && '✓ Applied — '}
                                      {codeMatch[1] || language}
                                    </span>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                      <button
                                        onClick={() => navigator.clipboard?.writeText(codeContent)}
                                        style={{ fontSize: 9, padding: '2px 6px', border: '1px solid #21262d', borderRadius: 4, background: 'transparent', color: '#8b949e', cursor: 'pointer' }}
                                      >Copy</button>
                                      <button
                                        onClick={() => {
                                          proposeDiff(codeContent);
                                          // Flash animation
                                          const flashKey = i * 1000 + pi;
                                          setApplyFlashIdx(flashKey);
                                          setTimeout(() => setApplyFlashIdx(prev => prev === flashKey ? null : prev), 1500);
                                        }}
                                        style={{
                                          fontSize: 9, padding: '2px 8px',
                                          border: 'none', borderRadius: 4, cursor: 'pointer',
                                          background: applyFlashIdx === i * 1000 + pi
                                            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                                            : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                          color: '#fff', fontWeight: 700, letterSpacing: '0.02em',
                                          boxShadow: applyFlashIdx === i * 1000 + pi ? '0 0 10px rgba(34,197,94,0.5)' : '0 0 8px rgba(139,92,246,0.4)',
                                          transition: 'all 0.3s',
                                          transform: applyFlashIdx === i * 1000 + pi ? 'scale(1.05)' : 'scale(1)',
                                        }}
                                      >{applyFlashIdx === i * 1000 + pi ? '✓ Reviewing!' : '👁 Review Changes'}</button>
                                    </div>
                                  </div>
                                  <pre style={{
                                    margin: 0, padding: '10px 12px',
                                    fontFamily: 'var(--font-mono)', fontSize: 11,
                                    color: '#e6edf3', overflowX: 'auto', overflowY: 'auto', whiteSpace: 'pre',
                                    lineHeight: 1.6, maxHeight: 240,
                                  }}>{codeContent}</pre>
                                </div>
                              </div>
                            );
                          }
                          // Not a code block — render inline markdown
                          const renderMarkdown = (text: string): React.ReactNode[] => {
                            const lines = text.split('\n');
                            return lines.map((line, li) => {
                              // Heading
                              const h2 = line.match(/^##\s+(.+)/);
                              if (h2) return <div key={li} style={{ fontWeight: 800, fontSize: 13, color: '#e6edf3', marginTop: 6, marginBottom: 2 }}>{h2[1]}</div>;
                              const h3 = line.match(/^###\s+(.+)/);
                              if (h3) return <div key={li} style={{ fontWeight: 700, fontSize: 12, color: '#c9d1d9', marginTop: 4, marginBottom: 1 }}>{h3[1]}</div>;
                              // Bullet list
                              const bullet = line.match(/^[-*]\s+(.+)/);
                              if (bullet) return (
                                <div key={li} style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
                                  <span style={{ color: '#a78bfa', flexShrink: 0 }}>•</span>
                                  <span>{renderInline(bullet[1])}</span>
                                </div>
                              );
                              // Numbered list
                              const numbered = line.match(/^(\d+)\.\s+(.+)/);
                              if (numbered) return (
                                <div key={li} style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
                                  <span style={{ color: '#a78bfa', flexShrink: 0, minWidth: 16 }}>{numbered[1]}.</span>
                                  <span>{renderInline(numbered[2])}</span>
                                </div>
                              );
                              // Empty line → spacing
                              if (!line.trim()) return <div key={li} style={{ height: 6 }} />;
                              // Normal line with inline formatting
                              return <div key={li}>{renderInline(line)}</div>;
                            });
                          };
                          const renderInline = (text: string): React.ReactNode => {
                            // Split on bold **text**, italic _text_, inline `code`
                            const parts2: React.ReactNode[] = [];
                            const rx = /(`[^`]+`|\*\*[^*]+\*\*|_[^_]+_)/g;
                            let last = 0, m2: RegExpExecArray | null;
                            while ((m2 = rx.exec(text)) !== null) {
                              if (m2.index > last) parts2.push(text.slice(last, m2.index));
                              const tok = m2[0];
                              if (tok.startsWith('`')) {
                                parts2.push(<code key={m2.index} style={{ background: 'rgba(139,92,246,0.15)', color: '#c9d1d9', borderRadius: 3, padding: '1px 5px', fontSize: 10.5, fontFamily: 'var(--font-mono)' }}>{tok.slice(1, -1)}</code>);
                              } else if (tok.startsWith('**')) {
                                parts2.push(<strong key={m2.index} style={{ color: '#e6edf3', fontWeight: 700 }}>{tok.slice(2, -2)}</strong>);
                              } else {
                                parts2.push(<em key={m2.index} style={{ color: '#c9d1d9', fontStyle: 'italic' }}>{tok.slice(1, -1)}</em>);
                              }
                              last = m2.index + tok.length;
                            }
                            if (last < text.length) parts2.push(text.slice(last));
                            return <>{parts2}</>;
                          };
                          return <div key={pi} style={{ fontSize: 12, lineHeight: 1.7 }}>{renderMarkdown(part)}</div>;

                        })}
                      </div>
                    </div>
                  );
                })}

                {aiLoading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="white"><circle cx="5" cy="5" r="3" /></svg>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px 16px 16px 16px', padding: '10px 14px', display: 'flex', gap: 5, alignItems: 'center' }}>
                      {[0, 1, 2].map(d => (
                        <motion.div
                          key={d}
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.2 }}
                          style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6' }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ─── Quick action chips ─ GitHub Copilot style ─── */}
              <div style={{ padding: '6px 14px 0', display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {[
                  { label: '✨ Explain', prompt: 'Explain this code step by step.' },
                  { label: '🔧 Fix Error', prompt: `Fix the error in my code. Recent output:\n${output.slice(0, 400)}` },
                  { label: '♻️ Refactor', prompt: 'Refactor this code for clarity and performance. Show me the improved version.' },
                  { label: '🧪 Add Tests', prompt: 'Write unit tests for this code.' },
                  { label: '💡 Optimize', prompt: 'Optimize this code for performance. Explain the improvements.' },
                ].map(chip => (
                  <button
                    key={chip.label}
                    onClick={() => sendAiMessage(chip.prompt)}
                    style={{
                      padding: '3px 9px', borderRadius: 999, fontSize: 10, cursor: 'pointer',
                      border: '1px solid rgba(139,92,246,0.25)', background: 'rgba(139,92,246,0.07)',
                      color: '#a78bfa', fontWeight: 500, transition: 'all 0.15s', whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.18)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(139,92,246,0.5)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.07)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(139,92,246,0.25)'; }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Attached files chips */}
              {aiAttachedFiles.length > 0 && (
                <div style={{ padding: '6px 14px 0', display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {aiAttachedFiles.map((f, idx) => (
                    <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', fontSize: 10, borderRadius: 999, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa' }}>
                      📎 {f}
                      <button onClick={() => setAiAttachedFiles(prev => prev.filter(x => x !== f))} style={{ border: 'none', background: 'transparent', color: '#8b949e', cursor: 'pointer', fontSize: 10, lineHeight: 1, padding: 0 }}>×</button>
                    </span>
                  ))}
                </div>
              )}

              {/* Input area */}
              <div style={{ padding: '10px 14px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, position: 'relative' }}>
                {/* Attach dropdown */}
                {aiAttachOpen && (
                  <div style={{ position: 'absolute', bottom: 70, left: 14, width: 220, maxHeight: 200, overflowY: 'auto', background: '#1c1b2e', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 10, padding: 6, zIndex: 40, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                    <div style={{ fontSize: 10, color: '#6b7280', padding: '4px 6px 6px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 4 }}>Attach file to context</div>
                    {files.map((f, i) => {
                      const full = `${f.name}${LANGUAGES.find(l => l.id === f.language)?.ext ?? ''}`;
                      return (
                        <button key={i}
                          onClick={() => { setAiAttachedFiles(prev => prev.includes(full) ? prev.filter(x => x !== full) : [...prev, full]); }}
                          style={{ width: '100%', textAlign: 'left', padding: '6px 8px', border: 'none', background: aiAttachedFiles.includes(full) ? 'rgba(139,92,246,0.15)' : 'transparent', color: aiAttachedFiles.includes(full) ? '#a78bfa' : '#c9d1d9', borderRadius: 6, cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          {aiAttachedFiles.includes(full) ? '✓ ' : '  '}{full}
                        </button>
                      );
                    })}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setAiAttachOpen(v => !v)}
                    title="Attach file"
                    style={{
                      width: 34, height: 34, border: '1px solid rgba(139,92,246,0.2)', background: aiAttachOpen ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                      color: '#a78bfa', borderRadius: 8, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >📎</button>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <textarea
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAiMessage(); }
                      }}
                      placeholder="Ask about your code… (Enter to send, Shift+Enter for new line)"
                      rows={2}
                      style={{
                        width: '100%', padding: '8px 12px', fontSize: 12,
                        background: 'rgba(255,255,255,0.04)',
                        color: '#e6edf3',
                        border: '1px solid rgba(139,92,246,0.2)',
                        borderRadius: 10, outline: 'none', resize: 'none',
                        fontFamily: 'inherit', lineHeight: 1.4,
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <button
                    onClick={() => sendAiMessage()}
                    disabled={aiLoading || !aiInput.trim()}
                    style={{
                      width: 34, height: 34, fontSize: 16, alignSelf: 'flex-end',
                      background: aiLoading || !aiInput.trim()
                        ? 'rgba(139,92,246,0.2)'
                        : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                      color: '#fff', border: 'none', borderRadius: 8, cursor: aiLoading || !aiInput.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      boxShadow: aiLoading || !aiInput.trim() ? 'none' : '0 0 12px rgba(139,92,246,0.4)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Old input modal removed — now using inline interactive terminal in output panel */}

      {/* ═══ VS Code-style Status Bar ═══ */}
      <div style={{
        height: 22, display: 'flex', alignItems: 'center', gap: 0,
        background: '#8b5cf6', color: 'rgba(255,255,255,0.92)', fontSize: 11,
        flexShrink: 0, userSelect: 'none', letterSpacing: '0.01em',
      }}>
        {/* Left section */}
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 12px', height: '100%', background: 'rgba(0,0,0,0.2)', cursor: 'pointer' }}
            title="Git branch">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="12" cy="18" r="2" /><path d="M8 6h6M6 8v8a2 2 0 002 2h.5M18 8v6a2 2 0 01-2 2h-.5" /></svg>
            <span>main</span>
          </div>
          {lintIssues.filter(l => l.severity === 'error').length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 10px', height: '100%', cursor: 'pointer' }} title="Errors">
              <span style={{ color: '#fca5a5' }}>✗</span>
              <span style={{ color: '#fca5a5' }}>{lintIssues.filter(l => l.severity === 'error').length}</span>
            </div>
          )}
          {lintIssues.filter(l => l.severity === 'warning').length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 10px', height: '100%', cursor: 'pointer' }} title="Warnings">
              <span style={{ color: '#fef08a' }}>⚠</span>
              <span style={{ color: '#fef08a' }}>{lintIssues.filter(l => l.severity === 'warning').length}</span>
            </div>
          )}
        </div>
        <div style={{ flex: 1 }} />
        {/* Right section */}
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <div style={{ padding: '0 12px', height: '100%', display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }} title="Select language">
            <span style={{ fontWeight: 600 }}>{LANGUAGES.find(l => l.id === language)?.label}</span>
            <span style={{ opacity: 0.65 }}>{LANGUAGES.find(l => l.id === language)?.version}</span>
          </div>
          <div style={{ padding: '0 10px', height: '100%', display: 'flex', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.15)' }}>UTF-8</div>
          <div style={{ padding: '0 10px', height: '100%', display: 'flex', alignItems: 'center', gap: 6, borderLeft: '1px solid rgba(255,255,255,0.15)' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <span>Ln {code.split('\n').length}</span>
          </div>
          <div style={{ padding: '0 10px', height: '100%', display: 'flex', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.15)' }}>
            {running ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#a5f3fc' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" opacity="0.3" /><path d="M12 6v6l4 2" /></svg>
                Running…
              </span>
            ) : debugLoading ? (
              <span style={{ color: '#fde68a' }}>⚙ Debugging…</span>
            ) : (
              <span style={{ color: '#86efac' }}>● Ready</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
