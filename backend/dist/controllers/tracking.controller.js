"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentActivity = exports.getApplicationStats = exports.getUserApplications = void 0;
const CertificateApplication_1 = __importDefault(require("../models/CertificateApplication"));
const SchemeApplication_1 = __importDefault(require("../models/SchemeApplication"));
const Grievance_1 = __importDefault(require("../models/Grievance"));
// Get all applications for a user across all services
const getUserApplications = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        // Fetch certificates for the user
        const certificates = await CertificateApplication_1.default.find({ userId: userId });
        // Fetch schemes for the user
        const schemes = await SchemeApplication_1.default.find({ citizenId: userId });
        // Fetch grievances for the user
        const grievances = await Grievance_1.default.find({ citizenId: userId });
        // Transform certificates to tracking items
        const certificateItems = certificates.map(cert => ({
            id: cert._id.toString(),
            type: 'certificate',
            title: `${cert.certificateType} Certificate Application`,
            status: cert.status,
            date: cert.createdAt.toISOString().split('T')[0],
            referenceNumber: `CERT-${cert._id.toString().substring(0, 8).toUpperCase()}`,
            serviceType: 'Certificates'
        }));
        // Transform schemes to tracking items
        const schemeItems = schemes.map(scheme => ({
            id: scheme._id.toString(),
            type: 'scheme',
            title: `${scheme.schemeName} Application`,
            status: scheme.status,
            date: scheme.submittedAt.toISOString().split('T')[0],
            referenceNumber: `SCHM-${scheme._id.toString().substring(0, 8).toUpperCase()}`,
            serviceType: 'Schemes'
        }));
        // Transform grievances to tracking items
        const grievanceItems = grievances.map(grievance => ({
            id: grievance._id.toString(),
            type: 'grievance',
            title: grievance.title,
            status: grievance.status,
            date: grievance.createdAt.toISOString().split('T')[0],
            referenceNumber: `GRV-${grievance._id.toString().substring(0, 8).toUpperCase()}`,
            serviceType: 'Grievances'
        }));
        // Combine all items and sort by date (newest first)
        const allItems = [...certificateItems, ...schemeItems, ...grievanceItems]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        res.json(allItems);
    }
    catch (error) {
        console.error('Error fetching user applications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUserApplications = getUserApplications;
// Get application statistics for dashboards
const getApplicationStats = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        // Fetch counts for each application type
        const certificateCount = await CertificateApplication_1.default.countDocuments({ userId: userId });
        const schemeCount = await SchemeApplication_1.default.countDocuments({ citizenId: userId });
        const grievanceCount = await Grievance_1.default.countDocuments({ citizenId: userId });
        // Fetch status counts for certificates
        const certificateStatuses = await CertificateApplication_1.default.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        // Fetch status counts for schemes
        const schemeStatuses = await SchemeApplication_1.default.aggregate([
            { $match: { citizenId: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        // Fetch status counts for grievances
        const grievanceStatuses = await Grievance_1.default.aggregate([
            { $match: { citizenId: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        res.json({
            totals: {
                certificates: certificateCount,
                schemes: schemeCount,
                grievances: grievanceCount,
                total: certificateCount + schemeCount + grievanceCount
            },
            statuses: {
                certificates: certificateStatuses.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {}),
                schemes: schemeStatuses.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {}),
                grievances: grievanceStatuses.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {})
            }
        });
    }
    catch (error) {
        console.error('Error fetching application statistics:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getApplicationStats = getApplicationStats;
// Get recent activity for dashboards
const getRecentActivity = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        // Fetch recent certificates
        const recentCertificates = await CertificateApplication_1.default.find({ userId: userId })
            .sort({ createdAt: -1 })
            .limit(5);
        // Fetch recent schemes
        const recentSchemes = await SchemeApplication_1.default.find({ citizenId: userId })
            .sort({ submittedAt: -1 })
            .limit(5);
        // Fetch recent grievances
        const recentGrievances = await Grievance_1.default.find({ citizenId: userId })
            .sort({ createdAt: -1 })
            .limit(5);
        // Transform to activity format
        const certificateActivities = recentCertificates.map(cert => ({
            id: cert._id.toString(),
            title: `${cert.certificateType} Certificate Application`,
            date: cert.createdAt,
            status: cert.status,
            type: 'Certificates',
            details: `Certificate application for ${cert.certificateType}`
        }));
        const schemeActivities = recentSchemes.map(scheme => ({
            id: scheme._id.toString(),
            title: `${scheme.schemeName} Application`,
            date: scheme.submittedAt,
            status: scheme.status,
            type: 'Schemes',
            details: `Scheme application for ${scheme.schemeName}`
        }));
        const grievanceActivities = recentGrievances.map(grievance => ({
            id: grievance._id.toString(),
            title: 'Grievance Filed',
            date: grievance.createdAt,
            status: grievance.status,
            type: 'Grievances',
            details: grievance.description || 'Grievance filed'
        }));
        // Combine and sort by date (newest first)
        const allActivities = [...certificateActivities, ...schemeActivities, ...grievanceActivities]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5); // Limit to 5 most recent activities
        res.json(allActivities);
    }
    catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getRecentActivity = getRecentActivity;
