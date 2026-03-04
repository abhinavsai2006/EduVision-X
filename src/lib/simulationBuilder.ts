export type BuilderFramework = 'nextjs' | 'vite-react' | 'vanilla-ts';
export type BuilderLanguage = 'ts' | 'js';

export interface SimulationBuilderRequest {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  framework: BuilderFramework;
  language: BuilderLanguage;
  initialState: Record<string, unknown>;
  includeTheory: boolean;
  includeMetrics: boolean;
  includeControls: boolean;
  includeLogs: boolean;
  includeExport: boolean;
  includeConfigSidebar: boolean;
  includeTests: boolean;
  includeDocker: boolean;
  includeCI: boolean;
}

export interface GeneratedSimulationTemplate {
  normalizedId: string;
  files: Record<string, string>;
  integrationSnippet: string;
  runCommands: string[];
}

const toIdentifier = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\-\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/\-+/g, '-')
    .replace(/^\-+|\-+$/g, '') || 'custom-simulation';

const safeJson = (obj: Record<string, unknown>) => JSON.stringify(obj, null, 2);

const componentFile = (request: SimulationBuilderRequest, normalizedId: string) => {
  const stateType = request.language === 'ts' ? 'Record<string, unknown>' : 'any';
  const typeHint = request.language === 'ts' ? ': React.CSSProperties' : '';

  return `'use client';
import React, { useMemo, useState } from 'react';
import { SimPanel, SimTheory, SimMetricRow, SimMetric, SimButton, SimInput, SimLogViewer } from '@/components/simulations/SimulationUI';

const initialState = ${safeJson(request.initialState)};

export default function ${pascalCase(normalizedId)}Simulation() {
  const [state, setState] = useState<${stateType}>(initialState);
  const [logs, setLogs] = useState<string[]>(['Ready']);

  const runSimulation = () => {
    setLogs((prev) => [...prev, 'Simulation executed', 'State snapshot captured']);
  };

  const cardStyle${typeHint} = { display: 'grid', gap: 12 };

  return (
    <div style={cardStyle}>
      ${request.includeTheory ? `<SimTheory
        title="${escapeDoubleQuotes(request.name)}"
        description="${escapeDoubleQuotes(request.description)}"
        complexity={{ best: 'O(1)', average: 'O(n)', worst: 'O(n²)', space: 'O(n)' }}
        keyPoints={['Editable template', 'Production-ready structure', 'Add domain logic in engine.ts']}
      />` : ''}

      ${request.includeMetrics ? `<SimMetricRow cols={3}>
        <SimMetric label="Category" value="${escapeDoubleQuotes(request.category)}" icon="🏷️" />
        <SimMetric label="Difficulty" value="${request.difficulty}" icon="🎯" />
        <SimMetric label="Logs" value={logs.length} icon="📜" />
      </SimMetricRow>` : ''}

      <SimPanel title="Simulation Workspace" icon="${request.icon || '🧪'}" glass>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          ${request.includeControls ? `<SimButton onClick={runSimulation} variant="primary" icon="▶">Run</SimButton>
          <SimButton onClick={() => setState(initialState)} variant="ghost" icon="↺">Reset</SimButton>` : ''}
        </div>
      </SimPanel>

      ${request.includeLogs ? `<SimLogViewer logs={logs} maxHeight={180} />` : ''}
    </div>
  );
}
`;
};

const engineFile = (request: SimulationBuilderRequest) => `export interface SimulationStepResult {
  nextState: Record<string, unknown>;
  message: string;
}

export function runSimulationStep(state: Record<string, unknown>): SimulationStepResult {
  return {
    nextState: { ...state },
    message: '${escapeSingleQuotes(request.name)} step completed',
  };
}
`;

