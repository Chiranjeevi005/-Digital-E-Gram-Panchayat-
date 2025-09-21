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
const Scheme_1 = __importDefault(require("./models/Scheme"));
const path_1 = __importDefault(require("path"));
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
        // Add Vercel frontend domains
        'https://digital-e-gram-panchayat-frontend.vercel.app',
        'https://digital-e-gram-panchayat-frontend-pkb9qdcc0.vercel.app',
        // Add Render frontend domain
        'https://digital-e-gram-panchayat-rjkb.onrender.com',
        // Add Vercel frontend domain - will be set via environment variable in production
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
    ],
    credentials: true
}));
app.use(express_1.default.json());
// Serve static files
app.use('/public', express_1.default.static(path_1.default.join(__dirname, 'public')));
// Add logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`); // Debug log
    next();
});
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
// Add a direct test route for schemes with seeding capability
app.get('/api/schemes/test', async (req, res) => {
    try {
        // Check if we should seed schemes (special parameter for testing)
        const shouldSeed = req.query.seed === 'true';
        if (shouldSeed) {
            console.log('Seeding schemes requested via test endpoint');
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
            console.log('Clearing existing schemes');
            // Clear existing schemes
            await Scheme_1.default.deleteMany({});
            console.log('🧹 Cleared existing schemes');
            console.log('Inserting sample schemes');
            // Insert sample schemes
            await Scheme_1.default.insertMany(sampleSchemes);
            console.log('✅ Sample schemes seeded successfully');
        }
        const schemes = await Scheme_1.default.find().sort({ createdAt: -1 });
        res.json(schemes);
    }
    catch (error) {
        console.error('Error fetching/creating schemes:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
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
