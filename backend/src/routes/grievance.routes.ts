import { Router } from 'express';
import {
  createGrievance,
  getGrievances,
  getGrievanceById,
  updateGrievance,
  getUserGrievances,
  editGrievance,
  resolveGrievance,
  downloadGrievanceAcknowledgment,
  downloadGrievanceResolution,
  deleteGrievance
} from '../controllers/grievance.controller';

const router = Router();

// More specific routes should come first
// Use a more specific pattern for user route to ensure it matches before the generic :id route
router.get('/user/:userId', getUserGrievances);
router.get('/view/:id', getGrievanceById);
router.delete('/view/:grievanceId', deleteGrievance);

// Other routes
router.post('/', createGrievance);
router.get('/', getGrievances);
router.put('/view/:id', updateGrievance);
router.post('/edit/:id', editGrievance);
router.post('/resolve/:id', resolveGrievance);
router.get('/acknowledgment/:grievanceId', downloadGrievanceAcknowledgment);
router.get('/resolution/:grievanceId', downloadGrievanceResolution);

export default router;