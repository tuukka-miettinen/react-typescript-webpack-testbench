import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './BarChart.css';

interface BarData {
  name: string;
  value: number;
}

interface BarChartProps {
  data: BarData[];
  width: number;
  height: number;
}

const lightenColor = (color: string, percentage: number): string => {
  const decimalPercentage = percentage / 100;
  const colorObj = d3.color(color);
  if (colorObj) {
    const lighterColor = colorObj.brighter(decimalPercentage);
    return lighterColor.toString();
  }
  return color;
};

const BarChart: React.FC<BarChartProps> = ({ data, width, height }) => {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      drawChart(chartRef.current);
    }
  }, [chartRef, data]);

  const drawChart = (svgElement: SVGSVGElement) => {
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const bars = svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.name) || 0)
      .attr('y', (d) => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d.value))
      .attr('fill', (d, i) => color(String(i)));

    bars.on('mouseover', (event, d) => {
      const bar = d3.select(event.currentTarget);
      const currentColor = bar.attr('fill');
      bar.attr('fill', lightenColor(currentColor, 40));

      d3.select('#tooltip')
        .style('opacity', 1)
        .style('left', event.pageX + 10 + 'px')
        .style('top', event.pageY - 20 + 'px')
        .html(`Value: ${d.value}`);
    });

    bars.on('mouseout', (event) => {
      const bar = d3.select(event.currentTarget);
      const index = data.findIndex((item) => item === event.target.__data__);
      bar.transition().duration(500).attr('fill', color(String(index)));

      d3.select('#tooltip').style('opacity', 0);
    });

    bars.on('click', (_event, clickedData) => {
      bars.attr('fill', (d, i) => (d.name === clickedData.name ? color(String(i)) : '#ccc'));
    });
  };

  return (
    <>
      <svg ref={chartRef} width={width} height={height}></svg>
      <div id="tooltip" className="tooltip"></div>
    </>
  );
};

export default BarChart;