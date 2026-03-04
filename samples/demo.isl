{
  "meta": {
    "title": "Introduction to Computer Science",
    "author": "Prof. EduSlide",
    "createdAt": "2026-03-01T00:00:00.000Z",
    "updatedAt": "2026-03-01T00:00:00.000Z",
    "version": "1.0",
    "theme": "default",
    "aspectRatio": "16:9"
  },
  "slides": [
    {
      "id": "s_demo_001",
      "order": 0,
      "layout": "title",
      "background": { "type": "gradient", "value": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
      "elements": [
        {
          "id": "el_d1", "type": "heading", "content": "Introduction to Computer Science",
          "x": 60, "y": 160, "width": 840, "height": 60, "level": 1,
          "style": { "fontSize": "42px", "fontWeight": "bold", "color": "#ffffff", "textAlign": "center" },
          "opacity": 1, "rotation": 0
        },
        {
          "id": "el_d2", "type": "text", "content": "A Journey Through the Foundations of Computing",
          "x": 60, "y": 240, "width": 840, "height": 40,
          "style": { "fontSize": "22px", "color": "#e0d0ff", "textAlign": "center" },
          "opacity": 1, "rotation": 0
        },
        {
          "id": "el_d3", "type": "text", "content": "Prof. EduSlide — Spring 2026",
          "x": 60, "y": 420, "width": 840, "height": 30,
          "style": { "fontSize": "16px", "color": "#c0b0e0", "textAlign": "center" },
          "opacity": 1, "rotation": 0
        }
      ],
      "notes": "Welcome the class. Introduce the course objectives and what students will learn.",
      "transition": "fade"
    },
    {
      "id": "s_demo_002",
      "order": 1,
      "layout": "content",
      "background": { "type": "solid", "value": "#ffffff" },
      "elements": [
        {
          "id": "el_d4", "type": "heading", "content": "What is Computer Science?",
          "x": 60, "y": 30, "width": 840, "height": 60, "level": 1,
          "style": { "fontSize": "36px", "fontWeight": "bold", "color": "#1a1a2e" },
          "opacity": 1
        },
        {
          "id": "el_d5", "type": "list",
          "items": [
            "The study of computation, algorithms, and information",
            "Not just programming — it's a way of thinking",
            "Covers theory, systems, applications, and AI",
            "Impacts every field: medicine, finance, art, science"
          ],
          "x": 60, "y": 110, "width": 840, "height": 200,
          "style": { "fontSize": "20px", "color": "#444" },
          "opacity": 1
        },
        {
          "id": "el_d6", "type": "note", "content": "Computer Science is more about problem-solving than typing code!",
          "x": 60, "y": 360, "width": 840, "height": 50,
          "opacity": 1
        }
      ],
      "notes": "Emphasize that CS is not just about coding. It's about computational thinking.",
      "transition": "slide"
    },
    {
      "id": "s_demo_003",
      "order": 2,
      "layout": "code-demo",
      "background": { "type": "solid", "value": "#ffffff" },
      "elements": [
        {
          "id": "el_d7", "type": "heading", "content": "Your First Algorithm",
          "x": 60, "y": 20, "width": 840, "height": 50, "level": 1,
          "style": { "fontSize": "32px", "fontWeight": "bold", "color": "#1a1a2e" },
          "opacity": 1
        },
        {
          "id": "el_d8", "type": "text", "content": "Let's write a function to check if a number is prime:",
          "x": 60, "y": 70, "width": 840, "height": 30,
          "style": { "fontSize": "18px", "color": "#666" },
          "opacity": 1
        },
        {
          "id": "el_d9", "type": "code",
          "content": "function isPrime(n) {\n  if (n < 2) return false;\n  for (let i = 2; i <= Math.sqrt(n); i++) {\n    if (n % i === 0) return false;\n  }\n  return true;\n}\n\n// Test it out!\nfor (let i = 1; i <= 20; i++) {\n  if (isPrime(i)) console.log(i + \" is prime!\");\n}",
          "language": "javascript",
          "executable": true,
          "x": 60, "y": 110, "width": 840, "height": 280,
          "style": { "fontSize": "14px" },
          "opacity": 1
        }
      ],
      "notes": "Walk through the algorithm step by step. Have students modify the code to test different numbers.",
      "transition": "fade"
    },
    {
      "id": "s_demo_004",
      "order": 3,
      "layout": "content",
      "background": { "type": "solid", "value": "#ffffff" },
      "elements": [
        {
          "id": "el_d10", "type": "heading", "content": "Algorithm Complexity",
          "x": 60, "y": 20, "width": 840, "height": 50, "level": 1,
          "style": { "fontSize": "32px", "fontWeight": "bold", "color": "#1a1a2e" },
          "opacity": 1
        },
        {
          "id": "el_d11", "type": "math", "content": "O(n) \\subset O(n \\log n) \\subset O(n^2) \\subset O(2^n)",
          "x": 60, "y": 90, "width": 840, "height": 60,
          "style": { "fontSize": "28px", "color": "#2d3436" },
          "opacity": 1
        },
        {
          "id": "el_d12", "type": "chart",
          "chartType": "bar",
          "data": {
            "labels": ["O(1)", "O(log n)", "O(n)", "O(n²)", "O(2ⁿ)"],
            "values": [1, 7, 100, 10000, 100000]
          },
          "x": 60, "y": 170, "width": 500, "height": 280,
          "opacity": 1
        },
        {
          "id": "el_d13", "type": "text", "content": "Choosing the right algorithm can mean seconds vs. years!",
          "x": 580, "y": 320, "width": 340, "height": 50,
          "style": { "fontSize": "18px", "color": "#e17055", "fontWeight": "600" },
          "opacity": 1
        }
      ],
      "notes": "Explain Big-O notation. Use the chart to show how dramatically different complexities scale.",
      "transition": "zoom"
    },
    {
      "id": "s_demo_005",
      "order": 4,
      "layout": "content",
      "background": { "type": "solid", "value": "#ffffff" },
      "elements": [
        {
          "id": "el_d14", "type": "heading", "content": "Data Structures",
          "x": 60, "y": 20, "width": 840, "height": 50, "level": 1,
          "style": { "fontSize": "32px", "fontWeight": "bold", "color": "#1a1a2e" },
          "opacity": 1
        },
        {
          "id": "el_d15", "type": "code",
          "content": "// Stack — Last In, First Out (LIFO)\nclass Stack {\n  constructor() { this.items = []; }\n  push(item) { this.items.push(item); }\n  pop() { return this.items.pop(); }\n  peek() { return this.items[this.items.length - 1]; }\n  isEmpty() { return this.items.length === 0; }\n}\n\nconst stack = new Stack();\nstack.push('A');\nstack.push('B');\nstack.push('C');\nconsole.log('Pop:', stack.pop()); // C\nconsole.log('Peek:', stack.peek()); // B",
          "language": "javascript",
          "executable": true,
          "x": 60, "y": 80, "width": 840, "height": 300,
          "opacity": 1
        },
        {
          "id": "el_d16", "type": "note", "content": "Try modifying the code to implement a Queue (FIFO) instead!",
          "x": 60, "y": 400, "width": 840, "height": 50,
          "opacity": 1
        }
      ],
      "notes": "Live-code the Stack. Challenge students to modify it to a Queue.",
      "transition": "slide"
    },
    {
      "id": "s_demo_006",
      "order": 5,
      "layout": "quiz",
      "background": { "type": "solid", "value": "#ffffff" },
      "elements": [
        {
          "id": "el_d17", "type": "heading", "content": "Quick Check! 🧠",
          "x": 60, "y": 20, "width": 840, "height": 50, "level": 1,
          "style": { "fontSize": "32px", "fontWeight": "bold", "color": "#1a1a2e" },
          "opacity": 1
        },
        {
          "id": "el_d18", "type": "quiz",
          "question": "What is the time complexity of searching in an unsorted array?",
          "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          "correct": 2,
          "x": 60, "y": 90, "width": 840, "height": 180,
          "opacity": 1
        },
        {
          "id": "el_d19", "type": "quiz",
          "question": "Which data structure uses LIFO (Last In, First Out)?",
          "options": ["Queue", "Stack", "Array", "Linked List"],
          "correct": 1,
          "x": 60, "y": 290, "width": 840, "height": 180,
          "opacity": 1
        }
      ],
      "notes": "Give students time to answer. Discuss why each answer is correct/incorrect.",
      "transition": "fade"
    },
    {
      "id": "s_demo_007",
      "order": 6,
      "layout": "content",
      "background": { "type": "gradient", "value": "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" },
      "elements": [
        {
          "id": "el_d20", "type": "heading", "content": "Summary & Next Steps",
          "x": 60, "y": 30, "width": 840, "height": 60, "level": 1,
          "style": { "fontSize": "36px", "fontWeight": "bold", "color": "#a29bfe" },
          "opacity": 1
        },
        {
          "id": "el_d21", "type": "list",
          "items": [
            "✅ Learned what Computer Science is",
            "✅ Wrote our first algorithm (prime checker)",
            "✅ Explored algorithm complexity (Big-O)",
            "✅ Built a Stack data structure",
            "✅ Tested our knowledge with a quiz",
            "",
            "📖 Next class: Sorting algorithms & recursion",
            "💻 Homework: Implement a Queue class"
          ],
          "x": 60, "y": 110, "width": 840, "height": 300,
          "style": { "fontSize": "20px", "color": "#e8e8f0" },
          "opacity": 1
        },
        {
          "id": "el_d22", "type": "note", "content": "Use the AI Assistant to review any concepts you're unsure about!",
          "x": 60, "y": 440, "width": 840, "height": 50,
          "opacity": 1
        }
      ],
      "notes": "Recap key points. Remind students about homework and next class topics.",
      "transition": "fade"
    }
  ],
  "settings": {
    "transition": "fade",
    "transitionDuration": 400,
    "autoPlay": false,
    "autoPlayInterval": 5000,
    "showSlideNumbers": true,
    "enableAI": true,
    "enableInteractive": true
  }
}
