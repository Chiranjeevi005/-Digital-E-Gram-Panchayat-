import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import connectDB from './config/db';

// Load environment variables
dotenv.config();

console.log('Starting server with environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');

// Connect to database
connectDB();

// Set port from environment variable or default to 10000 (Render's default)
const PORT = process.env.PORT || '10000';

// Create HTTP server
const server = createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000', 
      'http://localhost:3001', 
      'http://127.0.0.1:3000', 
      'http://127.0.0.1:3001',
      'http://localhost:3001',
      // Add Vercel frontend domains
      'https://digital-e-gram-panchayat-frontend.vercel.app',
      'https://digital-e-gram-panchayat-frontend-pkb9qdcc0.vercel.app',
      // Add Render frontend domain
      'https://digital-e-gram-panchayat-rjkb.onrender.com',
      // Add Vercel frontend domain - will be set via environment variable in production
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
    ],
    credentials: true
  }
});

// Store socket connections by user ID
const userSockets = new Map<string, string>();

// Make io and userSockets available to other modules
declare global {
  var io: Server;
  var userSockets: Map<string, string>;
}
global.io = io;
global.userSockets = userSockets;

// Handle socket connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // When a user joins, associate their socket ID with their user ID
  socket.on('join', (userId: string) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });
  
  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove the user from the map when they disconnect
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        break;
      }
    }
  });
});

console.log(`Attempting to start server on port ${PORT}`);

// Start server
server.listen(parseInt(PORT, 10), '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Server is accessible at: http://0.0.0.0:${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server failed to start:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});