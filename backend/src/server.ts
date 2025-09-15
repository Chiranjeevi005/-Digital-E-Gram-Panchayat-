import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';

// Connect to database
connectDB();

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});