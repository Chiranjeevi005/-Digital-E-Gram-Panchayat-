"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const grievance_controller_1 = require("../controllers/grievance.controller");
const router = (0, express_1.Router)();
// More specific routes should come first
// Use a more specific pattern for user route to ensure it matches before the generic :id route
router.get('/user/:userId', grievance_controller_1.getUserGrievances);
router.get('/view/:id', grievance_controller_1.getGrievanceById);
router.delete('/view/:grievanceId', grievance_controller_1.deleteGrievance);
// Other routes
router.post('/', grievance_controller_1.createGrievance);
router.get('/', grievance_controller_1.getGrievances);
router.put('/view/:id', grievance_controller_1.updateGrievance);
router.post('/edit/:id', grievance_controller_1.editGrievance);
router.post('/resolve/:id', grievance_controller_1.resolveGrievance);
router.get('/acknowledgment/:grievanceId', grievance_controller_1.downloadGrievanceAcknowledgment);
router.get('/resolution/:grievanceId', grievance_controller_1.downloadGrievanceResolution);
exports.default = router;
