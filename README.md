# EduVision-X

<div align="center">

### A World-Class Interactive Learning Platform for the AI Classroom Era

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](tsconfig.json)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production--Ready-success)](#)
[![UI/UX](https://img.shields.io/badge/UI%2FUX-Premium-blueviolet)](#ux-principles)

**Build • Teach • Simulate • Present — All in one modern platform.**

</div>

---

## Why EduVision-X?

Traditional slide tools are static. Modern classrooms are dynamic.

EduVision-X transforms passive presentations into **interactive learning experiences** through:
- AI-assisted content and coding workflows
- simulation-driven STEM learning
- real-time editing and autosave
- rich presentation + viewer modes for educators and students

---

## Product Snapshot

| Category | Highlights |
|---|---|
| Core Experience | Interactive editor, viewer, presenter mode |
| AI Layer | AI tools, content support workflows, assistant experiences |
| STEM Power | Coding Lab, simulation modules, executable content |
| Data & Persistence | Autosave, import/export, upload, template workflows |
| Platform UX | Dashboard, classroom, analytics, profile, marketplace |

---

## Key Capabilities

### 1) Interactive Authoring
- Slide editing with reusable UI primitives
- Rich content elements (charts, math, diagrams, code, media)
- Structured panel architecture for properties, layers, and AI actions

### 2) Coding & Simulation First
- Dedicated Coding Lab route for technical learning workflows
- Simulation modules for algorithmic and scientific visual learning
- Classroom-ready experiences designed for demonstration and practice

### 3) AI-Augmented Learning
- AI tools integrated into platform navigation and creation flows
- Generation, refinement, and support patterns designed for educators
- Foundation for scalable assistant-driven learning experiences

### 4) Reliable Platform Operations
- API routes for autosave/load/save/import/upload/execute flows
- Strong route separation and feature ownership
- Type-safe front-end architecture with reusable stores and hooks

---

## Technical Architecture

```text
next-app/
├─ src/
│  ├─ app/
│  │  ├─ (platform)/            # Product modules (dashboard, coding-lab, classroom...)
│  │  ├─ api/                   # Server routes (save/load/autosave/import/upload/...)
│  │  ├─ auth/                  # Login + registration
│  │  ├─ editor/                # Editor route
│  │  ├─ viewer/                # Viewer route
│  │  └─ pricing/               # Public pricing route
│  ├─ components/
│  │  ├─ Editor/                # Editor shell/tooling/canvas
│  │  ├─ Elements/              # Renderers (chart, math, code, 3D, etc.)
│  │  ├─ Panels/                # Layer/property/AI panels
│  │  ├─ Presentation/          # Present mode + presenter view
│  │  ├─ simulations/           # Simulation UI components
│  │  └─ UI/                    # Shared UI utilities/accessibility
│  ├─ hooks/                    # Custom hooks
│  ├─ lib/                      # Domain logic + helpers
│  ├─ store/                    # Global state stores
│  └─ types/                    # Shared TypeScript contracts
├─ data/                        # Autosave + local data snapshots
├─ docs/                        # Product and requirements docs
├─ samples/                     # Example files and demos
├─ public/                      # Static assets/uploads
└─ legacy-archive/              # Archived legacy root artifacts
```

---

## UX Principles

EduVision-X is built around premium UX standards:

- **Clarity first**: focused layouts and predictable interactions
- **Speed and feedback**: visible loading, error, success, and autosave states
- **Accessibility by default**: keyboard-friendly flows and semantic behavior
- **Consistency at scale**: shared component patterns across all modules
- **Learning outcomes over decoration**: interfaces optimized for pedagogy

---

## Data & Workflow Coverage

| Workflow | Supported |
|---|---|
| Create/Edit presentations | ✅ |
| Autosave + load | ✅ |
| Import/Export flows | ✅ |
| Media uploads | ✅ |
| AI-assisted experiences | ✅ |
| Coding + simulations | ✅ |
| Platform modules (dashboard/classroom/analytics) | ✅ |

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Run Locally

```bash
npm install
npm run dev
```

Open **http://localhost:3000**

### Production Build

```bash
npm run lint
npm run build
npm run start
```

---

## Deployment (Vercel)

EduVision-X is optimized for zero-config deployment on Vercel.

```bash
npx vercel
npx vercel --prod
```

---

## Project Quality Standards

- Strict TypeScript usage
- Feature-local implementation with clear ownership
- Reusable component-first architecture
- No temporary backup files in source (`*.bak`, `*.bak2`, `.tmp/`)

---

## Roadmap (High-Level)

- Advanced classroom collaboration and live participation tools
- Expanded analytics and learning insights
- More simulation templates and assessment workflows
- Enhanced AI-driven personalization

---

## Contributing

1. Fork and clone
2. Create a feature branch
3. Commit with clear scope
4. Open a pull request with screenshots and test notes

---

## Repository

GitHub: **https://github.com/abhinavsai2006/EduVision-X**

If you find this project useful, star the repository and share feedback.
