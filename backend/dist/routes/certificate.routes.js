"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certificate_controller_1 = require("../controllers/certificate.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Get all certificates
router.get('/', certificate_controller_1.getAllCertificates);
// Apply for a certificate - requires authentication
router.post('/apply', auth_middleware_1.authenticate, certificate_controller_1.applyForCertificate);
// Get certificate preview data
router.get('/:id/preview', certificate_controller_1.getCertificatePreview);
// Update certificate data
router.put('/:id/update', certificate_controller_1.updateCertificate);
// Get certificate status
router.get('/:id/status', certificate_controller_1.getCertificateStatus);
// Download certificate
router.get('/:id/download', certificate_controller_1.downloadCertificate);
exports.default = router;
