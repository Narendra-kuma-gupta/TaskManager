require('dotenv').config(); // Absolute first line to load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // For secure "Human Pattern" password hashing
const jwt = require('jsonwebtoken'); // For professional session management

// --- 📂 MODEL IMPORTS ---
// Ensure these files exist in your /models folder
const User = require('./models/User');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5001;

// --- 🛠️ MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Allows server to parse JSON data from the frontend

// --- 🌐 DATABASE CONNECTION ---
console.log("Attempting to connect to:", process.env.MONGODB_URI ? "URI found in .env" : "URI is MISSING");

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Human-Centric Database Connected!"))
  .catch((err) => {
    console.error("❌ Database Connection Error:", err.message);
  });

// --- 🔐 AUTHENTICATION ROUTES ---

// Registration: Hashes password before saving to the cloud
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || 'Member' 
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Error during registration" });
    }
});

// Login: Compares hashed password and issues a JWT token
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({ 
            token, 
            user: { _id: user._id, name: user.name, email: user.email, role: user.role } 
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Error during login" });
    }
});

// --- 👥 USER & TEAM ROUTES ---

// Fetches all users and counts their active tasks for the Team page
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        
        const usersWithCounts = await Promise.all(users.map(async (user) => {
            const taskCount = await Task.countDocuments({ assignedTo: user._id });
            return { ...user._doc, taskCount };
        }));

        res.json(usersWithCounts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// --- 📝 TASK MANAGEMENT ROUTES ---

// Fetch tasks with populated user names
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('creatorId', 'name')
            .populate('assignedTo', 'name');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks" });
    }
});

// Create task with detailed error logging for debugging
app.post('/api/tasks', async (req, res) => {
    try {
        console.log("📥 Incoming Task Payload:", req.body);
        const { title, description, priority, dueDate, creatorId, assignedTo } = req.body;

        const newTask = new Task({
            title, 
            description, 
            priority, 
            dueDate, 
            creatorId, 
            assignedTo,
            status: 'Pending'
        });

        const savedTask = await newTask.save();
        console.log("✅ Task Saved to Cloud");
        res.status(201).json(savedTask);
    } catch (error) {
        console.error("❌ Mongoose Task Validation Error:", error.message);
        res.status(400).json({ 
            message: "Validation Failed", 
            detail: error.message,
            receivedData: req.body 
        });
    }
});

// Update task status (e.g., Pending -> Accepted)
app.patch('/api/tasks/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: "Error updating status", error: error.message });
    }
});

// --- 🚀 SERVER START ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});