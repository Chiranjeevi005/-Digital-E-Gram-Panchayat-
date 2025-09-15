import { Router } from 'express';
import {
  applyForCertificate,
  getCertificateStatus,
  downloadCertificate,
  getCertificatePreview,
  updateCertificate
} from '../controllers/certificate.controller';

const router = Router();

// Apply for a certificate
router.post('/apply', applyForCertificate);

// Get certificate preview data
router.get('/:id/preview', getCertificatePreview);

// Update certificate data
router.put('/:id/update', updateCertificate);

// Get certificate status
router.get('/:id/status', getCertificateStatus);

// Download certificate
router.get('/:id/download', downloadCertificate);

export default router;