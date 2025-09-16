import { Router } from 'express';
import {
  applyForLandRecordCertificate,
  getLandRecordStatus,
  downloadLandRecordCertificate,
  getLandRecordPreview,
  updateLandRecord
} from '../controllers/landrecord.controller';

const router = Router();

// Apply for a land record certificate
router.post('/apply', applyForLandRecordCertificate);

// Get land record preview data
router.get('/:id/preview', getLandRecordPreview);

// Update land record data
router.put('/:id/update', updateLandRecord);

// Get land record status
router.get('/:id/status', getLandRecordStatus);

// Download land record certificate
router.get('/:id/download', downloadLandRecordCertificate);

export default router;