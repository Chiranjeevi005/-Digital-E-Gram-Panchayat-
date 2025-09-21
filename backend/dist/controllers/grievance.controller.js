"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadGrievanceResolution = exports.downloadGrievanceAcknowledgment = exports.resolveGrievance = exports.editGrievance = exports.deleteGrievance = exports.getUserGrievances = exports.updateGrievance = exports.getGrievanceById = exports.getGrievances = exports.createGrievance = void 0;
const Grievance_1 = __importDefault(require("../models/Grievance"));
const documentGenerator_1 = require("../utils/documentGenerator");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const socket_1 = require("../utils/socket");
const createGrievance = async (req, res) => {
    try {
        const { citizenId, title, description, category, name, email, phone } = req.body;
        // Validate required fields
        if (!citizenId || !title || !description || !category) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }
        const grievance = new Grievance_1.default({
            citizenId,
            title,
            description,
            category,
            name,
            email,
            phone
        });
        await grievance.save();
        // Generate acknowledgment PDF
        try {
            await (0, documentGenerator_1.generateGrievanceAcknowledgmentPDF)(grievance);
        }
        catch (pdfError) {
            console.error('Error generating PDF:', pdfError);
        }
        // Emit real-time update to the citizen who filed the grievance
        (0, socket_1.emitApplicationUpdate)(citizenId, grievance._id.toString(), 'Grievances', grievance.status, `Grievance "${title}" filed successfully`);
        res.status(201).json({
            success: true,
            message: 'Grievance submitted successfully',
            grievanceId: grievance._id,
            status: grievance.status
        });
    }
    catch (error) {
        console.error('Error creating grievance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createGrievance = createGrievance;
const getGrievances = async (req, res) => {
    try {
        const grievances = await Grievance_1.default.find().sort({ createdAt: -1 });
        res.json(grievances);
    }
    catch (error) {
        console.error('Error fetching grievances:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getGrievances = getGrievances;
const getGrievanceById = async (req, res) => {
    try {
        const grievance = await Grievance_1.default.findById(req.params.id);
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }
        res.json(grievance);
    }
    catch (error) {
        console.error('Error fetching grievance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getGrievanceById = getGrievanceById;
const updateGrievance = async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const grievance = await Grievance_1.default.findByIdAndUpdate(req.params.id, { status, remarks, updatedAt: new Date() }, { new: true });
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }
        // If status is changed to resolved, generate resolution certificate
        if (status === 'resolved') {
            try {
                await (0, documentGenerator_1.generateGrievanceResolutionPDF)(grievance);
            }
            catch (pdfError) {
                console.error('Error generating resolution PDF:', pdfError);
            }
        }
        // Emit real-time update to the citizen who filed the grievance
        (0, socket_1.emitApplicationUpdate)(grievance.citizenId, grievance._id.toString(), 'Grievances', grievance.status, `Grievance status updated to ${status}`);
        res.json(grievance);
    }
    catch (error) {
        console.error('Error updating grievance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateGrievance = updateGrievance;
// Get grievances by user ID
const getUserGrievances = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const grievances = await Grievance_1.default.find({ citizenId: userId })
            .sort({ createdAt: -1 });
        res.json(grievances);
    }
    catch (error) {
        console.error('Error fetching user grievances:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUserGrievances = getUserGrievances;
// Delete a grievance
const deleteGrievance = async (req, res) => {
    try {
        const { grievanceId } = req.params;
        // Find and delete the grievance
        const grievance = await Grievance_1.default.findByIdAndDelete(grievanceId);
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }
        // Also delete the associated files if they exist
        const ackFileNameBase = `grievance-acknowledgement-${grievanceId}`;
        const resFileNameBase = `grievance-resolution-${grievanceId}`;
        const ackPdfPath = path_1.default.join(__dirname, '../../uploads', `${ackFileNameBase}.pdf`);
        const ackJpgPath = path_1.default.join(__dirname, '../../uploads', `${ackFileNameBase}.jpg`);
        const resPdfPath = path_1.default.join(__dirname, '../../uploads', `${resFileNameBase}.pdf`);
        const resJpgPath = path_1.default.join(__dirname, '../../uploads', `${resFileNameBase}.jpg`);
        // Delete acknowledgment files if they exist
        if (fs_1.default.existsSync(ackPdfPath)) {
            fs_1.default.unlinkSync(ackPdfPath);
        }
        if (fs_1.default.existsSync(ackJpgPath)) {
            fs_1.default.unlinkSync(ackJpgPath);
        }
        // Delete resolution files if they exist
        if (fs_1.default.existsSync(resPdfPath)) {
            fs_1.default.unlinkSync(resPdfPath);
        }
        if (fs_1.default.existsSync(resJpgPath)) {
            fs_1.default.unlinkSync(resJpgPath);
        }
        // Emit real-time update to the citizen who filed the grievance
        (0, socket_1.emitApplicationUpdate)(grievance.citizenId, grievanceId, 'Grievances', 'Deleted', `Grievance "${grievance.title}" deleted`);
        res.json({
            success: true,
            message: 'Grievance deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting grievance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteGrievance = deleteGrievance;
// Edit grievance before finalization
const editGrievance = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Remove fields that shouldn't be updated
        delete updateData._id;
        delete updateData.createdAt;
        delete updateData.__v;
        const grievance = await Grievance_1.default.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true });
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }
        // Emit real-time update to the citizen who filed the grievance
        (0, socket_1.emitApplicationUpdate)(grievance.citizenId, grievance._id.toString(), 'Grievances', grievance.status, `Grievance "${grievance.title}" updated`);
        res.json({
            success: true,
            message: 'Grievance updated successfully',
            grievance
        });
    }
    catch (error) {
        console.error('Error editing grievance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.editGrievance = editGrievance;
// Resolve grievance and generate resolution certificate
const resolveGrievance = async (req, res) => {
    try {
        const { id } = req.params;
        const { remarks } = req.body;
        const grievance = await Grievance_1.default.findByIdAndUpdate(id, {
            status: 'resolved',
            remarks,
            updatedAt: new Date()
        }, { new: true });
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }
        // Generate resolution certificate
        try {
            await (0, documentGenerator_1.generateGrievanceResolutionPDF)(grievance);
        }
        catch (pdfError) {
            console.error('Error generating resolution PDF:', pdfError);
        }
        // Emit real-time update to the citizen who filed the grievance
        (0, socket_1.emitApplicationUpdate)(grievance.citizenId, grievance._id.toString(), 'Grievances', 'Resolved', `Grievance "${grievance.title}" resolved`);
        res.json({
            success: true,
            message: 'Grievance resolved successfully',
            grievance
        });
    }
    catch (error) {
        console.error('Error resolving grievance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.resolveGrievance = resolveGrievance;
// Download grievance acknowledgment (PDF or JPG)
const downloadGrievanceAcknowledgment = async (req, res) => {
    try {
        const { grievanceId } = req.params;
        const { format } = req.query; // 'pdf' or 'jpg'
        // Find the grievance
        const grievance = await Grievance_1.default.findById(grievanceId);
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }
        // Generate filename
        const fileNameBase = `grievance-acknowledgement-${grievanceId}`;
        if (format === 'jpg') {
            // Generate JPG
            const pdfPath = path_1.default.join(__dirname, '../../uploads', `${fileNameBase}.pdf`);
            // Check if PDF exists, if not generate it
            if (!fs_1.default.existsSync(pdfPath)) {
                await (0, documentGenerator_1.generateGrievanceAcknowledgmentPDF)(grievance);
            }
            // Check if PDF was generated successfully
            if (!fs_1.default.existsSync(pdfPath)) {
                throw new Error('PDF file was not generated successfully');
            }
            // Convert PDF to JPG
            try {
                const jpgPath = await (0, documentGenerator_1.convertPDFToJPG)(pdfPath, `${fileNameBase}.jpg`);
                // Check if JPG file exists
                if (!fs_1.default.existsSync(jpgPath)) {
                    throw new Error('JPG file was not generated successfully');
                }
                // Emit real-time update to the citizen who filed the grievance
                (0, socket_1.emitApplicationUpdate)(grievance.citizenId, grievance._id.toString(), 'Grievances', grievance.status, `Grievance acknowledgment downloaded in JPG format`);
                // Send the JPG file
                res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.jpg"`);
                res.setHeader('Content-Type', 'image/jpeg');
                res.sendFile(jpgPath);
            }
            catch (conversionError) {
                console.error('Error converting PDF to JPG:', conversionError);
                return res.status(500).json({ message: `Error generating JPG file: ${conversionError.message}. Please try downloading as PDF instead.` });
            }
        }
        else {
            // Generate PDF (default)
            const pdfPath = path_1.default.join(__dirname, '../../uploads', `${fileNameBase}.pdf`);
            // Check if PDF exists, if not generate it
            if (!fs_1.default.existsSync(pdfPath)) {
                await (0, documentGenerator_1.generateGrievanceAcknowledgmentPDF)(grievance);
            }
            // Emit real-time update to the citizen who filed the grievance
            (0, socket_1.emitApplicationUpdate)(grievance.citizenId, grievance._id.toString(), 'Grievances', grievance.status, `Grievance acknowledgment downloaded in PDF format`);
            // Send the PDF file
            res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.pdf"`);
            res.setHeader('Content-Type', 'application/pdf');
            res.sendFile(pdfPath);
        }
    }
    catch (error) {
        console.error('Error downloading grievance acknowledgment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.downloadGrievanceAcknowledgment = downloadGrievanceAcknowledgment;
// Download grievance resolution certificate (PDF or JPG)
const downloadGrievanceResolution = async (req, res) => {
    try {
        const { grievanceId } = req.params;
        const { format } = req.query; // 'pdf' or 'jpg'
        // Find the grievance
        const grievance = await Grievance_1.default.findById(grievanceId);
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }
        // Check if grievance is resolved
        if (grievance.status !== 'resolved') {
            return res.status(400).json({ message: 'Grievance is not resolved yet' });
        }
        // Generate filename
        const fileNameBase = `grievance-resolution-${grievanceId}`;
        if (format === 'jpg') {
            // Generate JPG
            const pdfPath = path_1.default.join(__dirname, '../../uploads', `${fileNameBase}.pdf`);
            // Check if PDF exists, if not generate it
            if (!fs_1.default.existsSync(pdfPath)) {
                await (0, documentGenerator_1.generateGrievanceResolutionPDF)(grievance);
            }
            // Check if PDF was generated successfully
            if (!fs_1.default.existsSync(pdfPath)) {
                throw new Error('PDF file was not generated successfully');
            }
            // Convert PDF to JPG
            try {
                const jpgPath = await (0, documentGenerator_1.convertPDFToJPG)(pdfPath, `${fileNameBase}.jpg`);
                // Check if JPG file exists
                if (!fs_1.default.existsSync(jpgPath)) {
                    throw new Error('JPG file was not generated successfully');
                }
                // Emit real-time update to the citizen who filed the grievance
                (0, socket_1.emitApplicationUpdate)(grievance.citizenId, grievance._id.toString(), 'Grievances', 'Resolved', `Grievance resolution downloaded in JPG format`);
                // Send the JPG file
                res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.jpg"`);
                res.setHeader('Content-Type', 'image/jpeg');
                res.sendFile(jpgPath);
            }
            catch (conversionError) {
                console.error('Error converting PDF to JPG:', conversionError);
                return res.status(500).json({ message: `Error generating JPG file: ${conversionError.message}. Please try downloading as PDF instead.` });
            }
        }
        else {
            // Generate PDF (default)
            const pdfPath = path_1.default.join(__dirname, '../../uploads', `${fileNameBase}.pdf`);
            // Check if PDF exists, if not generate it
            if (!fs_1.default.existsSync(pdfPath)) {
                await (0, documentGenerator_1.generateGrievanceResolutionPDF)(grievance);
            }
            // Emit real-time update to the citizen who filed the grievance
            (0, socket_1.emitApplicationUpdate)(grievance.citizenId, grievance._id.toString(), 'Grievances', 'Resolved', `Grievance resolution downloaded in PDF format`);
            // Send the PDF file
            res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.pdf"`);
            res.setHeader('Content-Type', 'application/pdf');
            res.sendFile(pdfPath);
        }
    }
    catch (error) {
        console.error('Error downloading grievance resolution:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.downloadGrievanceResolution = downloadGrievanceResolution;
