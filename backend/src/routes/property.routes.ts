import express from 'express';
import {
  getPropertyTax,
  downloadPropertyTaxReceipt,
  getMutationStatus,
  downloadMutationAcknowledgement
} from '../controllers/property.controller';

const router = express.Router();

// Property Tax Routes
router.post('/property-tax', getPropertyTax);
router.get('/property-tax/:id/download', downloadPropertyTaxReceipt);

// Mutation Status Routes
router.post('/mutation-status', getMutationStatus);
router.get('/mutation-status/:id/download', downloadMutationAcknowledgement);

export default router;