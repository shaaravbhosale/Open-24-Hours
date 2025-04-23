import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Paper, TextField, Card, CardContent,
  Button, Chip, Tabs, Tab, FormControl, InputLabel, Select, MenuItem,
  Table, TableContainer, TableHead, TableBody, TableRow, TableCell,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, Divider, Avatar, IconButton, Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import './tutor-dashboard.scss';

const TutorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newCourse, setNewCourse] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [newAvailability, setNewAvailability] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00'
  });
  const [loading, setLoading] = useState({
    courses: false,
    availability: false,
    bookings: false
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionBooking, setActionBooking] = useState(null);
  const [actionType, setActionType] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

  const fetchTutorData = async (tutorId) => {
    try {
      setLoading(prev => ({ ...prev, courses: true, availability: true }));
      const response = await fetch(`http://localhost:5000/api/tutors/${tutorId}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
        setAvailability(data.availability || []);
      }
    } catch (error) {
      console.error('Error fetching tutor data:', error);
    } finally {
      setLoading(prev => ({ ...prev, courses: false, availability: false }));
    }
  };

  const fetchTutorBookings = async (tutorId) => {
    try {
      setLoading(prev => ({ ...prev, bookings: true }));
      const response = await fetch(`http://localhost:5000/api/tutors/${tutorId}/bookings`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  };

  const handleAddCourse = async () => {
    if (!newCourse.trim()) return;
    
    try {
      setLoading(prev => ({ ...prev, courses: true }));
      
      const updatedCourses = [...courses, newCourse.trim()];
      
      const response = await fetch(`http://localhost:5000/api/tutors/${user._id}/courses`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courses: updatedCourses })
      });
      
      if (response.ok) {
        setCourses(updatedCourses);
        setNewCourse('');
      }
    } catch (error) {
      console.error('Error adding course:', error);
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  const handleRemoveCourse = async (courseToRemove) => {
    try {
      setLoading(prev => ({ ...prev, courses: true }));
      
      const updatedCourses = courses.filter(course => course !== courseToRemove);
      
      const response = await fetch(`http://localhost:5000/api/tutors/${user._id}/courses`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courses: updatedCourses })
      });
      
      if (response.ok) {
        setCourses(updatedCourses);
      }
    } catch (error) {
      console.error('Error removing course:', error);
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  const handleAddAvailability = async () => {
    // Simple validation
    if (newAvailability.startTime >= newAvailability.endTime) {
      alert('End time must be after start time');
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, availability: true }));
      
      const updatedAvailability = [...availability, { ...newAvailability }];
      
      const response = await fetch(`http://localhost:5000/api/tutors/${user._id}/availability`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: updatedAvailability })
      });
      
      if (response.ok) {
        setAvailability(updatedAvailability);
        setNewAvailability({
          day: 'Monday',
          startTime: '09:00',
          endTime: '10:00'
        });
      }
    } catch (error) {
      console.error('Error adding availability:', error);
    } finally {
      setLoading(prev => ({ ...prev, availability: false }));
    }
  };

  const handleRemoveAvailability = async (index) => {
    try {
      setLoading(prev => ({ ...prev, availability: true }));
      
      const updatedAvailability = availability.filter((_, i) => i !== index);
      
      const response = await fetch(`http://localhost:5000/api/tutors/${user._id}/availability`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: updatedAvailability })
      });
      
      if (response.ok) {
        setAvailability(updatedAvailability);
      }
    } catch (error) {
      console.error('Error removing availability:', error);
    } finally {
      setLoading(prev => ({ ...prev, availability: false }));
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openConfirmDialog = (booking, action) => {
    setActionBooking(booking);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const handleUpdateBookingStatus = async () => {
    if (!actionBooking || !actionType) return;
    
    try {
      setLoading(prev => ({ ...prev, bookings: true }));
      
      const response = await fetch(`http://localhost:5000/api/bookings/${actionBooking._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: actionType === 'confirm' ? 'confirmed' : 'cancelled' 
        })
      });
      
      if (response.ok) {
        // Refresh bookings list
        fetchTutorBookings(user._id);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
      setShowConfirmDialog(false);
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
    <Box className="tutor-dashboard" sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', pt: 10, pb: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Welcome, {user.firstName}!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage your courses, availability, and student bookings
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
              aria-label="tutor dashboard tabs"
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
                    <SchoolIcon sx={{ mr: 1 }} />
                    My Courses
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventIcon sx={{ mr: 1 }} />
                    My Availability
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    Student Bookings
                    {bookings.filter(b => b.status === 'pending').length > 0 && (
                      <Chip 
                        label={bookings.filter(b => b.status === 'pending').length} 
                        color="error" 
                        size="small"
                        sx={{ ml: 1, height: 20, minWidth: 20 }}
                      />
                    )}
                  </Box>
                } 
              />
            </Tabs>
          </Paper>
        </Box>
        
        {/* Courses Tab */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'white', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Courses I Teach
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                {loading.courses ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : courses.length > 0 ? (
                  <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    {courses.map((course, index) => (
                      <Grid item key={index}>
                        <Chip 
                          label={course} 
                          onDelete={() => handleRemoveCourse(course)}
                          color="primary"
                          variant="filled"
                          sx={{ 
                            px: 1, 
                            py: 2.5, 
                            borderRadius: 2,
                            '& .MuiChip-label': {
                              fontSize: '1rem',
                              px: 1
                            }
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    You haven't added any courses yet. Add the courses you can tutor.
                  </Alert>
                )}
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="Course Code and Name"
                    placeholder="e.g. MAT 101: Algebra"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="medium"
                  />
                  <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={handleAddCourse}
                    disabled={loading.courses || !newCourse.trim()}
                    sx={{ px: 3, whiteSpace: 'nowrap' }}
                  >
                    Add Course
                  </Button>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'white' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  At a Glance
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card elevation={0} sx={{ bgcolor: 'primary.50', borderRadius: 2 }}>
                      <CardContent>
                        <Typography color="primary" variant="overline">
                          Courses
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {courses.length}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Card elevation={0} sx={{ bgcolor: 'success.50', borderRadius: 2 }}>
                      <CardContent>
                        <Typography color="success.dark" variant="overline">
                          Available Times
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {availability.length}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Card elevation={0} sx={{ bgcolor: 'warning.50', borderRadius: 2 }}>
                      <CardContent>
                        <Typography color="warning.dark" variant="overline">
                          Pending
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {bookings.filter(b => b.status === 'pending').length}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Card elevation={0} sx={{ bgcolor: 'info.50', borderRadius: 2 }}>
                      <CardContent>
                        <Typography color="info.dark" variant="overline">
                          Confirmed
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {bookings.filter(b => b.status === 'confirmed').length}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}
        
        {/* Availability Tab */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'white', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  My Availability Schedule
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                {loading.availability ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : availability.length > 0 ? (
                  <TableContainer sx={{ mb: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                          <TableCell>Day</TableCell>
                          <TableCell>Start Time</TableCell>
                          <TableCell>End Time</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {availability.map((slot, index) => (
                          <TableRow key={index} hover>
                            <TableCell>
                              <Typography variant="body1" fontWeight="medium">
                                {slot.day}
                              </Typography>
                            </TableCell>
                            <TableCell>{slot.startTime}</TableCell>
                            <TableCell>{slot.endTime}</TableCell>
                            <TableCell align="right">
                              <Tooltip title="Remove this time slot">
                                <IconButton 
                                  color="error" 
                                  onClick={() => handleRemoveAvailability(index)}
                                  size="small"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    You haven't added any availability yet. Add the times you're available to tutor students.
                  </Alert>
                )}
                
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Add New Availability
                </Typography>
                
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="medium">
                      <InputLabel>Day</InputLabel>
                      <Select
                        value={newAvailability.day}
                        onChange={(e) => setNewAvailability({
                          ...newAvailability,
                          day: e.target.value
                        })}
                        label="Day"
                      >
                        {days.map((day) => (
                          <MenuItem key={day} value={day}>{day}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Start Time"
                      type="time"
                      value={newAvailability.startTime}
                      onChange={(e) => setNewAvailability({
                        ...newAvailability,
                        startTime: e.target.value
                      })}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="End Time"
                      type="time"
                      value={newAvailability.endTime}
                      onChange={(e) => setNewAvailability({
                        ...newAvailability,
                        endTime: e.target.value
                      })}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      startIcon={<AddIcon />}
                      variant="contained"
                      fullWidth
                      onClick={handleAddAvailability}
                      disabled={loading.availability}
                      sx={{ py: 1.5 }}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'white', mb: 3, position: 'sticky', top: 90 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Availability Tips
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    Get More Students
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Students are more likely to book sessions during evenings and weekends. Try to include some slots during these peak times.
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    Regular Schedule
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Students prefer tutors with consistent availability. Try to maintain a regular schedule each week.
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    Buffer Time
                  </Typography>
                  <Typography variant="body2">
                    Consider adding buffer time between sessions to prepare and rest. This helps maintain the quality of your tutoring.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
        
        {/* Bookings Tab */}
        {tabValue === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'white' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Student Session Requests
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                {loading.bookings ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : bookings.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                          <TableCell>Student</TableCell>
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
                                <Avatar sx={{ bgcolor: booking.status === 'pending' ? 'warning.light' : 'primary.light', width: 36, height: 36 }}>
                                  {booking.studentName.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="body1" fontWeight="medium">
                                    {booking.studentName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {booking.studentEmail}
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
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                  <Button
                                    variant="outlined"
                                    color="success"
                                    size="small"
                                    startIcon={<CheckCircleOutlineIcon />}
                                    onClick={() => openConfirmDialog(booking, 'confirm')}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    startIcon={<CancelIcon />}
                                    onClick={() => openConfirmDialog(booking, 'cancel')}
                                  >
                                    Cancel
                                  </Button>
                                </Box>
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
                      You don't have any booking requests yet.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Once students book sessions with you, they'll appear here.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        PaperProps={{
          sx: { borderRadius: 2, maxWidth: '450px' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {actionType === 'confirm' ? 'Confirm this session?' : 'Cancel this session?'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {actionBooking && (
            <>
              <Typography variant="body2" color="text.secondary" paragraph>
                {actionType === 'confirm' 
                  ? "You're about to confirm this tutoring session with the student."
                  : "You're about to cancel this tutoring session. The student will be notified."
                }
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, mt: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                    {actionBooking.studentName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {actionBooking.studentName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {actionBooking.studentEmail}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {actionBooking.course}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {actionBooking.day}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {actionBooking.startTime} - {actionBooking.endTime}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setShowConfirmDialog(false)}
            variant="outlined"
          >
            Back
          </Button>
          <Button 
            onClick={handleUpdateBookingStatus} 
            variant="contained"
            color={actionType === 'confirm' ? 'success' : 'error'}
            autoFocus
            startIcon={actionType === 'confirm' ? <CheckCircleOutlineIcon /> : <CancelIcon />}
          >
            {actionType === 'confirm' ? 'Confirm Session' : 'Cancel Session'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TutorDashboard;