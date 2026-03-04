import { NextResponse } from 'next/server';
import { generateSimulationTemplate, type SimulationBuilderRequest } from '@/lib/simulationBuilder';

const requiredKeys: Array<keyof SimulationBuilderRequest> = [
  'id',
  'name',
  'description',
  'category',
  'icon',
  'difficulty',
  'tags',
  'framework',
  'language',
  'initialState',
  'includeTheory',
  'includeMetrics',
  'includeControls',
  'includeLogs',
  'includeExport',
  'includeConfigSidebar',
  'includeTests',
  'includeDocker',
  'includeCI',
];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<SimulationBuilderRequest>;

    for (const key of requiredKeys) {
      if (body[key] === undefined) {
        return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
      }
    }

    const template = generateSimulationTemplate(body as SimulationBuilderRequest);
    return NextResponse.json(template);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
