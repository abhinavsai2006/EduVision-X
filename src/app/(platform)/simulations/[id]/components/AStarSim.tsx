'use client';
import React, { useState } from 'react';

export function AStarSim() {
    const R = 15, C = 25;
    const initGrid = () => Array(R).fill(0).map(() => Array(C).fill(0));
    const [grid, setGrid] = useState(initGrid());
    const [start, setStart] = useState({ r: 7, c: 3 });
    const [end, setEnd] = useState({ r: 7, c: 21 });
    const [path, setPath] = useState<{ r: number, c: number }[]>([]);
    const [openSet, setOpenSet] = useState<{ r: number, c: number }[]>([]);
    const [closedSet, setClosedSet] = useState<{ r: number, c: number }[]>([]);
    const [running, setRunning] = useState(false);
    const [msg, setMsg] = useState('Draw walls and click Run');

    const toggleWall = (r: number, c: number) => {
        if (running || (r === start.r && c === start.c) || (r === end.r && c === end.c)) return;
        const ng = [...grid]; ng[r] = [...ng[r]]; ng[r][c] = ng[r][c] ? 0 : 1;
        setGrid(ng); setPath([]); setOpenSet([]); setClosedSet([]);
    };

    const heuristic = (a: { r: number, c: number }, b: { r: number, c: number }) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c);

    const run = async () => {
        setRunning(true); setPath([]); setOpenSet([]); setClosedSet([]); setMsg('Searching...');
        let open = [{ r: start.r, c: start.c, f: 0, g: 0, h: heuristic(start, end), parent: null as any }];
        let closed = new Set<string>();

        while (open.length > 0) {
            open.sort((a, b) => a.f - b.f);
            let curr = open.shift()!;
            if (curr.r === end.r && curr.c === end.c) {
                let p = []; let temp = curr;
                while (temp) { p.push({ r: temp.r, c: temp.c }); temp = temp.parent; }
                setPath(p); setMsg(`Path found! Length: ${p.length - 1}`); setRunning(false);
                return;
            }
            closed.add(`${curr.r},${curr.c}`);
            setOpenSet([...open]); setClosedSet(Array.from(closed).map(s => { const [r, c] = s.split(','); return { r: +r, c: +c }; }));
            await new Promise(r => setTimeout(r, 40));

            const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
            for (const d of dirs) {
                let nr = curr.r + d[0], nc = curr.c + d[1];
                if (nr < 0 || nr >= R || nc < 0 || nc >= C || grid[nr][nc] === 1 || closed.has(`${nr},${nc}`)) continue;
                let ng = curr.g + 1;
                let exist = open.find(o => o.r === nr && o.c === nc);
                if (!exist) {
                    open.push({ r: nr, c: nc, g: ng, h: heuristic({ r: nr, c: nc }, end), f: ng + heuristic({ r: nr, c: nc }, end), parent: curr });
                } else if (ng < exist.g) {
                    exist.g = ng; exist.f = ng + exist.h; exist.parent = curr;
                }
            }
        }
        setMsg('No path found!'); setRunning(false);
    };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center', background: '#0d0d14' }}>
                <button onClick={run} disabled={running} style={{ padding: '6px 14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>▶ Run A*</button>
                <button onClick={() => { setGrid(initGrid()); setPath([]); setOpenSet([]); setClosedSet([]); setMsg('Cleared'); }} disabled={running} style={{ padding: '6px 12px', background: '#111118', color: '#94a3b8', border: '1px solid #1e1e2e', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Clear</button>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 12, color: '#94a3b8' }}>{msg}</div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', padding: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${C}, 20px)`, gap: 1, background: '#1e1e2e', padding: 1, cursor: running ? 'default' : 'pointer' }}>
                    {grid.map((row, r) => row.map((cell, c) => {
                        let isStart = r === start.r && c === start.c;
                        let isEnd = r === end.r && c === end.c;
                        let isPath = path.some(p => p.r === r && p.c === c);
                        let isOpen = openSet.some(p => p.r === r && p.c === c);
                        let isClosed = closedSet.some(p => p.r === r && p.c === c);
                        let bg = '#111118';
                        if (cell === 1) bg = '#334155';
                        else if (isStart) bg = '#22c55e';
                        else if (isEnd) bg = '#ef4444';
                        else if (isPath) bg = '#eab308';
                        else if (isClosed) bg = '#0d0d14';
                        else if (isOpen) bg = '#1e1e2e';
                        return <div key={`${r}-${c}`} onMouseDown={() => toggleWall(r, c)} onMouseEnter={e => (e.buttons === 1 && toggleWall(r, c))} style={{ width: 20, height: 20, background: bg, borderRadius: 2 }} />;
                    }))}
                </div>
            </div>
        </div>
    );
}
