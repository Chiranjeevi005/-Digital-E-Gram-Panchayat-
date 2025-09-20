import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Set port from environment variable or default to 3002
const PORT = process.env.PORT || '3002';

// Start server
app.listen(parseInt(PORT, 10), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});