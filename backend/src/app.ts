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
import Scheme from './models/Scheme'; // Add this import

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
app.use(cors({
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
app.use(express.json());

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
    timestamp: new Date().toISOString()
  });
});

// Add a direct test route for schemes
app.get('/api/schemes/test', async (req: Request, res: Response) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    res.json(schemes);
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ message: 'Server error' });
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