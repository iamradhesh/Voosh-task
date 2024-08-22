require('dotenv').config();
const mongoose = require('mongoose');

// Load MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI || "mongodb+srv://radhesh185:EWGSEJDzvTD3AJZE@cluster0.vj2hu.mongodb.net/toDoList";

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if the connection fails
  }
};

module.exports = connectDB;
