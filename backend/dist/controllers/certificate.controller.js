"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCertificate = exports.getCertificateStatus = exports.updateCertificate = exports.getCertificatePreview = exports.applyForCertificate = exports.getAllCertificates = void 0;
const fs_1 = __importDefault(require("fs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const documentGenerator_1 = require("../utils/documentGenerator");
const socket_1 = require("../utils/socket");
// Mock database - for demo purposes
let certificates = [
    {
        _id: '1',
        id: '1',
        userId: 'user1', // Add userId
        type: 'Birth Certificate',
        certificateType: 'Birth',
        applicantName: 'John Doe',
        date: '2023-05-15',
        place: 'Village Hospital',
        status: 'Approved',
        certificateNumber: 'BC-2023-001',
        issuedDate: '2023-05-20',
        fatherName: 'Robert Doe',
        motherName: 'Mary Doe'
    },
    {
        _id: '2',
        id: '2',
        userId: 'user2', // Add userId
        type: 'Income Certificate',
        certificateType: 'Income',
        applicantName: 'Jane Smith',
        fatherName: 'Michael Smith',
        address: '123 Main St, Sample Village',
        income: '₹50,000',
        status: 'Approved',
        certificateNumber: 'IC-2023-002',
        issuedDate: '2023-05-21'
    }
];
// Get all certificates
const getAllCertificates = async (req, res) => {
    try {
        res.json(certificates);
    }
    catch (error) {
        console.error('Error fetching certificates:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllCertificates = getAllCertificates;
// Apply for a certificate
const applyForCertificate = async (req, res) => {
    try {
        // Extract all possible fields from request body
        const { userId, // Extract userId from request
        type, applicantName, fatherName, motherName, date, place, brideName, groomName, witnessNames, registrationNo, address, income, caste, subCaste, ward, village, district } = req.body;
        if (!type || !applicantName) {
            return res.status(400).json({ message: 'Type and applicant name are required' });
        }
        // In production, you would save to MongoDB
        // For now, we'll use the mock data
        const newCertificate = {
            _id: (certificates.length + 1).toString(),
            id: (certificates.length + 1).toString(),
            userId, // Add userId
            type,
            certificateType: type,
            applicantName,
            fatherName,
            motherName,
            date,
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
            status: 'Approved',
            certificateNumber: `${type.substring(0, 1).toUpperCase()}C-2025-${(certificates.length + 1).toString().padStart(3, '0')}`,
            issuedDate: new Date().toISOString().split('T')[0]
        };
        certificates.push(newCertificate);
        res.status(201).json({
            success: true,
            applicationId: newCertificate.id,
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
// Get certificate preview data
const getCertificatePreview = async (req, res) => {
    try {
        const { id } = req.params;
        const certificate = certificates.find(cert => cert.id === id);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        // Return certificate with both _id and id for compatibility
        res.json({
            ...certificate,
            _id: certificate._id || certificate.id
        });
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
        const certificateIndex = certificates.findIndex(cert => cert.id === id);
        if (certificateIndex === -1) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        // Ensure _id is preserved
        certificates[certificateIndex] = {
            ...certificates[certificateIndex],
            ...updates,
            _id: certificates[certificateIndex]._id || certificates[certificateIndex].id
        };
        res.json(certificates[certificateIndex]);
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
        const certificate = certificates.find(cert => cert.id === id);
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
        const certificate = certificates.find(cert => cert.id === id);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        // For demo purposes, allow download of all certificates
        // In production, you might want to check status
        // if (certificate.status !== 'Approved') {
        //   return res.status(400).json({ message: 'Certificate not approved yet' });
        // }
        // Emit event for real-time dashboard update if userId exists
        if (certificate.userId) {
            (0, socket_1.emitApplicationUpdate)(certificate.userId, certificate.id, 'Certificates', certificate.status, `Certificate downloaded in ${format || 'PDF'} format`);
        }
        // Generate certificate filename
        const fileName = `${certificate.type.replace(/\s+/g, '_')}_${certificate.id}`;
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
            // Generate PDF certificate
            const doc = new pdfkit_1.default({
                size: 'A4',
                margin: 50
            });
            // Create buffer to store PDF
            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(chunks);
                res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
                res.setHeader('Content-Type', 'application/pdf');
                res.send(pdfBuffer);
            });
            // Add header with panchayat info
            doc.fillColor('#000000');
            doc.fontSize(20);
            doc.text('Digital E-Panchayat', 50, 50, { align: 'center' });
            doc.fontSize(16);
            doc.text(`${certificate.type}`, 50, 80, { align: 'center' });
            doc.moveDown();
            // Add horizontal line
            doc.moveTo(50, 110).lineTo(550, 110).stroke();
            doc.moveDown();
            // Certificate details
            doc.fontSize(12);
            doc.text(`Certificate ID: ${certificate.id}`);
            doc.text(`Applicant Name: ${certificate.applicantName}`);
            if (certificate.fatherName) {
                doc.text(`Father/Husband Name: ${certificate.fatherName}`);
            }
            if (certificate.motherName) {
                doc.text(`Mother Name: ${certificate.motherName}`);
            }
            if (certificate.date) {
                doc.text(`Date: ${certificate.date}`);
            }
            if (certificate.place) {
                doc.text(`Place: ${certificate.place}`);
            }
            if (certificate.address) {
                doc.text(`Address: ${certificate.address}`);
            }
            if (certificate.income) {
                doc.text(`Income: ${certificate.income}`);
            }
            if (certificate.caste) {
                doc.text(`Caste: ${certificate.caste}`);
                if (certificate.subCaste) {
                    doc.text(`Sub-Caste: ${certificate.subCaste}`);
                }
            }
            if (certificate.ward) {
                doc.text(`Ward: ${certificate.ward}`);
            }
            if (certificate.village) {
                doc.text(`Village: ${certificate.village}`);
            }
            if (certificate.district) {
                doc.text(`District: ${certificate.district}`);
            }
            doc.text(`Certificate Number: ${certificate.certificateNumber || 'N/A'}`);
            doc.text(`Issued Date: ${certificate.issuedDate || new Date().toISOString().split('T')[0]}`);
            doc.text(`Status: ${certificate.status}`);
            doc.moveDown();
            // Add footer with disclaimer
            const footerY = 750;
            doc.moveTo(50, footerY - 20).lineTo(550, footerY - 20).stroke();
            doc.fontSize(8);
            doc.text('This is a computer-generated document. No signature required.', 50, footerY);
            doc.text('Valid digitally as per the provisions of the Digital Signature Act, 2000.', 50, footerY + 15);
            doc.end();
        }
    }
    catch (error) {
        console.error('Error downloading certificate:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.downloadCertificate = downloadCertificate;
