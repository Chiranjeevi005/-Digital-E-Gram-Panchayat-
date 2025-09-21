"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCertificate = exports.getCertificateStatus = exports.updateCertificate = exports.getCertificatePreview = exports.getAllCertificates = exports.applyForCertificate = void 0;
const CertificateApplication_1 = __importDefault(require("../models/CertificateApplication"));
const documentGenerator_1 = require("../utils/documentGenerator");
const fs_1 = __importDefault(require("fs"));
const socket_1 = require("../utils/socket");
// Apply for a certificate
const applyForCertificate = async (req, res) => {
    try {
        // Extract userId from authenticated user instead of request body for better security
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Extract all possible fields from request body
        const { type, certificateType, applicantName, fatherName, motherName, date, place, brideName, groomName, witnessNames, registrationNo, address, income, caste, subCaste, ward, village, district } = req.body;
        // Use certificateType if provided, otherwise fallback to type
        const certType = certificateType || type;
        if (!certType || !applicantName) {
            return res.status(400).json({ message: 'Type and applicant name are required' });
        }
        // Create new certificate application in database
        const newCertificate = new CertificateApplication_1.default({
            userId, // Use authenticated userId
            certificateType: certType,
            applicantName,
            fatherName,
            motherName,
            date: date ? new Date(date) : new Date(),
            place,
            brideName,
            groomName,
            witnessNames,
            registrationNo,
            address,
            income,
            caste,
            subCaste,
            ward,
            village,
            district,
            status: 'Submitted',
            supportingFiles: []
        });
        await newCertificate.save();
        // Emit real-time update to the citizen who applied for the certificate
        (0, socket_1.emitApplicationUpdate)(userId, newCertificate._id.toString(), 'Certificates', newCertificate.status, `${certType} certificate application submitted successfully`);
        res.status(201).json({
            success: true,
            applicationId: newCertificate._id,
            status: newCertificate.status,
            message: 'Certificate application submitted successfully'
        });
    }
    catch (error) {
        console.error('Error applying for certificate:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.applyForCertificate = applyForCertificate;
// Get all certificates
const getAllCertificates = async (req, res) => {
    try {
        const certificates = await CertificateApplication_1.default.find().sort({ createdAt: -1 });
        res.json(certificates);
    }
    catch (error) {
        console.error('Error fetching certificates:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllCertificates = getAllCertificates;
// Get certificate preview data
const getCertificatePreview = async (req, res) => {
    try {
        const { id } = req.params;
        const certificate = await CertificateApplication_1.default.findById(id);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.json(certificate);
    }
    catch (error) {
        console.error('Error fetching certificate preview:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCertificatePreview = getCertificatePreview;
// Update certificate data
const updateCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const certificate = await CertificateApplication_1.default.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.json(certificate);
    }
    catch (error) {
        console.error('Error updating certificate:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateCertificate = updateCertificate;
// Get certificate status
const getCertificateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const certificate = await CertificateApplication_1.default.findById(id);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.json({ status: certificate.status });
    }
    catch (error) {
        console.error('Error fetching certificate status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCertificateStatus = getCertificateStatus;
// Download certificate
const downloadCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        const { format } = req.query;
        console.log('Downloading certificate:', { id, format }); // Debug log
        const certificate = await CertificateApplication_1.default.findById(id);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        console.log('Found certificate:', certificate._id); // Debug log
        // For demo purposes, allow download of all certificates
        // In production, you might want to check status
        // if (certificate.status !== 'Approved') {
        //   return res.status(400).json({ message: 'Certificate not approved yet' });
        // }
        // Generate certificate filename
        const fileName = `${certificate.certificateType.replace(/\s+/g, '_')}_${certificate._id}`;
        if (format === 'jpg') {
            // For JPG format, we need to generate a PDF first and then convert it to JPG
            // Create a temporary PDF file
            const pdfPath = await (0, documentGenerator_1.generateCertificatePDF)(certificate, fileName);
            // Convert PDF to JPG using the shared utility function
            try {
                const jpgPath = await (0, documentGenerator_1.convertPDFToJPG)(pdfPath, `${fileName}.jpg`);
                // Check if JPG file exists
                if (!fs_1.default.existsSync(jpgPath)) {
                    throw new Error('JPG file was not generated successfully');
                }
                // Emit event for real-time dashboard update if userId exists
                if (certificate.userId) {
                    console.log('Emitting application update for JPG download:', {
                        userId: certificate.userId,
                        certificateId: certificate._id.toString(),
                        serviceType: 'Certificates',
                        status: certificate.status,
                        message: `Certificate downloaded in JPG format`
                    });
                    (0, socket_1.emitApplicationUpdate)(certificate.userId, certificate._id.toString(), 'Certificates', certificate.status, `Certificate downloaded in JPG format`);
                }
                else {
                    console.log('No userId found for certificate, skipping real-time update');
                }
                // Send the JPG file
                res.setHeader('Content-Disposition', `attachment; filename="${fileName}.jpg"`);
                res.setHeader('Content-Type', 'image/jpeg');
                res.sendFile(jpgPath);
            }
            catch (conversionError) {
                console.error('Error converting PDF to JPG:', conversionError);
                // Clean up temporary PDF file
                if (fs_1.default.existsSync(pdfPath)) {
                    fs_1.default.unlinkSync(pdfPath);
                }
                return res.status(500).json({
                    message: `Error generating JPG file: ${conversionError.message}. Please try downloading as PDF instead.`
                });
            }
            finally {
                // Clean up temporary PDF file after sending response
                setTimeout(() => {
                    if (fs_1.default.existsSync(pdfPath)) {
                        fs_1.default.unlinkSync(pdfPath);
                    }
                }, 1000); // Wait a bit to ensure file is sent
            }
        }
        else {
            // Generate PDF certificate using the utility function
            try {
                const pdfPath = await (0, documentGenerator_1.generateCertificatePDF)(certificate, fileName);
                // Emit event for real-time dashboard update if userId exists
                if (certificate.userId) {
                    console.log('Emitting application update for PDF download:', {
                        userId: certificate.userId,
                        certificateId: certificate._id.toString(),
                        serviceType: 'Certificates',
                        status: certificate.status,
                        message: `Certificate downloaded in PDF format`
                    });
                    (0, socket_1.emitApplicationUpdate)(certificate.userId, certificate._id.toString(), 'Certificates', certificate.status, `Certificate downloaded in PDF format`);
                }
                else {
                    console.log('No userId found for certificate, skipping real-time update');
                }
                // Send the PDF file
                res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
                res.setHeader('Content-Type', 'application/pdf');
                res.sendFile(pdfPath);
            }
            catch (generationError) {
                console.error('Error generating PDF certificate:', generationError);
                return res.status(500).json({
                    message: `Error generating PDF file: ${generationError.message}`
                });
            }
        }
    }
    catch (error) {
        console.error('Error downloading certificate:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.downloadCertificate = downloadCertificate;
