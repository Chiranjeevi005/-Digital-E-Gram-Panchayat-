import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Set port to 3002 as default
const PORT = process.env.PORT || 3002;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});