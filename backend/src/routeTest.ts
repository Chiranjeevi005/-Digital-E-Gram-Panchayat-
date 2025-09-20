import express, { Request, Response } from 'express';
import schemeRoutes from './routes/scheme.routes';

const app = express();

// Add logging middleware
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

// Register the scheme routes
app.use('/api/schemes', schemeRoutes);

// Add a catch-all route to see what's happening
app.use('*', (req: Request, res: Response) => {
  console.log(`Catch-all route hit: ${req.method} ${req.path}`);
  res.status(404).json({ message: 'Route not found' });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Route test server running on port ${PORT}`);
});