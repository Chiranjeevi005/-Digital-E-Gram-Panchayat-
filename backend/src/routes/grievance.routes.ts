import { Router } from 'express';
import {
  createGrievance,
  getGrievances,
  getGrievanceById,
  updateGrievance,
} from '../controllers/grievance.controller';

const router = Router();

router.post('/', createGrievance);
router.get('/', getGrievances);
router.get('/:id', getGrievanceById);
router.put('/:id', updateGrievance);

export default router;