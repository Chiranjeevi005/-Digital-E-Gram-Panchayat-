"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const landrecord_controller_1 = require("../controllers/landrecord.controller");
const router = (0, express_1.Router)();
// Apply for a land record certificate
router.post('/apply', landrecord_controller_1.applyForLandRecordCertificate);
// Get land record preview data
router.get('/:id/preview', landrecord_controller_1.getLandRecordPreview);
// Update land record data
router.put('/:id/update', landrecord_controller_1.updateLandRecord);
// Get land record status
router.get('/:id/status', landrecord_controller_1.getLandRecordStatus);
// Download land record certificate
router.get('/:id/download', landrecord_controller_1.downloadLandRecordCertificate);
exports.default = router;
