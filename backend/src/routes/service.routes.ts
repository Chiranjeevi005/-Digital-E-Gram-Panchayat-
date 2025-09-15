import { Router } from 'express';
import {
  createServiceRequest,
  getServiceRequests,
  getServiceRequestById,
  updateServiceRequest,
} from '../controllers/service.controller';

const router = Router();

router.post('/', createServiceRequest);
router.get('/', getServiceRequests);
router.get('/:id', getServiceRequestById);
router.put('/:id', updateServiceRequest);

export default router;