import { Router } from 'express';
import {
  createScheme,
  getSchemes,
  getSchemeById,
  applyForScheme,
  getSchemeApplications,
  downloadSchemeAcknowledgment,
  deleteSchemeApplication,
  deleteScheme,
  seedSchemes
} from '../controllers/scheme.controller';

const router = Router();

router.post('/', createScheme);
router.get('/', getSchemes);
router.get('/:id', getSchemeById);
router.delete('/:id', deleteScheme);
router.post('/apply', applyForScheme);
router.get('/tracking/:userId', getSchemeApplications);
router.delete('/tracking/:applicationId', deleteSchemeApplication);
router.get('/acknowledgment/:applicationId', downloadSchemeAcknowledgment);
// Add seeding endpoint
router.post('/seed', seedSchemes);

export default router;