const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import routes and middleware
const authRoutes = require('./Routes/auth'); // Adjust the path if necessary
const connectDB = require('./Config/db'); // Adjust the path if necessary
const errorHandler = require('./Middleware/errorHandlingMiddleware');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Voosh Task Backend!');
});

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(errorHandler); // Custom error handler

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
