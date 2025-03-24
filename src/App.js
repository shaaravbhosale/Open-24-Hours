import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Hero from './components/hero/hero';
import Features from './components/features/features';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2',
    },
    secondary: {
      main: '#2C3E50',
    },
  },
});

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <Navbar />
          <Hero />
          <Features />
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;