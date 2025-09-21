"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const Scheme_1 = __importDefault(require("./models/Scheme")); // Add this import
// Load environment variables
dotenv_1.default.config();
console.log('Starting server with environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
// Connect to database
(0, db_1.default)();
// Sample schemes data
const sampleSchemes = [
    {
        name: 'Agricultural Subsidy Program',
        description: 'Financial assistance for farmers to purchase seeds, fertilizers, and farming equipment.',
        eligibility: 'All registered farmers with valid land ownership documents',
        benefits: 'Up to ₹50,000 subsidy for crop cultivation and farm equipment'
    },
    {
        name: 'Educational Scholarship Scheme',
        description: 'Merit-based scholarships for students from economically weaker sections.',
        eligibility: 'Students with family income below ₹2.5 lakh per annum',
        benefits: 'Tuition fees coverage and monthly stipend of ₹2,000'
    },
    {
        name: 'Healthcare Support Initiative',
        description: 'Free medical checkups and subsidized treatment for senior citizens.',
        eligibility: 'Citizens above 60 years of age',
        benefits: 'Annual health checkup packages and 70% discount on medicines'
    },
    {
        name: 'Women Empowerment Grant',
        description: 'Financial support for women entrepreneurs to start small businesses.',
        eligibility: 'Women above 18 years with valid Aadhaar and bank account',
        benefits: 'Interest-free loan up to ₹5 lakh and business mentoring'
    },
    {
        name: 'Rural Infrastructure Development',
        description: 'Funding for village infrastructure projects like roads, water supply, and sanitation.',
        eligibility: 'Community groups and local bodies',
        benefits: 'Up to 80% funding for approved infrastructure projects'
    }
];
// Seed schemes function
const seedSchemes = async () => {
    try {
        // Check if schemes already exist
        const existingSchemes = await Scheme_1.default.countDocuments({});
        if (existingSchemes === 0) {
            console.log('🌱 Seeding sample schemes...');
            await Scheme_1.default.insertMany(sampleSchemes);
            console.log('✅ Sample schemes seeded successfully');
        }
        else {
            console.log('🌱 Schemes already exist in database, skipping seeding');
        }
    }
    catch (error) {
        console.error('❌ Error seeding schemes:', error);
    }
};
// Set port from environment variable or default to 10000 (Render's default)
const PORT = process.env.PORT || '10000';
// Create HTTP server
const server = (0, http_1.createServer)(app_1.default);
// Create Socket.IO server
const io = new socket_io_1.Server(server, {
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
const userSockets = new Map();
global.io = io;
global.userSockets = userSockets;
// Handle socket connections
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    // When a user joins, associate their socket ID with their user ID
    socket.on('join', (userId) => {
        console.log(`User ${userId} joined with socket ${socket.id}`); // Debug log
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
                console.log(`User ${userId} disconnected`); // Debug log
                break;
            }
        }
    });
});
console.log(`Attempting to start server on port ${PORT}`);
// Start server
server.listen(parseInt(PORT, 10), '0.0.0.0', async () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Server is accessible at: http://0.0.0.0:${PORT}`);
    // Seed schemes when server starts
    await seedSchemes();
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
