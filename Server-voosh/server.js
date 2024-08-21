const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./Routes/auth'); // Adjust the path if necessary
const connectDB = require('./Config/db'); // Adjust the path if necessary
const errorHandler = require('./Middleware/errorHandlingMiddleware');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Routes
app.use('/api/auth', authRoutes);
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
