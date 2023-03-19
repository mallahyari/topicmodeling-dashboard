import React, { useState, useEffect } from 'react';
import { Grid, Box, Card, CardContent } from '@mui/material';
import { BarChart } from '../barchart/BarChart';
import WordClould from '../wordCloud';
import TopicDocumentsTable from './TopicDocumentsTable';
import { getTopicDocuments, getTopics, getTopicWords } from '../../utils/api';

const Dashboard = () => {
  const wcDimension = { width: 600, height: 400 };
  const margin = { top: 30, left: 30, bottom: 30, right: 30 };

  const [topicId, setTopicId] = useState(-1);
  const [topicDocuments, setTopicDocuments] = useState(null);
  const [topicWordCloud, setTopicWordCloud] = useState(null);
  const [topics, setTopics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let topDocs;
      let topWcloud;
      if (topicId !== -1) {
        topDocs = await getTopicDocuments(`/topic-documents/${topicId}`);
        topWcloud = await getTopicWords(`/topic-wordcloud/${topicId}`);
      } else {
        topDocs = await getTopicDocuments(`/topic-documents`);
      }
      const allTopics = await getTopics('/topics');
      setTopicWordCloud(topWcloud);
      setTopicDocuments(topDocs);
      setTopics(allTopics);
    };
    fetchData();
  }, [topicId]);

  const handleBarChartClick = (topId) => {
    setTopicId(topId);
    if (topicId !== topId) {
      setTopicWordCloud(null);
      setTopicDocuments(null);
    }
  };

  return (
    <Grid container minHeight="100vh">
      <Grid item xs={6}>
        <BarChart onClick={handleBarChartClick} />
      </Grid>
      <Grid item xs={6}>
        {topicWordCloud && (
          <WordClould
            width={wcDimension.width}
            height={wcDimension.height}
            margin={margin}
            data={topicWordCloud}
          />
        )}
      </Grid>
      <Grid item xs={12} mt={2}>
        {topicDocuments ? (
          <TopicDocumentsTable
            topicDocuments={topicDocuments}
            topicId={topicId}
            topics={topics}
          />
        ) : (
          <div>Loading Table...</div>
        )}
      </Grid>
    </Grid>
  );
};

export default Dashboard;
