import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Typography, Paper, Button,
  Avatar, Chip, CircularProgress, Alert,
  Tab, Tabs, IconButton, List, ListItem, ListItemIcon,
  ListItemText, LinearProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SettingsIcon from '@mui/icons-material/Settings';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import './tutor-home.scss';

const TutorHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'tutor') {
        navigate('/login');
        return;
      }
      setUser(parsedUser);
      
      // Fetch tutor data
      fetchTutorData(parsedUser._id);
      fetchTutorBookings(parsedUser._id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchTutorData = async (tutorId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/tutors/${tutorId}`);
      
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch tutor data');
      }
    } catch (error) {
      console.error('Error fetching tutor data:', error);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchTutorBookings = async (tutorId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/tutors/${tutorId}/bookings`);
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data || []);
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

  // Quick stats
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalBookings = bookings.length;
  const courseCount = courses.length;

  if (!user) return null;

  return (
    <Box className="tutor-home" sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', pt: 10, pb: 8 }}>
      <Container maxWidth="lg">
      <Box sx={{ mb: 6, mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom sx={{ color: '#2C3E50' }}>
              Welcome, {user.firstName}!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
              Manage your courses, availability, and student sessions
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

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', mb: 3 }}>
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
                  <Tab 
                    icon={<PeopleIcon sx={{ mr: 1 }} />} 
                    iconPosition="start" 
                    label="Student Requests" 
                  />
                  <Tab 
                    icon={<EventIcon sx={{ mr: 1 }} />} 
                    iconPosition="start" 
                    label="Upcoming Sessions"
                    sx={{ position: 'relative' }}
                  />
                </Tabs>
              </Box>
              
              {tabValue === 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ p: 3, pb: 2 }}>
                    Recent Session Requests
                  </Typography>
                  
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : error ? (
                    <Alert severity="error" sx={{ mx: 3, mb: 3 }}>{error}</Alert>
                  ) : bookings.filter(b => b.status === 'pending').length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <HourglassEmptyIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No pending requests
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        You don't have any pending session requests at the moment.
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ py: 0 }}>
                      {bookings.filter(b => b.status === 'pending').map((booking) => (
                        <ListItem 
                          key={booking._id}
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            py: 2
                          }}
                          secondaryAction={
                            <Box>
                              <Button 
                                variant="contained" 
                                color="success"
                                size="small"
                                sx={{ mr: 1 }}
                              >
                                Confirm
                              </Button>
                              <Button 
                                variant="outlined" 
                                color="error"
                                size="small"
                              >
                                Cancel
                              </Button>
                            </Box>
                          }
                        >
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: 'warning.light' }}>
                              {booking.studentName && booking.studentName[0]}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1" fontWeight="medium">
                                  {booking.studentName}
                                </Typography>
                                <Chip 
                                  label={booking.course} 
                                  size="small" 
                                  sx={{ ml: 1.5 }}
                                  color="primary" 
                                  variant="outlined"
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <EventIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="body2" sx={{ mr: 2 }}>
                                  {booking.day}
                                </Typography>
                                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="body2">
                                  {booking.startTime} - {booking.endTime}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                  
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate('/tutor-dashboard')}
                      sx={{ textTransform: 'none' }}
                    >
                      View All Requests
                    </Button>
                  </Box>
                </Box>
              )}
              
              {tabValue === 1 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ p: 3, pb: 2 }}>
                    Confirmed Sessions
                  </Typography>
                  
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : error ? (
                    <Alert severity="error" sx={{ mx: 3, mb: 3 }}>{error}</Alert>
                  ) : bookings.filter(b => b.status === 'confirmed').length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <EventIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No confirmed sessions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        You don't have any confirmed tutoring sessions yet.
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ py: 0 }}>
                      {bookings.filter(b => b.status === 'confirmed').slice(0, 3).map((booking) => (
                        <ListItem 
                          key={booking._id}
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            py: 2
                          }}
                        >
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: 'success.light' }}>
                              {booking.studentName && booking.studentName[0]}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1" fontWeight="medium">
                                  {booking.studentName}
                                </Typography>
                                <Chip 
                                  label={booking.course} 
                                  size="small" 
                                  sx={{ ml: 1.5 }}
                                  color="primary" 
                                  variant="outlined"
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <EventIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="body2" sx={{ mr: 2 }}>
                                  {booking.day}
                                </Typography>
                                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="body2">
                                  {booking.startTime} - {booking.endTime}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                  
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate('/tutor-dashboard')}
                      sx={{ textTransform: 'none' }}
                    >
                      View All Sessions
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  My Courses
                </Typography>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => navigate('/tutor-dashboard')}
                  size="small"
                >
                  Edit
                </Button>
              </Box>
              
              <Box sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }} />

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : courses.length === 0 ? (
                <Alert severity="info">
                  You haven't added any courses yet. Add courses you can tutor.
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {courses.map((course, index) => (
                    <Chip 
                      key={index} 
                      label={course} 
                      color="primary"
                      sx={{ 
                        px: 1, 
                        py: 2.5, 
                        borderRadius: 2,
                        '& .MuiChip-label': { fontSize: '0.95rem', px: 1 }
                      }}
                    />
                  ))}
                </Box>
              )}
            </Paper>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Quick Tips
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Respond promptly to session requests"
                    secondary="Students appreciate quick responses, even if you can't accept the session"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Keep your availability up-to-date"
                    secondary="This ensures students can book times that actually work for you"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Be prepared for your sessions"
                    secondary="Review the course material before meeting with students"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          {/* Right Column */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Dashboard
                </Typography>
                <IconButton size="small">
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <Box sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Session Requests
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {pendingBookings}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={totalBookings > 0 ? (pendingBookings / totalBookings) * 100 : 0} 
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Confirmed Sessions
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {confirmedBookings}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0} 
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Courses Offered
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {courseCount}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate"
                  value={courseCount > 0 ? Math.min(courseCount * 10, 100) : 0} 
                  color="primary"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/tutor-dashboard')}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 'medium'
                  }}
                >
                  Go to Full Dashboard
                </Button>
              </Box>
            </Paper>
            
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Quick Actions
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<EditIcon />}
                    onClick={() => navigate('/tutor-dashboard')}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderWidth: 1.5,
                      textTransform: 'none',
                      fontWeight: 'medium',
                      justifyContent: 'flex-start',
                      '&:hover': { borderWidth: 1.5 }
                    }}
                  >
                    Update Availability
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<LibraryBooksIcon />}
                    onClick={() => navigate('/tutor-dashboard')}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderWidth: 1.5,
                      textTransform: 'none',
                      fontWeight: 'medium',
                      justifyContent: 'flex-start',
                      '&:hover': { borderWidth: 1.5 }
                    }}
                  >
                    Manage Courses
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate('/tutor-dashboard')}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderWidth: 1.5,
                      textTransform: 'none',
                      fontWeight: 'medium',
                      justifyContent: 'flex-start',
                      '&:hover': { borderWidth: 1.5 }
                    }}
                  >
                    View All Bookings
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            
            {pendingBookings > 0 && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 4,
                  bgcolor: 'warning.light',
                  color: 'warning.contrastText'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <HourglassEmptyIcon sx={{ mr: 1.5 }} />
                  <Typography variant="body1" fontWeight="medium">
                    {pendingBookings} pending {pendingBookings === 1 ? 'request' : 'requests'} to review
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  color="warning"
                  onClick={() => navigate('/tutor-dashboard')}
                  sx={{ mt: 2, color: 'white', textTransform: 'none', fontWeight: 'medium' }}
                >
                  Review Requests
                </Button>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TutorHome;