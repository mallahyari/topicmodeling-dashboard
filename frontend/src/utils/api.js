const serverUrl = 'http://localhost:8000';

const fetchData = async (endpoint) => {
  const response = await fetch(serverUrl + endpoint);
  if (!response.ok) {
    throw new Error('Could not connect to the server!');
  }
  const data = await response.json();
  return data;
};

export const getTopicTitleDistributions = (endpoint) => {
  return fetchData(endpoint);
};

export const getTopicWords = (endpoint) => {
  return fetchData(endpoint);
};

export const getTopicDocuments = (endpoint) => {
  return fetchData(endpoint);
};

export const getTopics = (endpoint) => {
  return fetchData(endpoint);
};

export const getWordTopicDistribution = (endpoint) => {
  return fetchData(endpoint);
};
