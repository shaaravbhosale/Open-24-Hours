const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tutoring', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Mongoose models
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  courses: [String],
  availability: [{
    day: String,
    startTime: String,
    endTime: String
  }]
});

const bookingSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  course: String,
  day: String,
  startTime: String,
  endTime: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
});

const User = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      courses: [],
      availability: []
    });

    await user.save();

    // Return user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      message: 'User created successfully',
      user: userData
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Return user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: 'Login successful',
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Tutor routes
app.get('/api/tutors/:id', async (req, res) => {
  try {
    const tutor = await User.findById(req.params.id);
    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Return tutor data (excluding password)
    const tutorData = tutor.toObject();
    delete tutorData.password;

    res.status(200).json(tutorData);
  } catch (error) {
    console.error('Get tutor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/tutors/:id/courses', async (req, res) => {
  try {
    const { course } = req.body;

    // Find tutor
    const tutor = await User.findById(req.params.id);
    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Add course if it doesn't exist
    if (!tutor.courses.includes(course)) {
      tutor.courses.push(course);
      await tutor.save();
    }

    res.status(200).json({ message: 'Course added successfully', courses: tutor.courses });
  } catch (error) {
    console.error('Add course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/tutors/:id/courses/:course', async (req, res) => {
  try {
    const course = decodeURIComponent(req.params.course);

    // Find tutor
    const tutor = await User.findById(req.params.id);
    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Remove course
    tutor.courses = tutor.courses.filter(c => c !== course);
    await tutor.save();

    res.status(200).json({ message: 'Course removed successfully', courses: tutor.courses });
  } catch (error) {
    console.error('Remove course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/tutors/:id/availability', async (req, res) => {
  try {
    const { day, startTime, endTime } = req.body;

    // Find tutor
    const tutor = await User.findById(req.params.id);
    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Add availability
    tutor.availability.push({ day, startTime, endTime });
    await tutor.save();

    res.status(200).json({ message: 'Availability added successfully', availability: tutor.availability });
  } catch (error) {
    console.error('Add availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/tutors/:id/availability/:index', async (req, res) => {
  try {
    const index = parseInt(req.params.index);

    // Find tutor
    const tutor = await User.findById(req.params.id);
    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Remove availability
    if (index >= 0 && index < tutor.availability.length) {
      tutor.availability.splice(index, 1);
      await tutor.save();
    }

    res.status(200).json({ message: 'Availability removed successfully', availability: tutor.availability });
  } catch (error) {
    console.error('Remove availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search for tutors
app.get('/api/tutors/search', async (req, res) => {
  try {
    const { course, day } = req.query;
    
    // Build query
    const query = { role: 'tutor' };
    
    if (course) {
      query.courses = { $in: [course] };
    }
    
    const tutors = await User.find(query).select('-password');
    
    // Filter based on day if provided
    let filteredTutors = tutors;
    if (day) {
      filteredTutors = tutors.filter(tutor => {
        if (!tutor.availability) return false;
        return tutor.availability.some(slot => slot.day === day);
      });
    }
    
    // Convert to plain objects to avoid serialization issues
    const result = filteredTutors.map(tutor => {
      const tutorObj = tutor.toObject();
      delete tutorObj.password;
      return tutorObj;
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Search tutors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bookings routes
app.post('/api/bookings', async (req, res) => {
  try {
    const { studentId, tutorId, course, day, startTime, endTime } = req.body;

    // Check if student and tutor exist
    const student = await User.findById(studentId);
    const tutor = await User.findById(tutorId);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Check if the tutor offers the course
    if (!tutor.courses.includes(course)) {
      return res.status(400).json({ message: 'Tutor does not offer this course' });
    }

    // Check if the tutor has the time slot available
    const availableSlot = tutor.availability.find(
      slot => slot.day === day && slot.startTime === startTime && slot.endTime === endTime
    );

    if (!availableSlot) {
      return res.status(400).json({ message: 'Time slot not available' });
    }

    // Create booking
    const booking = new Booking({
      studentId,
      tutorId,
      course,
      day,
      startTime,
      endTime
    });

    await booking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/tutors/:id/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({ tutorId: req.params.id });
    
    // Get student information for each booking
    const populatedBookings = [];
    
    for (const booking of bookings) {
      const student = await User.findById(booking.studentId).select('firstName lastName email');
      if (student) {
        const populatedBooking = booking.toObject();
        populatedBooking.studentName = `${student.firstName} ${student.lastName}`;
        populatedBooking.studentEmail = student.email;
        populatedBookings.push(populatedBooking);
      }
    }
    
    res.status(200).json(populatedBookings);
  } catch (error) {
    console.error('Get tutor bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/students/:id/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({ studentId: req.params.id });
    
    // Get tutor information for each booking
    const populatedBookings = [];
    
    for (const booking of bookings) {
      const tutor = await User.findById(booking.tutorId).select('firstName lastName email');
      if (tutor) {
        const populatedBooking = booking.toObject();
        populatedBooking.tutor = {
          firstName: tutor.firstName,
          lastName: tutor.lastName,
          email: tutor.email
        };
        populatedBookings.push(populatedBooking);
      }
    }
    
    res.status(200).json(populatedBookings);
  } catch (error) {
    console.error('Get student bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});