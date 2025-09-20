import { Router } from 'express';
import {
  getUserApplications,
  getApplicationStats,
  getRecentActivity
} from '../controllers/tracking.controller';

const router = Router();

// Get all applications for a user across all services
router.get('/user/:userId', getUserApplications);

// Get application statistics for dashboards
router.get('/stats/:userId', getApplicationStats);

// Get recent activity for dashboards
router.get('/activity/:userId', getRecentActivity);

export default router;