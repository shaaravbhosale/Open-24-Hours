import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Typography, Paper, Button, 
  Card, CardContent, CardActionArea, Avatar, Chip, 
  CircularProgress, Alert, Tab, Tabs
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import BookIcon from '@mui/icons-material/Book';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './student-home.scss';

const StudentHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'student') {
        navigate('/login');
        return;
      }
      setUser(parsedUser);
      
      // Fetch student bookings
      fetchBookings(parsedUser._id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchBookings = async (studentId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/students/${studentId}/bookings`);
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data || []);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'cancelled': return 'error';
      default: return 'warning';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return '✓';
      case 'cancelled': return '✗';
      default: return '⌛';
    }
  };

  // Quick stats
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalBookings = bookings.length;

  if (!user) return null;

  return (
    <Box className="student-home" sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', pt: 10, pb: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom sx={{ color: '#2C3E50' }}>
              Welcome, {user.firstName}!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
              Find tutors and manage your tutoring sessions
            </Typography>
          </Box>
          
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80,
              bgcolor: 'primary.main',
              boxShadow: 3,
              fontSize: '2rem'
            }}
          >
            {user.firstName[0]}{user.lastName ? user.lastName[0] : ''}
          </Avatar>
        </Box>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: '100%', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 12, bgcolor: 'primary.main' }} />
              <Box sx={{ mt: 1 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={<SearchIcon />}
                      onClick={() => navigate('/student-dashboard')}
                      sx={{
                        py: 3,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        boxShadow: '0 10px 20px rgba(25, 118, 210, 0.2)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                          boxShadow: '0 6px 30px rgba(25, 118, 210, 0.3)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Find a Tutor
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      startIcon={<EventIcon />}
                      onClick={() => navigate('/student-dashboard')}
                      sx={{
                        py: 3,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                          background: 'rgba(25, 118, 210, 0.04)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Manage Sessions
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: '100%', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 12, bgcolor: 'secondary.main' }} />
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, mb: 2 }}>
                Your Stats at a Glance
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Card sx={{ bgcolor: 'primary.50', borderRadius: 2, height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Sessions
                      </Typography>
                      <Typography variant="h3" color="primary.main" fontWeight="bold">
                        {totalBookings}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ bgcolor: '#e8f5e9', borderRadius: 2, height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Confirmed
                      </Typography>
                      <Typography variant="h3" color="success.main" fontWeight="bold">
                        {confirmedBookings}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ bgcolor: '#fff8e1', borderRadius: 2, height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Pending
                      </Typography>
                      <Typography variant="h3" color="warning.dark" fontWeight="bold">
                        {pendingBookings}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Upcoming Sessions */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#2C3E50' }}>
          Your Sessions
        </Typography>
        
        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', mb: 6 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 'medium',
                  fontSize: '1rem',
                  py: 2
                },
                pl: 2
              }}
            >
              <Tab label="Upcoming Sessions" />
              <Tab label="Past Sessions" />
              <Tab label="All Sessions" />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>
            ) : bookings.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No sessions found
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  You don't have any tutoring sessions booked yet.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={() => navigate('/student-dashboard')}
                  sx={{ mt: 2 }}
                >
                  Find a Tutor
                </Button>
              </Box>
            ) : (
              <Box>
                {bookings.slice(0, 3).map((booking, index) => (
                  <Box 
                    key={booking._id}
                    sx={{ 
                      p: 3, 
                      borderBottom: index < bookings.length - 1 ? 1 : 0,
                      borderColor: 'divider',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.01)'
                      }
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={6} md={5}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                            {booking.tutor.firstName[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {booking.tutor.firstName} {booking.tutor.lastName}
                            </Typography>
                            <Chip 
                              size="small" 
                              label={booking.course} 
                              sx={{ mt: 0.5 }} 
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EventIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="body2">
                            {booking.day}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3} md={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="body2">
                            {booking.startTime} - {booking.endTime}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} md={2} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        <Chip
                          label={booking.status}
                          color={getStatusColor(booking.status)}
                          size="small"
                          icon={
                            <Box component="span" sx={{ fontSize: '1.2rem', mt: '2px', mr: '-6px' }}>
                              {getStatusIcon(booking.status)}
                            </Box>
                          }
                          sx={{ 
                            fontWeight: 'medium',
                            textTransform: 'capitalize'
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/student-dashboard')}
                    sx={{ textTransform: 'none' }}
                  >
                    View All Sessions
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Resources Section */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#2C3E50' }}>
          Popular Subjects
        </Typography>
        
        <Grid container spacing={3}>
          {['Mathematics', 'English', 'Science', 'Computer Science'].map((subject) => (
            <Grid item xs={12} sm={6} md={3} key={subject}>
              <Card 
                sx={{ 
                  height: '100%', 
                  borderRadius: 4,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => navigate('/student-dashboard')}
                  sx={{ height: '100%', p: 2 }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <BookIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        {subject}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Find tutors specializing in {subject.toLowerCase()}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StudentHome;