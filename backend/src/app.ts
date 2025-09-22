import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import grievanceRoutes from './routes/grievance.routes';
import serviceRoutes from './routes/service.routes';
import schemeRoutes from './routes/scheme.routes';
import certificateRoutes from './routes/certificate.routes';
import propertyRoutes from './routes/property.routes';
import landRecordRoutes from './routes/landrecord.routes';
import landRecordsRoutes from './routes/landrecords.routes';
import trackingRoutes from './routes/tracking.routes';
import Scheme from './models/Scheme';
import path from 'path';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
// Enhanced CORS configuration for mobile compatibility
app.use(cors({
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
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
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
      // Add mobile-specific origins
      'http://localhost:3003',
      'http://127.0.0.1:3003'
    ];
    
    // For mobile devices, be more permissive
    if (allowedOrigins.indexOf(origin) !== -1 || origin?.includes('localhost') || origin?.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      // Log the origin for debugging
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Temporarily allow all for mobile debugging
    }
  },
  credentials: true,
  // Allow all headers and methods for mobile compatibility
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-Device-Type', 'X-User-Agent'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  // Mobile-specific CORS options
  maxAge: 86400 // 24 hours
}));
app.use(express.json());

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`); // Debug log
  next();
});

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Digital E-Panchayat API', 
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Simple health check endpoint for testing
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running properly',
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent') || 'Unknown'
  });
});

// Mobile-specific health check endpoint
app.get('/health/mobile', (req: Request, res: Response) => {
  const userAgent = req.get('User-Agent') || 'Unknown';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  res.json({ 
    status: 'OK', 
    message: 'Mobile health check successful',
    timestamp: new Date().toISOString(),
    userAgent,
    isMobile,
    clientIP: req.ip || req.connection.remoteAddress
  });
});

// Add a direct test route for schemes with seeding capability
app.get('/api/schemes/test', async (req: Request, res: Response) => {
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
      await Scheme.deleteMany({});
      console.log('🧹 Cleared existing schemes');
      
      console.log('Inserting sample schemes');
      // Insert sample schemes
      await Scheme.insertMany(sampleSchemes);
      console.log('✅ Sample schemes seeded successfully');
    }
    
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    res.json(schemes);
  } catch (error: any) {
    console.error('Error fetching/creating schemes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api', propertyRoutes);
app.use('/api/landrecord', landRecordRoutes);
app.use('/api/landrecords', landRecordsRoutes);
app.use('/api/tracking', trackingRoutes);

// API root endpoint - provides information about available API endpoints
// This needs to be AFTER all the specific API routes to avoid conflicts
app.get('/api', (req: Request, res: Response) => {
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
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;