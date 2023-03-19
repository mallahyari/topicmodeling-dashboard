import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useTooltip, Tooltip } from '@visx/tooltip';

import { getWordTopicDistribution } from '../../utils/api';
import './styles.css';

const dimensions = {
  width: 500,
  height: 200,
  margin: { top: 30, right: 30, bottom: 60, left: 60 },
};

const DocumentTopicHeatmap = ({ titleTokens, topics }) => {
  const { width, height, margin } = dimensions;
  const boundedDimensions = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  const [wordsTopicDistribution, setWordsTopicDistribution] = useState();
  const {
    showTooltip,
    hideTooltip,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    tooltipData,
  } = useTooltip();

  useEffect(() => {
    const fetchData = async () => {
      const promises = titleTokens.map((word) =>
        getWordTopicDistribution(`/word-topics/${word}`)
      );

      const responses = await Promise.all(promises);
      const data = await Promise.all(responses.map((response) => response));
      setWordsTopicDistribution(data);
    };
    fetchData();
  }, [titleTokens]);

  if (!wordsTopicDistribution) {
    return;
  }
  const padding = 0.01;
  const xScale = d3
    .scaleBand()
    .domain(titleTokens)
    .range([0, boundedDimensions.width])
    .padding(padding);

  const yScale = d3
    .scaleBand()
    .domain(topics)
    .range([boundedDimensions.height, 0])
    .padding(padding);

  const colorScale = d3
    .scaleSequential()
    .domain([-0.3, 1])
    .interpolator(d3.interpolateBlues);

  const handleMouseEnter = (d, word) => {
    const x = xScale(word);
    const y = yScale(d.topic);
    showTooltip({
      tooltipLeft: x + xScale.bandwidth(),
      tooltipTop: y - margin.top - 40,
      tooltipData: d,
    });
  };
  return (
    <div className="wrapper">
      <svg className="bar-svg" width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {wordsTopicDistribution.map((wtopic, i) =>
            wtopic.map((d, j) => (
              <rect
                className="heatmap-rect"
                key={`rect-${i}-${j}`}
                x={xScale(titleTokens[i])}
                y={yScale(d.topic)}
                width={xScale.bandwidth()}
                height={yScale.bandwidth()}
                fill={colorScale(d.dist)}
                onMouseEnter={() => handleMouseEnter(d, titleTokens[i])}
                onMouseLeave={() => hideTooltip()}
              />
            ))
          )}
          {/* X Axis */}
          {titleTokens.map((tick, i) => (
            <text
              key={i}
              x={xScale(tick)}
              dy="1em"
              transform={`translate(${xScale.bandwidth() / 2}, ${
                boundedDimensions.height
              })`}
              textAnchor="middle"
              style={{ fontSize: '10px' }}
            >
              {tick}
            </text>
          ))}

          {/* Y Axis */}
          {topics.map((tick, i) => (
            <text
              key={i}
              dx="-.71em"
              y={yScale(tick)}
              transform={`translate(0, ${yScale.bandwidth() / 2}
                )`}
              textAnchor="middle"
              style={{ fontSize: '10px' }}
            >
              {tick}
            </text>
          ))}
        </g>
      </svg>
      {tooltipOpen && (
        <Tooltip
          left={tooltipLeft}
          top={tooltipTop}
          className="heatmap-tooltip"
        >
          <div>
            <div>
              <p style={{ textAlign: 'left' }}>
                <strong>Topic: </strong>
                {tooltipData.topic}
              </p>
              <p>
                <strong>Probability: </strong>
                {tooltipData.dist}
              </p>
            </div>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default DocumentTopicHeatmap;
