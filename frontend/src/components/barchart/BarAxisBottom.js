import React from 'react';

const BarAxisBottom = ({ width, height, xScale }) => {
  return (
    <g className="axis xaxis" transform={`translate(0, ${height})`}>
      <line x1={0} x2={width} stroke="currentColor" />

      {xScale.domain().map((tickvalue, i) => (
        <g
          key={i}
          transform={`translate(${
            xScale(tickvalue) + xScale.bandwidth() / 2
          },0)`}
        >
          <line x={xScale(tickvalue)} y2={6} stroke="currentColor" />
          <text
            dy=".71em"
            fill="currentColor"
            style={{
              fontFamily: 'sans-serif',
              fontSize: '11px',
              textAnchor: 'middle',
              transform: `translateY(10px)`,
            }}
          >
            {tickvalue}
          </text>
        </g>
      ))}
    </g>
  );
};

export default BarAxisBottom;
