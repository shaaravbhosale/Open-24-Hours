import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import DevicesIcon from '@mui/icons-material/Devices';
import SecurityIcon from '@mui/icons-material/Security';
import './features.scss';

const Features = () => {
  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: "Expert Guidance",
      description: "Learn from top-rated tutors with expertise in their fields",
      gradient: "linear-gradient(135deg, #FF6B6B, #FF8E8E)"
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      title: "Community",
      description: "Connect with qualified tutors from around UF",
      gradient: "linear-gradient(135deg, #4ECDC4, #45B7AF)"
    },
    {
      icon: <DevicesIcon sx={{ fontSize: 40 }} />,
      title: "Learn Anywhere",
      description: "Access your sessions from any device, anywhere",
      gradient: "linear-gradient(135deg, #FFD93D, #FFE869)"
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Secure Platform",
      description: "Your learning environment is our top priority",
      gradient: "linear-gradient(135deg, #6C5CE7, #8075FF)"
    }
  ];

  return (
    <Box 
      sx={{ 
        py: 12,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.4,
          background: 'radial-gradient(circle at 50% 50%, #1E88E5 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.5rem' },
              backgroundImage: 'linear-gradient(45deg, #1E88E5, #42A5F5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 2
            }}
          >
            Why Choose Open 24 Hours
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary"
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Experience a new way of learning with our innovative platform
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                className="feature-card"
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: '20px',
                  transition: 'all 0.3s ease-in-out',
                  border: '1px solid rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    mb: 3,
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '16px',
                    background: feature.gradient,
                    color: 'white',
                    mx: 'auto'
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 700,
                    textAlign: 'center',
                    mb: 2
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  color="text.secondary"
                  sx={{ 
                    textAlign: 'center',
                    lineHeight: 1.6
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;