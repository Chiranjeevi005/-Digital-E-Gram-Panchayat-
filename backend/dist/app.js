"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const grievance_routes_1 = __importDefault(require("./routes/grievance.routes"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const scheme_routes_1 = __importDefault(require("./routes/scheme.routes"));
const certificate_routes_1 = __importDefault(require("./routes/certificate.routes"));
const property_routes_1 = __importDefault(require("./routes/property.routes"));
const landrecord_routes_1 = __importDefault(require("./routes/landrecord.routes"));
const landrecords_routes_1 = __importDefault(require("./routes/landrecords.routes"));
const tracking_routes_1 = __importDefault(require("./routes/tracking.routes"));
const Scheme_1 = __importDefault(require("./models/Scheme")); // Add this import
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://localhost:3001',
        // Add Vercel frontend domain - will be set via environment variable in production
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
    ],
    credentials: true
}));
app.use(express_1.default.json());
// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Digital E-Panchayat API',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});
// Simple health check endpoint for testing
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Backend is running properly',
        timestamp: new Date().toISOString()
    });
});
// Add a direct test route for schemes
app.get('/api/schemes/test', async (req, res) => {
    try {
        const schemes = await Scheme_1.default.find().sort({ createdAt: -1 });
        res.json(schemes);
    }
    catch (error) {
        console.error('Error fetching schemes:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/grievances', grievance_routes_1.default);
app.use('/api/services', service_routes_1.default);
app.use('/api/schemes', scheme_routes_1.default);
app.use('/api/certificates', certificate_routes_1.default);
app.use('/api', property_routes_1.default);
app.use('/api/landrecord', landrecord_routes_1.default);
app.use('/api/landrecords', landrecords_routes_1.default);
app.use('/api/tracking', tracking_routes_1.default);
// API root endpoint - provides information about available API endpoints
// This needs to be AFTER all the specific API routes to avoid conflicts
app.get('/api', (req, res) => {
    res.json({
        message: 'Digital E-Panchayat API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            certificates: '/api/certificates',
            grievances: '/api/grievances',
            landrecord: '/api/landrecord',
            landrecords: '/api/landrecords',
            property: '/api/property-tax, /api/property-tax/:id/download, /api/mutation-status, /api/mutation-status/:id/download',
            schemes: '/api/schemes',
            services: '/api/services',
            tracking: '/api/tracking'
        },
        documentation: 'See API documentation for detailed endpoint information'
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
exports.default = app;
