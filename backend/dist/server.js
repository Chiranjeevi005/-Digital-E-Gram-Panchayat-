"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
// Load environment variables
dotenv_1.default.config();
console.log('Starting server with environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
// Connect to database
(0, db_1.default)();
// Set port from environment variable or default to 10000 (Render's default)
const PORT = process.env.PORT || '10000';
console.log(`Attempting to start server on port ${PORT}`);
// Create server and handle errors
const server = app_1.default.listen(parseInt(PORT, 10), '0.0.0.0', () => {
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
