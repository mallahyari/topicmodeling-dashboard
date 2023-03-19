import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { useTooltip, Tooltip } from '@visx/tooltip';

import BarAxisLeft from './BarAxisLeft';
import BarAxisBottom from './BarAxisBottom';
import { getTopicTitleDistributions } from '../../utils/api';
import './styles.css';

const dimensions = {
  width: 500,
  height: 400,
  margin: { top: 30, right: 30, bottom: 60, left: 60 },
};

export const BarChart = ({ onClick }) => {
  const { width, height, margin } = dimensions;
  const boundedDimensions = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  const [data, setData] = useState(null);

  const {
    showTooltip,
    hideTooltip,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    tooltipData,
  } = useTooltip();

  useEffect(() => {
    getTopicTitleDistributions('/topic-title-distribution').then((res) =>
      setData(res)
    );
  }, []);

  if (!data) {
    return <div>Bar chart is being loaded...</div>;
  }

  const barPadding = 0.2;
  const xDomain = data.map((d) => d.topic);

  // Define Scales
  const xScale = d3
    .scaleBand()
    .domain(xDomain)
    .range([0, boundedDimensions.width])
    .padding(barPadding);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.count))
    .range([boundedDimensions.height, 0])
    .nice();

  const handleMouseOver = (e, d) => {
    const x = xScale(d.topic);
    const y = yScale(d.count);
    showTooltip({
      tooltipLeft: x + xScale.bandwidth(),
      tooltipTop: y - margin.top - 50,
      tooltipData: d,
    });
  };

  return (
    <div className="wrapper">
      <div>Topic-title distribution</div>
      <svg className="bar-svg" width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <BarAxisBottom
            width={boundedDimensions.width}
            height={boundedDimensions.height}
            xScale={xScale}
          />
          <BarAxisLeft
            width={boundedDimensions.width}
            height={boundedDimensions.height}
            yScale={yScale}
          />
          <text
            x={boundedDimensions.width / 2}
            y={height - margin.bottom}
            textAnchor="middle"
            fontSize="12px"
          >
            Topics
          </text>
          <text
            transform={`translate(-40,${
              boundedDimensions.height / 2
            }) rotate(-90) `}
            style={{
              fontSize: '11px',
            }}
            textAnchor="middle"
          >
            Title frequencies
          </text>
          {data.map((d, i) => (
            <g key={i}>
              <rect
                x={xScale(d.topic)}
                y={yScale(d.count)}
                width={xScale.bandwidth()}
                height={boundedDimensions.height - yScale(d.count)}
                fill="#E6842A"
                className="bar"
                onMouseOver={(e) => handleMouseOver(e, d)}
                onMouseOut={() => hideTooltip()}
                onClick={() => onClick(d.topic)}
              />
            </g>
          ))}
        </g>
      </svg>
      {tooltipOpen && (
        <Tooltip left={tooltipLeft} top={tooltipTop} className="bar-tooltip">
          <div>
            <div>
              <p style={{ textAlign: 'left' }}>
                <strong>Topic: </strong>
                {tooltipData.topic}
              </p>
              <p>
                <strong>Counts: </strong>
                {tooltipData.count}
              </p>
            </div>
          </div>
        </Tooltip>
      )}
    </div>
  );
};
