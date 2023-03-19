import React from 'react';
import { Box, Container } from '@mui/material';
import './App.css';
import { useData } from './utils/useData';
import Dashboard from './components/dashboard';

function App() {
  return (
    <Container className="App">
      <Dashboard />
    </Container>
  );
}

export default App;
