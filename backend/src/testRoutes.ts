import express from 'express';
import schemeRoutes from './routes/scheme.routes';

const app = express();
app.use('/api/schemes', schemeRoutes);

// Add a test route to verify the routes are registered
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Get all registered routes
const routes: string[] = [];
app._router.stack.forEach((r: any) => {
  if (r.route && r.route.path) {
    routes.push(`${Object.keys(r.route.methods)} ${r.route.path}`);
  }
});

console.log('Registered routes:', routes);