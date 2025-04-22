const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

    const userSchema = new mongoose.Schema({
        firstName: String,
        lastName: String,
        email: String,
        password: String,
        creditCardNum: String,
        creditCardDate: String,
        cvv: String
    }, { collection: 'Users' });
    
const User = mongoose.model('User', userSchema);

app.post('/api/signup', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        console.log('User saved:', newUser); // Debug
        res.json({ message: 'Signup successful!' });
    } catch (error) {
        console.error('Signup error:', error); // Debug
        res.status(500).json({ message: 'Signup failed' });
  }
});

app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({ 
        email: req.body.email, 
        password: req.body.password 
        });
        
        if (user) {
        res.json({ message: 'Login successful!' });
        } else {
        res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error); // For debugging
        res.status(500).json({ message: 'Login failed' });
    }
});


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// Delete by email
app.delete('/api/users/email/:email', async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ email: req.params.email });
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});