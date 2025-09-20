"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadSchemeAcknowledgment = exports.deleteScheme = exports.deleteSchemeApplication = exports.getSchemeApplications = exports.applyForScheme = exports.getSchemeById = exports.getSchemes = exports.createScheme = void 0;
const Scheme_1 = __importDefault(require("../models/Scheme"));
const SchemeApplication_1 = __importDefault(require("../models/SchemeApplication"));
const documentGenerator_1 = require("../utils/documentGenerator");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const createScheme = async (req, res) => {
    try {
        const { name, description, eligibility, benefits } = req.body;
        // Validate required fields
        if (!name || !description || !eligibility || !benefits) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const scheme = new Scheme_1.default({
            name,
            description,
            eligibility,
            benefits,
        });
        await scheme.save();
        res.status(201).json(scheme);
    }
    catch (error) {
        console.error('Error creating scheme:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createScheme = createScheme;
const getSchemes = async (req, res) => {
    try {
        console.log('Fetching schemes from database...');
        const schemes = await Scheme_1.default.find().sort({ createdAt: -1 });
        console.log(`Found ${schemes.length} schemes`);
        console.log('Schemes data:', JSON.stringify(schemes, null, 2));
        res.json(schemes);
    }
    catch (error) {
        console.error('Error fetching schemes:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getSchemes = getSchemes;
const getSchemeById = async (req, res) => {
    try {
        const scheme = await Scheme_1.default.findById(req.params.id);
        if (!scheme) {
            return res.status(404).json({ message: 'Scheme not found' });
        }
        res.json(scheme);
    }
    catch (error) {
        console.error('Error fetching scheme:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getSchemeById = getSchemeById;
// Apply for a scheme
const applyForScheme = async (req, res) => {
    try {
        const { citizenId, schemeId, schemeName, applicantName, fatherName, address, phone, email, income, caste, documents } = req.body;
        // Validate required fields
        if (!citizenId || !schemeId || !schemeName || !applicantName || !fatherName ||
            !address || !phone || !email) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }
        // Check if scheme exists
        const scheme = await Scheme_1.default.findById(schemeId);
        if (!scheme) {
            return res.status(404).json({ message: 'Scheme not found' });
        }
        // Create new scheme application
        const application = new SchemeApplication_1.default({
            citizenId,
            schemeId,
            schemeName,
            applicantName,
            fatherName,
            address,
            phone,
            email,
            income,
            caste,
            documents: documents || [],
            status: 'pending',
            submittedAt: new Date(),
            updatedAt: new Date()
        });
        await application.save();
        // Generate acknowledgment PDF
        try {
            await (0, documentGenerator_1.generateSchemeAcknowledgmentPDF)(application);
        }
        catch (pdfError) {
            console.error('Error generating PDF:', pdfError);
        }
        res.status(201).json({
            success: true,
            message: 'Scheme application submitted successfully',
            applicationId: application._id,
            status: application.status
        });
    }
    catch (error) {
        console.error('Error applying for scheme:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.applyForScheme = applyForScheme;
// Get scheme applications for a user or all applications
const getSchemeApplications = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        let applications;
        if (userId === 'all') {
            // Get all scheme applications
            applications = await SchemeApplication_1.default.find().sort({ submittedAt: -1 });
        }
        else {
            // Get scheme applications for a specific user
            applications = await SchemeApplication_1.default.find({ citizenId: userId })
                .sort({ submittedAt: -1 });
        }
        res.json(applications);
    }
    catch (error) {
        console.error('Error fetching scheme applications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getSchemeApplications = getSchemeApplications;
// Delete a scheme application
const deleteSchemeApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        // Find and delete the application
        const application = await SchemeApplication_1.default.findByIdAndDelete(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        // Also delete the associated files if they exist
        const fileNameBase = `scheme-application-${applicationId}`;
        const pdfPath = path_1.default.join(__dirname, '../../uploads', `${fileNameBase}.pdf`);
        const jpgPath = path_1.default.join(__dirname, '../../uploads', `${fileNameBase}.jpg`);
        // Delete PDF file if it exists
        if (fs_1.default.existsSync(pdfPath)) {
            fs_1.default.unlinkSync(pdfPath);
        }
        // Delete JPG file if it exists
        if (fs_1.default.existsSync(jpgPath)) {
            fs_1.default.unlinkSync(jpgPath);
        }
        res.json({
            success: true,
            message: 'Application deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting scheme application:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteSchemeApplication = deleteSchemeApplication;
// Delete a scheme
const deleteScheme = async (req, res) => {
    try {
        const { id } = req.params;
        // Find and delete the scheme
        const scheme = await Scheme_1.default.findByIdAndDelete(id);
        if (!scheme) {
            return res.status(404).json({ message: 'Scheme not found' });
        }
        res.json({
            success: true,
            message: 'Scheme deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting scheme:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteScheme = deleteScheme;
// Download scheme acknowledgment (PDF or JPG)
const downloadSchemeAcknowledgment = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { format } = req.query; // 'pdf' or 'jpg'
        // Find the application
        const application = await SchemeApplication_1.default.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        // Generate filename
        const fileNameBase = `scheme-application-${applicationId}`;
        if (format === 'jpg') {
            // Generate JPG
            const pdfPath = path_1.default.join(__dirname, '../../uploads', `${fileNameBase}.pdf`);
            // Check if PDF exists, if not generate it
            if (!fs_1.default.existsSync(pdfPath)) {
                await (0, documentGenerator_1.generateSchemeAcknowledgmentPDF)(application);
            }
            // Convert PDF to JPG
            const jpgPath = await (0, documentGenerator_1.convertPDFToJPG)(pdfPath, `${fileNameBase}.jpg`);
            // Send the JPG file
            res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.jpg"`);
            res.setHeader('Content-Type', 'image/jpeg');
            res.sendFile(jpgPath);
        }
        else {
            // Generate PDF (default)
            const pdfPath = path_1.default.join(__dirname, '../../uploads', `${fileNameBase}.pdf`);
            // Check if PDF exists, if not generate it
            if (!fs_1.default.existsSync(pdfPath)) {
                await (0, documentGenerator_1.generateSchemeAcknowledgmentPDF)(application);
            }
            // Send the PDF file
            res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.pdf"`);
            res.setHeader('Content-Type', 'application/pdf');
            res.sendFile(pdfPath);
        }
    }
    catch (error) {
        console.error('Error downloading scheme acknowledgment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.downloadSchemeAcknowledgment = downloadSchemeAcknowledgment;
