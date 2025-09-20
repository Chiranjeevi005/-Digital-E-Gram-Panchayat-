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
  res.json({ message: 'Digital E-Panchayat API' });
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

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;