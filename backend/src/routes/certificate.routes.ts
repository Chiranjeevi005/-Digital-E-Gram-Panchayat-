import { Router } from 'express';
import {
  applyForCertificate,
  getCertificateStatus,
  downloadCertificate,
  getCertificatePreview,
  updateCertificate,
  getAllCertificates
} from '../controllers/certificate.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Get all certificates
router.get('/', getAllCertificates);

// Apply for a certificate - requires authentication
router.post('/apply', authenticate, applyForCertificate);

// Get certificate preview data
router.get('/:id/preview', getCertificatePreview);

// Update certificate data
router.put('/:id/update', updateCertificate);

// Get certificate status
router.get('/:id/status', getCertificateStatus);

// Download certificate
router.get('/:id/download', downloadCertificate);

export default router;