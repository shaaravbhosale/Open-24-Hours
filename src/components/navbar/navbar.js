import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1 }}>
          <Typography 
            variant="h5" 
            component={Link}
            to="/"
            sx={{ 
              flexGrow: 1,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1E88E5, #42A5F5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textDecoration: 'none',
            }}
          >
            Open 24 Hours
          </Typography>
          <Button 
            color="primary" 
            sx={{ 
              mx: 1,
              color: '#2C3E50',
              '&:hover': { backgroundColor: 'rgba(30, 136, 229, 0.08)' }
            }}
          >
            How it Works
          </Button>
          <Button 
            color="primary"
            sx={{ 
              mx: 1,
              color: '#2C3E50',
              '&:hover': { backgroundColor: 'rgba(30, 136, 229, 0.08)' }
            }}
          >
            Features
          </Button>
          <Button 
            color="primary"
            onClick={() => navigate('/login')}
            sx={{ 
              mx: 1,
              color: '#2C3E50',
              '&:hover': { backgroundColor: 'rgba(30, 136, 229, 0.08)' }
            }}
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate('/signup')}
            variant="contained"
            sx={{
              ml: 2,
              px: 3,
              py: 1,
              borderRadius: '50px',
              background: 'linear-gradient(45deg, #1E88E5, #42A5F5)',
              boxShadow: '0 4px 14px rgba(30, 136, 229, 0.25)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2, #1E88E5)',
                boxShadow: '0 6px 20px rgba(30, 136, 229, 0.35)',
              }
            }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;