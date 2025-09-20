"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tracking_controller_1 = require("../controllers/tracking.controller");
const router = (0, express_1.Router)();
// Get all applications for a user across all services
router.get('/user/:userId', tracking_controller_1.getUserApplications);
// Get application statistics for dashboards
router.get('/stats/:userId', tracking_controller_1.getApplicationStats);
// Get recent activity for dashboards
router.get('/activity/:userId', tracking_controller_1.getRecentActivity);
exports.default = router;
