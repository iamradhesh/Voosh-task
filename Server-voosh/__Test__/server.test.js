const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('../Routes/auth');
const connectDB = require('../Config//db');
const errorHandler = require('../Middleware/errorHandlingMiddleware');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

beforeAll(async () => {
  // Connect to MongoDB in-memory instance
  await connectDB(); // Adjust if needed for in-memory DB
});

afterAll(async () => {
  // Disconnect from MongoDB
  await mongoose.connection.close();
});

describe('Server Tests', () => {
  it('should respond with 200 for the root route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Welcome to the API');
  });

  describe('Auth Routes', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return validation error on invalid login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: ''
        });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Add more tests as needed for other routes and functionalities
});
