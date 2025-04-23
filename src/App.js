import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Hero from './components/hero/hero';
import Features from './components/features/features';
import Login from './components/login/login';
import Signup from './components/signup/signup';
import { AuthProvider } from './context/AuthContext';
import TutorDashboard from './components/tutor-dashboard/tutor-dashboard';
import StudentDashboard from './components/student-dashboard/student-dashboard';
import StudentHome from './components/student-home';
import TutorHome from './components/tutor-home';

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

const Home = () => (
  <>
    <Hero />
    <Features />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student-home" element={<StudentHome />} />
        <Route path="/tutor-home" element={<TutorHome />} />
        <Route path="/tutor-dashboard" element={<TutorDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;