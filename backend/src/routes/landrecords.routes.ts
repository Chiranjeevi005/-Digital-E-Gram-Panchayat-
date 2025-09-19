import { Router } from 'express';
import {
  createLandRecord,
  getLandRecord,
  getAllLandRecords,
  downloadLandRecordCertificatePDF,
  downloadLandRecordCertificateJPG
} from '../controllers/landrecords.controller';

const router = Router();

// Get all land records
router.get('/', getAllLandRecords);

// Create a new land record
router.post('/', createLandRecord);

// Get land record data
router.get('/:id', getLandRecord);

// Download land record certificate as PDF (generated on-demand)
router.get('/:id/certificate/pdf', downloadLandRecordCertificatePDF);

// Download land record certificate as JPG (generated on-demand)
router.get('/:id/certificate/jpg', downloadLandRecordCertificateJPG);

export default router;