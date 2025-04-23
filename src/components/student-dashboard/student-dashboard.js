import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Paper, TextField, Card, CardContent,
  Button, Chip, Tabs, Tab, FormControl, InputLabel, Select, MenuItem,
  Table, TableContainer, TableHead, TableBody, TableRow, TableCell,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, Divider, Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import './student-dashboard.scss';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [tutors, setTutors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [searchParams, setSearchParams] = useState({
    course: '',
    day: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    // Function to check user authentication
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'student') {
          navigate('/login');
          return;
        }
        setUser(parsedUser);
      } else {
        navigate('/login');
      }
    };

    checkAuth();
    
    const handleLogout = () => {
      navigate('/login');
    };
    
    window.addEventListener('userLogout', handleLogout);
    
    return () => {
      window.removeEventListener('userLogout', handleLogout);
    };
  }, [navigate]);

  const fetchBookings = async (studentId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/students/${studentId}/bookings`);
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data || []);
      } else {
        console.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const queryParams = new URLSearchParams();
      if (searchParams.course) queryParams.append('course', searchParams.course);
      if (searchParams.day) queryParams.append('day', searchParams.day);
      
      const response = await fetch(`http://localhost:5000/api/tutors/search?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        setTutors(data || []);
        
        setDebugInfo({
          searchTime: new Date().toISOString(),
          searchParams,
          tutorsFound: (data || []).length
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to search for tutors');
        setTutors([]);
      }
    } catch (error) {
      console.error('Error searching tutors:', error);
      setErrorMessage('Error connecting to server');
      setTutors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openBookingDialog = (tutor) => {
    setSelectedTutor(tutor);
    setShowBookingDialog(true);
  };

  const openCancelDialog = (booking) => {
    setBookingToCancel(booking);
    setShowCancelDialog(true);
  };

  const handleBookSession = async (tutorId, course, slot) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const bookingData = {
        studentId: user._id,
        tutorId: tutorId,
        course: course,
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime
      };
      
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      if (response.ok) {
        // Refresh bookings
        fetchBookings(user._id);
        // Refresh tutors to update availability
        handleSearch();
        setShowBookingDialog(false);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to book session');
      }
    } catch (error) {
      console.error('Error booking session:', error);
      setErrorMessage('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingToCancel._id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Refresh bookings
        fetchBookings(user._id);
        setShowCancelDialog(false);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setErrorMessage('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
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
      case 'confirmed': return <CheckCircleOutlineIcon color="success" />;
      case 'cancelled': return <CancelIcon color="error" />;
      default: return <AccessTimeIcon color="warning" />;
    }
  };

  if (!user) return null;

  return (
    <Box className="student-dashboard" sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', pt: 10, pb: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Welcome, {user.firstName}!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Find tutors and manage your tutoring sessions
            </Typography>
          </Box>
          
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64,
              bgcolor: 'primary.main',
              boxShadow: 2
            }}
          >
            {user.firstName[0]}{user.lastName[0]}
          </Avatar>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="student dashboard tabs"
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  py: 2,
                  fontSize: '1rem',
                }
              }}
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SearchIcon sx={{ mr: 1 }} />
                    Find a Tutor
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventIcon sx={{ mr: 1 }} />
                    My Sessions
                  </Box>
                } 
              />
            </Tabs>
          </Paper>
        </Box>
        
        {/* Find a Tutor Tab */}
        {tabValue === 0 && (
          <>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'white', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Find a Tutor
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={3} alignItems="flex-end">
                <Grid item xs={12} md={5}>
                  <TextField
                    name="course"
                    label="Course"
                    value={searchParams.course}
                    onChange={handleSearchChange}
                    placeholder="e.g. MAT 101"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <FormControl fullWidth>
                    <InputLabel>Day</InputLabel>
                    <Select
                      name="day"
                      value={searchParams.day}
                      onChange={handleSearchChange}
                      label="Day"
                    >
                      {days.map((day) => (
                        <MenuItem key={day} value={day}>{day || 'Any Day'}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                    disabled={isLoading}
                    sx={{ py: 1.5 }}
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </Grid>
              </Grid>
              
              {errorMessage && (
                <Alert severity="error" sx={{ mt: 2 }} onClose={() => setErrorMessage('')}>
                  {errorMessage}
                </Alert>
              )}
            </Paper>
            
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Available Tutors
            </Typography>
            
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : tutors.length > 0 ? (
              <Grid container spacing={3}>
                {tutors.map((tutor) => (
                  <Grid item xs={12} md={6} lg={4} key={tutor._id}>
                    <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, mr: 2 }}>
                            {tutor.firstName[0]}{tutor.lastName[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {tutor.firstName} {tutor.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {(tutor.courses || []).join(', ')}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Available Times:
                        </Typography>
                        
                        {(tutor.availability || []).length > 0 ? (
                          <Box sx={{ mb: 2 }}>
                            {tutor.availability.map((slot, idx) => (
                              <Chip
                                key={idx}
                                label={`${slot.day} ${slot.startTime} - ${slot.endTime}`}
                                variant="outlined"
                                color="primary"
                                onClick={() => openBookingDialog({...tutor, selectedSlot: slot})}
                                sx={{ m: 0.5, cursor: 'pointer' }}
                              />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No availability at this time
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  borderRadius: 2, 
                  bgcolor: 'white',
                  textAlign: 'center'
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No tutors found matching your criteria
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try searching for specific courses like "ENC 1101" or "MAC 2313"
                </Typography>
              </Paper>
            )}
            
            {debugInfo && (
              <Paper elevation={0} sx={{ mt: 4, p: 3, borderRadius: 2, bgcolor: 'white' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Debug Information:
                </Typography>
                <pre style={{ fontSize: '0.8rem', overflowX: 'auto' }}>
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </Paper>
            )}
          </>
        )}
        
        {/* My Sessions Tab */}
        {tabValue === 1 && (
          <>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'white', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                My Tutoring Sessions
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : bookings.length > 0 ? (
                <TableContainer sx={{ mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                        <TableCell>Tutor</TableCell>
                        <TableCell>Course</TableCell>
                        <TableCell>Schedule</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow 
                          key={booking._id} 
                          hover
                          sx={{
                            backgroundColor: booking.status === 'pending' ? 'rgba(255, 229, 100, 0.1)' : 'inherit'
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ bgcolor: 'primary.light', width: 36, height: 36 }}>
                                {booking.tutor.firstName.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight="medium">
                                  {booking.tutor.firstName} {booking.tutor.lastName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {booking.tutor.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={booking.course} 
                              size="small" 
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {booking.day}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {booking.startTime} - {booking.endTime}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getStatusIcon(booking.status)}
                              <Chip
                                label={booking.status}
                                size="small"
                                color={getStatusColor(booking.status)}
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            {booking.status === 'pending' && (
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<CancelIcon />}
                                onClick={() => openCancelDialog(booking)}
                              >
                                Cancel
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    You don't have any booked sessions yet.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Go to the "Find a Tutor" tab to book a tutoring session.
                  </Typography>
                </Box>
              )}
            </Paper>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Session Status Guide
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      icon={<AccessTimeIcon />}
                      label="Pending"
                      color="warning"
                      size="small"
                    />
                    <Typography variant="body2">
                      Waiting for tutor confirmation
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      icon={<CheckCircleOutlineIcon />}
                      label="Confirmed"
                      color="success"
                      size="small"
                    />
                    <Typography variant="body2">
                      Tutor has confirmed the session
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      icon={<CancelIcon />}
                      label="Cancelled"
                      color="error"
                      size="small"
                    />
                    <Typography variant="body2">
                      Session has been cancelled
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'white' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Tips for Successful Sessions
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Come Prepared
                    </Typography>
                    <Typography variant="body2">
                      Bring your questions, class materials, and any assignments you need help with.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Be On Time
                    </Typography>
                    <Typography variant="body2">
                      Log in or show up a few minutes early to make the most of your session time.
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Ask Questions
                    </Typography>
                    <Typography variant="body2">
                      Don't be afraid to ask clarifying questions if you don't understand something.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
      
      {/* Booking Dialog */}
      <Dialog
        open={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        PaperProps={{
          sx: { borderRadius: 2, maxWidth: '450px' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            Book a Session
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedTutor && (
            <>
              <Typography variant="body2" color="text.secondary" paragraph>
                You're about to book a tutoring session with:
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                    {selectedTutor.firstName[0]}{selectedTutor.lastName[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedTutor.firstName} {selectedTutor.lastName}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {selectedTutor.selectedSlot.day}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {selectedTutor.selectedSlot.startTime} - {selectedTutor.selectedSlot.endTime}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
              
              <Typography variant="body2" gutterBottom>
                Select the course you need help with:
              </Typography>
              
              <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
                <InputLabel id="course-select-label">Course</InputLabel>
                <Select
                  labelId="course-select-label"
                  value={searchParams.course}
                  onChange={(e) => setSearchParams(prev => ({...prev, course: e.target.value}))}
                  label="Course"
                >
                  {selectedTutor.courses.map((course) => (
                    <MenuItem key={course} value={course}>{course}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setShowBookingDialog(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleBookSession(
              selectedTutor._id, 
              searchParams.course, 
              selectedTutor.selectedSlot
            )} 
            variant="contained"
            color="primary"
            disabled={isLoading || !searchParams.course}
          >
            Book Session
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Cancel Dialog */}
      <Dialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        PaperProps={{
          sx: { borderRadius: 2, maxWidth: '450px' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            Cancel This Session?
          </Typography>
        </DialogTitle>
        <DialogContent>
          {bookingToCancel && (
            <>
              <Typography variant="body2" color="text.secondary" paragraph>
                Are you sure you want to cancel this tutoring session? This action cannot be undone.
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, mt: 2, borderRadius: 2 }}>
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Session Details:
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {bookingToCancel.tutor.firstName} {bookingToCancel.tutor.lastName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {bookingToCancel.course}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {bookingToCancel.day}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {bookingToCancel.startTime} - {bookingToCancel.endTime}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setShowCancelDialog(false)}
            variant="outlined"
          >
            Keep Session
          </Button>
          <Button 
            onClick={handleCancelBooking}
            variant="contained"
            color="error"
            startIcon={<CancelIcon />}
            disabled={isLoading}
          >
            Cancel Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentDashboard;