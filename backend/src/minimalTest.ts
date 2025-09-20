import express, { Request, Response } from 'express';
import cors from 'cors';
import Scheme from './models/Scheme';
import connectDB from './config/db';

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route that directly fetches schemes
app.get('/api/schemes', async (req: Request, res: Response) => {
  try {
    console.log('Fetching schemes from database...');
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    console.log(`Found ${schemes.length} schemes`);
    res.json(schemes);
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Minimal test server running on port ${PORT}`);
});