const readmeFile = (request: SimulationBuilderRequest, normalizedId: string) => `# ${request.name}

${request.description}

## Template Details
- ID: ${normalizedId}
- Category: ${request.category}
- Difficulty: ${request.difficulty}
- Framework: ${request.framework}
- Language: ${request.language}
- Tags: ${request.tags.join(', ') || 'none'}

## Run
- Install: npm install
- Dev: npm run dev
- Build: npm run build

## Deploy Checklist
- Configure environment variables
- Add monitoring and error boundaries
- Add analytics and logging
- Validate accessibility and responsive layout
`;

const dockerFile = () => `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
`;

const ciFile = () => `name: Simulation Template CI
on:
  push:
    branches: [main]
  pull_request:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run build
`;

const testFile = (request: SimulationBuilderRequest, normalizedId: string) => `import { describe, it, expect } from 'vitest';

describe('${escapeSingleQuotes(request.name)} template', () => {
  it('has a normalized id', () => {
    expect('${normalizedId}'.length).toBeGreaterThan(0);
  });
});
`;

export function pascalCase(value: string): string {
  return value
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function escapeSingleQuotes(value: string) {
  return value.replace(/'/g, "\\'");
}

function escapeDoubleQuotes(value: string) {
  return value.replace(/"/g, '\\"');
}

export function generateSimulationTemplate(request: SimulationBuilderRequest): GeneratedSimulationTemplate {
  const normalizedId = toIdentifier(request.id || request.name);
  const ext = request.language === 'ts' ? 'ts' : 'js';
  const componentExt = request.language === 'ts' ? 'tsx' : 'jsx';
  const baseDir = `templates/${normalizedId}`;

  const files: Record<string, string> = {
    [`${baseDir}/README.md`]: readmeFile(request, normalizedId),
    [`${baseDir}/src/simulations/${normalizedId}/index.${componentExt}`]: componentFile(request, normalizedId),
    [`${baseDir}/src/simulations/${normalizedId}/engine.${ext}`]: engineFile(request),
    [`${baseDir}/src/simulations/${normalizedId}/state.${ext}`]: `export const initialSimulationState = ${safeJson(request.initialState)};\n`,
    [`${baseDir}/src/simulations/${normalizedId}/meta.json`]: JSON.stringify({
      id: normalizedId,
      name: request.name,
      description: request.description,
      category: request.category,
      icon: request.icon,
      difficulty: request.difficulty,
      tags: request.tags,
    }, null, 2),
  };

  if (request.framework === 'nextjs') {
    files[`${baseDir}/src/app/simulations/${normalizedId}/page.${componentExt}`] = `import ${pascalCase(normalizedId)}Simulation from '@/simulations/${normalizedId}';\n\nexport default function Page() {\n  return <${pascalCase(normalizedId)}Simulation />;\n}\n`;
  }

  if (request.framework === 'vite-react') {
    files[`${baseDir}/src/main.${componentExt}`] = `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport ${pascalCase(normalizedId)}Simulation from './simulations/${normalizedId}';\n\nReactDOM.createRoot(document.getElementById('root')!).render(<${pascalCase(normalizedId)}Simulation />);\n`;
  }

  if (request.includeDocker) {
    files[`${baseDir}/Dockerfile`] = dockerFile();
  }

  if (request.includeCI) {
    files[`${baseDir}/.github/workflows/ci.yml`] = ciFile();
  }

  if (request.includeTests) {
    files[`${baseDir}/tests/${normalizedId}.test.${ext}`] = testFile(request, normalizedId);
  }

  const integrationSnippet = `{
  id: '${normalizedId}',
  name: '${escapeSingleQuotes(request.name)}',
  icon: '${request.icon || '🧪'}',
  category: '${escapeSingleQuotes(request.category)}',
  description: '${escapeSingleQuotes(request.description)}',
  difficulty: '${request.difficulty}',
  tags: ${JSON.stringify(request.tags)},
}`;

  return {
    normalizedId,
    files,
    integrationSnippet,
    runCommands: ['npm install', 'npm run dev', 'npm run build'],
  };
}
