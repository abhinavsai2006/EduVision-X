'use client';
import React, { useRef, useEffect, useState, useId } from 'react';

interface Props {
  code: string;
}

export default function MermaidDiagram({ code }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, '_');
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'Inter, sans-serif',
        });
        const { svg: rendered } = await mermaid.render(`mermaid_${uniqueId}`, code || 'graph TD\n  A-->B');
        if (!cancelled) {
          setSvg(rendered);
          setError('');
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Mermaid render error');
          setSvg('');
        }
      }
    })();
    return () => { cancelled = true; };
  }, [code, uniqueId]);

  if (error) {
    return (
      <div className="w-full h-full overflow-auto p-2" style={{ background: '#fff8f8', fontSize: 11, color: '#c00', fontFamily: 'monospace' }}>
        <div className="font-bold mb-1">Mermaid Error:</div>
        <pre className="whitespace-pre-wrap">{error}</pre>
        <pre className="mt-2 text-xs text-gray-500">{code}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-auto"
      style={{ background: '#fff', borderRadius: 6 }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
