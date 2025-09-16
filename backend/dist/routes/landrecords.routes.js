"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const landrecords_controller_1 = require("../controllers/landrecords.controller");
const router = (0, express_1.Router)();
// Create a new land record
router.post('/', landrecords_controller_1.createLandRecord);
// Get land record data
router.get('/:id', landrecords_controller_1.getLandRecord);
// Download land record certificate as PDF (generated on-demand)
router.get('/:id/certificate/pdf', landrecords_controller_1.downloadLandRecordCertificatePDF);
// Download land record certificate as JPG (generated on-demand)
router.get('/:id/certificate/jpg', landrecords_controller_1.downloadLandRecordCertificateJPG);
exports.default = router;
