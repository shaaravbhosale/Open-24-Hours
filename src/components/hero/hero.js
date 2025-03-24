import React from 'react';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
import './hero.scss';
import heroImage from '../../assets/images/tutor.png';

const Hero = () => {
  return (
    <Box className="hero-section">
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <div className="hero-content">
              <Typography 
                variant="h1" 
                className="hero-title"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  backgroundImage: 'linear-gradient(45deg, #1E88E5, #42A5F5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  marginBottom: 2
                }}
              >
                Learn Anytime, Anywhere
              </Typography>
              <Typography 
                variant="h5" 
                className="hero-subtitle"
                sx={{ 
                  color: 'text.secondary',
                  marginBottom: 4,
                  lineHeight: 1.5
                }}
              >
                24/7 access to expert tutors ready to help you succeed in your studies
              </Typography>
              <Box className="hero-buttons" sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{
                    padding: '12px 32px',
                    borderRadius: '30px',
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #1E88E5, #42A5F5)',
                    boxShadow: '0 4px 20px rgba(30, 136, 229, 0.25)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 25px rgba(30, 136, 229, 0.35)',
                    }
                  }}
                >
                  Start Learning Now
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{
                    padding: '12px 32px',
                    borderRadius: '30px',
                    fontSize: '1.1rem',
                    borderWidth: '2px'
                  }}
                >
                  View Tutors
                </Button>
              </Box>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className="hero-image-container">
              <img 
                src={heroImage} 
                alt="Online learning illustration" 
                className="hero-image"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;