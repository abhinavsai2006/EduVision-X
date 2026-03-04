'use client';
/* ═══════════════════════════════════════════════════════
   D3Chart — Renders chart elements using D3.js
   ═══════════════════════════════════════════════════════ */
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { SlideElement, ChartData } from '@/types/slide';

const COLORS = ['#6366f1', '#00cec9', '#fdcb6e', '#e17055', '#00b894', '#5cb8ff', '#81ecec', '#fab1a0'];

interface Props { element: SlideElement; }

export default function D3Chart({ element: el }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const data = el.data as ChartData | undefined;
  const chartType = el.chartType || 'bar';
  const colors = (el.style?.colors as string[]) || COLORS;

  useEffect(() => {
    if (!svgRef.current || !data) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const w = el.width;
    const h = el.height;
    const margin = { top: 20, right: 20, bottom: 35, left: 40 };
    const iw = w - margin.left - margin.right;
    const ih = h - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    if (chartType === 'bar') {
      const x = d3.scaleBand().domain(data.labels).range([0, iw]).padding(0.3);
      const y = d3.scaleLinear().domain([0, d3.max(data.values) || 1]).nice().range([ih, 0]);

      g.append('g').attr('transform', `translate(0,${ih})`)
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll('text').style('font-size', '10px').style('fill', '#666');

      g.append('g')
        .call(d3.axisLeft(y).ticks(5).tickSize(-iw))
        .selectAll('text').style('font-size', '10px').style('fill', '#666');

      g.selectAll('.tick line').style('stroke', '#eee');
      g.selectAll('.domain').style('stroke', '#ccc');

      g.selectAll('rect.bar').data(data.values).join('rect')
        .attr('class', 'bar')
        .attr('x', (_, i) => x(data.labels[i]) || 0)
        .attr('width', x.bandwidth())
        .attr('y', ih)
        .attr('height', 0)
        .attr('rx', 4)
        .attr('fill', (_, i) => colors[i % colors.length])
        .transition().duration(600)
        .attr('y', d => y(d))
        .attr('height', d => ih - y(d));

    } else if (chartType === 'pie') {
      const radius = Math.min(iw, ih) / 2;
      const pie = d3.pie<number>().sort(null)(data.values);
      const arc = d3.arc<d3.PieArcDatum<number>>().innerRadius(0).outerRadius(radius);

      const pg = g.append('g').attr('transform', `translate(${iw / 2},${ih / 2})`);
      pg.selectAll('path').data(pie).join('path')
        .attr('d', arc)
        .attr('fill', (_, i) => colors[i % colors.length])
        .attr('stroke', '#fff').attr('stroke-width', 2);

      pg.selectAll('text').data(pie).join('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px').style('fill', '#333')
        .text((_, i) => data.labels[i]);

    } else if (chartType === 'line') {
      const x = d3.scalePoint().domain(data.labels).range([0, iw]);
      const y = d3.scaleLinear().domain([0, d3.max(data.values) || 1]).nice().range([ih, 0]);

      g.append('g').attr('transform', `translate(0,${ih})`).call(d3.axisBottom(x).tickSize(0))
        .selectAll('text').style('font-size', '10px').style('fill', '#666');
      g.append('g').call(d3.axisLeft(y).ticks(5)).selectAll('text').style('font-size', '10px').style('fill', '#666');

      const line = d3.line<number>()
        .x((_, i) => x(data.labels[i]) || 0)
        .y(d => y(d))
        .curve(d3.curveMonotoneX);

      g.append('path').datum(data.values)
        .attr('fill', 'none')
        .attr('stroke', colors[0])
        .attr('stroke-width', 2.5)
        .attr('d', line);

      g.selectAll('circle').data(data.values).join('circle')
        .attr('cx', (_, i) => x(data.labels[i]) || 0)
        .attr('cy', d => y(d))
        .attr('r', 4)
        .attr('fill', colors[0]);
    }
  }, [el, data, chartType, colors]);

  if (!data) return (
    <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: '#999' }}>
      No chart data
    </div>
  );

  return <svg ref={svgRef} width={el.width} height={el.height} />;
}
