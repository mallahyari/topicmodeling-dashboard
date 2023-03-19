import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import WordCloud from 'react-d3-cloud';

import { Box, Typography } from '@mui/material';

const WordClould = ({ width, height, margin, data }) => {
  const words = data.map((d) => ({
    text: d.word,
    value: Math.ceil(d.prob * 1000) + 20,
    prob: d.prob,
  }));

  const schemeCategory10ScaleOrdinal = d3.scaleOrdinal(d3.schemeCategory10);

  return (
    <Box className="word-cloud">
      <Box>
        <Typography gutterBottom>Topic wordCloud</Typography>
      </Box>
      <WordCloud
        data={words}
        width={width - margin.left}
        height={height - margin.top}
        font="Impact"
        fontSize={(word) => Math.ceil(word.prob * 1000) + 20}
        spiral="rectangular"
        rotate={() => (~~(Math.random() * 6) - 3) * 30}
        padding={1}
        random={Math.random}
        fill={(_, i) => schemeCategory10ScaleOrdinal(i)}
        // onWordClick={(event, d) => {
        //   console.log(`onWordClick: ${d.text}`);
        // }}
        // onWordMouseOver={(event, d) => {
        //   console.log(`onWordMouseOver: ${d.text}`);
        // }}
        // onWordMouseOut={(event, d) => {
        //   console.log(`onWordMouseOut: ${d.text}`);
        // }}
      />
    </Box>
  );
};

export default WordClould;
