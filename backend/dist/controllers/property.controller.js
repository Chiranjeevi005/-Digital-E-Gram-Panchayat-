"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadMutationAcknowledgement = exports.getMutationStatus = exports.downloadPropertyTaxReceipt = exports.getPropertyTax = exports.generatePropertyJPG = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const sharp_1 = __importDefault(require("sharp"));
const socket_1 = require("../utils/socket"); // Import socket utility
// In-memory storage for demo purposes when MongoDB is not available
const inMemoryProperties = new Map();
const inMemoryMutations = new Map();
// Create directories if they don't exist
const UPLOAD_DIR = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
// Helper function to generate a mock ID
const generateMockId = () => {
    return 'PROP-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
};
// Generate a PDF document with professional design
const generatePropertyPDF = async (data, type, id) => {
    return new Promise((resolve, reject) => {
        try {
            let fileName = '';
            let title = '';
            switch (type) {
                case 'propertyTax':
                    fileName = `property-tax-receipt-${data.propertyId}.pdf`;
                    title = 'Property Tax Receipt';
                    break;
                case 'mutation':
                    fileName = `mutation-status-${data.applicationId}.pdf`;
                    title = 'Mutation Application Acknowledgement';
                    break;
            }
            const filePath = path_1.default.join(UPLOAD_DIR, fileName);
            // Create a document with A4 size and specified margins
            const doc = new pdfkit_1.default({
                size: 'A4',
                margin: 30
            });
            // Pipe its output to a file
            doc.pipe(fs_1.default.createWriteStream(filePath));
            // Set off-white background for better contrast
            doc.save();
            doc.rect(0, 0, doc.page.width, doc.page.height).fill('#F9FAFB');
            doc.restore();
            // Add watermark diagonally across the page
            doc.save();
            doc.fontSize(40);
            doc.fillColor('#D1D5DB'); // Darker watermark color for better visibility
            doc.opacity(0.15);
            doc.font('Times-Roman');
            doc.rotate(45, { origin: [doc.page.width / 2, doc.page.height / 2] });
            doc.text('DIGITAL E-PANCHAYAT', 0, doc.page.height / 2 - 20, {
                width: doc.page.width,
                align: 'center'
            });
            doc.rotate(-45, { origin: [doc.page.width / 2, doc.page.height / 2] }); // Reset rotation
            doc.opacity(1);
            doc.restore();
            if (type === 'propertyTax') {
                // Property Tax Receipt template
                // Header
                doc.fontSize(16);
                doc.fillColor('#111827'); // Darker professional color
                doc.font('Times-Roman');
                // Panchayat logo left
                doc.text('🏛', 40, 40);
                // "Property Tax Receipt" centered
                doc.font('Helvetica-Bold');
                doc.fillColor('#1F2937'); // Darker color for better visibility
                doc.text('Property Tax Receipt', 0, 40, { width: doc.page.width, align: 'center' });
                // Panchayat address right
                doc.fontSize(10);
                doc.font('Times-Roman');
                doc.fillColor('#374151'); // Darker color for better visibility
                doc.text('Digital E-Panchayat', doc.page.width - 150, 40, { width: 110, align: 'right' });
                doc.text('Village A, Taluk B', doc.page.width - 150, 55, { width: 110, align: 'right' });
                doc.text('District C, State D', doc.page.width - 150, 70, { width: 110, align: 'right' });
                // Subheading
                doc.fontSize(12);
                doc.text('Issued by Digital E-Panchayat – Village Governance System', 0, 90, { width: doc.page.width, align: 'center' });
                // Horizontal line separator
                doc.moveTo(30, 110)
                    .lineTo(doc.page.width - 30, 110)
                    .stroke('#1F2937'); // Darker professional line
                // Property Information Section
                let startY = 130;
                const lineHeight = 18;
                doc.fontSize(14);
                doc.font('Helvetica-Bold');
                doc.fillColor('#111827'); // Darker professional color
                doc.text('Property Information', 30, startY);
                startY += 25;
                doc.fontSize(12);
                doc.font('Times-Roman');
                doc.fillColor('#1F2937'); // Darker professional text
                // Property ID / Holding Number
                doc.text('Property ID / Holding Number:', 40, startY);
                doc.font('Helvetica');
                doc.text(data.propertyId || 'N/A', 250, startY);
                doc.font('Times-Roman');
                startY += lineHeight;
                // Owner Name
                doc.text('Owner Name:', 40, startY);
                doc.font('Helvetica');
                doc.text(data.ownerName || 'N/A', 250, startY);
                doc.font('Times-Roman');
                startY += lineHeight;
                // Address (Village / Ward / Taluk / District / State)
                doc.text('Address:', 40, startY);
                doc.font('Helvetica');
                doc.text(`${data.village || 'N/A'}, Ward, Taluk, District, State`, 250, startY);
                doc.font('Times-Roman');
                startY += lineHeight;
                // Property Type (Residential / Commercial)
                doc.text('Property Type:', 40, startY);
                doc.font('Helvetica');
                doc.text('Residential', 250, startY);
                doc.font('Times-Roman');
                startY += lineHeight + 15;
                // Tax Details Section
                doc.fontSize(14);
                doc.font('Helvetica-Bold');
                doc.fillColor('#111827'); // Darker professional color
                doc.text('Tax Details', 30, startY);
                startY += 25;
                doc.fontSize(12);
                doc.font('Times-Roman');
                doc.fillColor('#1F2937'); // Darker professional text
                // Assessment Year
                doc.text('Assessment Year:', 40, startY);
                doc.font('Helvetica');
                doc.text('2025-2026', 250, startY);
                doc.font('Times-Roman');
                startY += lineHeight;
                // Tax Amount: ₹0 (bold green)
                doc.text('Tax Amount:', 40, startY);
                doc.fillColor('#047857'); // Darker green
                doc.font('Helvetica-Bold');
                doc.text('₹0', 250, startY);
                doc.fillColor('#000000'); // Back to black
                doc.font('Times-Roman');
                startY += lineHeight;
                // Exemptions (if any)
                doc.text('Exemptions:', 40, startY);
                doc.text('None', 250, startY);
                startY += lineHeight;
                // Payment Status: Exempted – Digital Service (No Fees)
                doc.text('Payment Status:', 40, startY);
                doc.text('Exempted – Digital Service (No Fees)', 250, startY);
                startY += lineHeight + 20;
                // Acknowledgement Section
                doc.fontSize(14);
                doc.font('Helvetica-Bold');
                doc.fillColor('#111827'); // Darker professional color
                doc.text('Acknowledgement', 30, startY);
                startY += 25;
                doc.fontSize(12);
                doc.font('Times-Roman');
                doc.fillColor('#1F2937'); // Darker professional text
                // Receipt Number (auto-generated)
                doc.text('Receipt Number:', 40, startY);
                doc.font('Helvetica');
                doc.text(`PTR-${Date.now().toString(36).toUpperCase()}`, 250, startY);
                doc.font('Times-Roman');
                startY += lineHeight;
                // Issue Date
                doc.text('Issue Date:', 40, startY);
                doc.font('Helvetica');
                doc.text(new Date().toLocaleDateString(), 250, startY);
                doc.font('Times-Roman');
                startY += lineHeight;
                // Issuing Authority
                doc.text('Issuing Authority:', 40, startY);
                doc.text('Digital E-Panchayat', 250, startY);
                startY += lineHeight + 20;
                // Footer Note
                doc.fontSize(10);
                doc.fillColor('#374151'); // Darker color for better visibility
                doc.text('This is a computer-generated receipt and does not require a physical signature.', 0, startY, { width: doc.page.width, align: 'center' });
                startY += 15;
                doc.text('For any queries, contact the Village Panchayat Office.', 0, startY, { width: doc.page.width, align: 'center' });
                // Finalize the PDF document
                doc.end();
                // Resolve with the file name when the document is finished
                doc.on('end', () => {
                    resolve(fileName);
                });
                // Handle errors
                doc.on('error', (err) => {
                    reject(err);
                });
            }
            else if (type === 'mutation') {
                // Mutation Application Acknowledgement template
                // Header
                doc.fontSize(16);
                doc.fillColor('#111827'); // Darker professional color
                doc.font('Times-Roman');
                // Panchayat logo left
                doc.text('🏛', 40, 40);
                // "Mutation Application Acknowledgement" centered
                doc.font('Helvetica-Bold');
                doc.fillColor('#1F2937'); // Darker color for better visibility
                doc.text('Mutation Application Acknowledgement', 0, 40, { width: doc.page.width, align: 'center' });
                // Panchayat address right
                doc.fontSize(10);
                doc.font('Times-Roman');
                doc.fillColor('#374151'); // Darker color for better visibility
                doc.text('Digital E-Panchayat', doc.page.width - 150, 40, { width: 110, align: 'right' });
                doc.text('Village A, Taluk B', doc.page.width - 150, 55, { width: 110, align: 'right' });
                doc.text('District C, State D', doc.page.width - 150, 70, { width: 110, align: 'right' });
                // Subheading
                doc.fontSize(12);
                doc.text('Issued by Digital E-Panchayat – Village Governance System', 0, 90, { width: doc.page.width, align: 'center' });
                // Horizontal line separator
                doc.moveTo(30, 110)
                    .lineTo(doc.page.width - 30, 110)
                    .stroke('#1F2937'); // Darker professional line
                // Application Information Section
                let startY = 130;
                const lineHeight = 18;
                doc.fontSize(14);
                doc.font('Helvetica-Bold');
                doc.fillColor('#111827'); // Darker professional color
                doc.text('Application Information', 30, startY);
                startY += 25;
                doc.fontSize(12);
                doc.font('Times-Roman');
                doc.fillColor('#1F2937'); // Darker professional text
                // Application ID
                doc.text('Application ID:', 40, startY);
                doc.font('Helvetica');
                doc.text(data.applicationId || 'N/A', 250, startY);
                doc.font('Times-Roman');
                startY += lineHeight;
                // Property ID / Holding Number
                doc.text('Property ID / Holding Number:', 40, startY);
                doc.font('Helvetica');
                doc.text(data.propertyId || 'N/A', 250, startY);
                doc.font('Times-Roman');
                startY += lineHeight + 15;
                // Status Timeline Section
                doc.fontSize(14);
                doc.font('Helvetica-Bold');
                doc.fillColor('#111827'); // Darker professional color
                doc.text('Status Timeline', 30, startY);
                startY += 25;
                doc.fontSize(12);
                doc.font('Times-Roman');
                doc.fillColor('#1F2937'); // Darker professional text
                // Status timeline entries
                if (data.statusTimeline && Array.isArray(data.statusTimeline)) {
                    data.statusTimeline.forEach((step, index) => {
                        doc.text(`${index + 1}. ${step.step}:`, 40, startY);
                        doc.font('Helvetica');
                        doc.text(`${step.status} (${new Date(step.date).toLocaleDateString()})`, 250, startY);
                        doc.font('Times-Roman');
                        startY += lineHeight;
                    });
                }
                startY += 15;
                // Acknowledgement Section
                doc.fontSize(14);
                doc.font('Helvetica-Bold');
                doc.fillColor('#111827'); // Darker professional color
                doc.text('Acknowledgement', 30, startY);
                startY += 25;
                doc.fontSize(12);
                doc.font('Times-Roman');
                doc.fillColor('#1F2937'); // Darker professional text
                // Acknowledgement text
                doc.text('This document serves as an official acknowledgement of your mutation application.', 40, startY, { width: doc.page.width - 80 });
                startY += lineHeight;
                doc.text('Please keep this document for your records and future reference.', 40, startY, { width: doc.page.width - 80 });
                startY += lineHeight + 20;
                // Footer Note
                doc.fontSize(10);
                doc.fillColor('#374151'); // Darker color for better visibility
                doc.text('This is a computer-generated document and does not require a physical signature.', 0, startY, { width: doc.page.width, align: 'center' });
                startY += 15;
                doc.text('For any queries, contact the Village Panchayat Office.', 0, startY, { width: doc.page.width, align: 'center' });
                // Finalize the PDF document
                doc.end();
                // Resolve with the file name when the document is finished
                doc.on('end', () => {
                    resolve(fileName);
                });
                // Handle errors
                doc.on('error', (err) => {
                    reject(err);
                });
            }
        }
        catch (error) {
            reject(error);
        }
    });
};
// Generate a JPG document directly (without PDF conversion)
const generatePropertyJPG = async (data, type, id) => {
    try {
        const fileName = `${type === 'propertyTax' ? 'property-tax-receipt' : 'mutation-status'}-${id || data.propertyId || data.applicationId}.jpg`;
        const jpgPath = path_1.default.join(UPLOAD_DIR, fileName);
        // Create a professional JPG image directly using sharp (following the same pattern as Land Records)
        const svgContent = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#F9FAFB"/>
        <text x="400" y="100" font-family="Arial" font-size="36" fill="#1E3A8A" font-weight="bold" text-anchor="middle">
          ${type === 'propertyTax' ? 'PROPERTY TAX RECEIPT' : 'MUTATION ACKNOWLEDGEMENT'}
        </text>
        <text x="400" y="150" font-family="Arial" font-size="18" fill="#1F2937" text-anchor="middle">
          Digital E-Panchayat - Village Governance System
        </text>
        <text x="400" y="200" font-family="Arial" font-size="16" fill="#1F2937" text-anchor="middle">
          ${type === 'propertyTax' ? `Property ID: ${data.propertyId || 'N/A'}` : `Application ID: ${data.applicationId || 'N/A'}`}
        </text>
        <text x="400" y="230" font-family="Arial" font-size="16" fill="#1F2937" text-anchor="middle">
          Owner: ${data.ownerName || 'N/A'}
        </text>
        <text x="400" y="260" font-family="Arial" font-size="16" fill="#1F2937" text-anchor="middle">
          ${type === 'propertyTax' ? `Village: ${data.village || 'N/A'}` : `Property ID: ${data.propertyId || 'N/A'}`}
        </text>
        <text x="400" y="310" font-family="Arial" font-size="14" fill="#4B5563" text-anchor="middle">
          Generated on: ${new Date().toLocaleDateString()}
        </text>
        <text x="400" y="360" font-family="Arial" font-size="12" fill="#6B7280" text-anchor="middle">
          This document is valid and can be used for official purposes
        </text>
        <text x="400" y="500" font-family="Arial" font-size="10" fill="#9CA3AF" text-anchor="middle">
          Digital E-Panchayat System - Village Governance
        </text>
      </svg>`;
        // Create the JPG image
        await (0, sharp_1.default)({
            create: {
                width: 800,
                height: 600,
                channels: 3,
                background: { r: 249, g: 250, b: 251 } // Light gray background
            }
        })
            .jpeg({ quality: 95 })
            .toBuffer()
            .then(buffer => (0, sharp_1.default)(buffer)
            .composite([
            {
                input: Buffer.from(svgContent),
                top: 0,
                left: 0
            }
        ])
            .jpeg({ quality: 95 })
            .toFile(jpgPath));
        return fileName;
    }
    catch (error) {
        console.error('Error generating JPG:', error);
        // Create a fallback placeholder image with professional content
        const fileName = `${type === 'propertyTax' ? 'property-tax-receipt' : 'mutation-status'}-${id || data.propertyId || data.applicationId || 'unknown'}-error.jpg`;
        const jpgPath = path_1.default.join(UPLOAD_DIR, fileName);
        const errorSvgContent = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#F9FAFB"/>
        <text x="400" y="100" font-family="Arial" font-size="36" fill="#1E3A8A" font-weight="bold" text-anchor="middle">
          ${type === 'propertyTax' ? 'PROPERTY TAX RECEIPT' : 'MUTATION ACKNOWLEDGEMENT'}
        </text>
        <text x="400" y="150" font-family="Arial" font-size="18" fill="#1F2937" text-anchor="middle">
          Digital E-Panchayat - Village Governance System
        </text>
        <text x="400" y="200" font-family="Arial" font-size="16" fill="#EF4444" text-anchor="middle">
          Document could not be generated properly
        </text>
        <text x="400" y="230" font-family="Arial" font-size="14" fill="#1F2937" text-anchor="middle">
          Please contact support for assistance
        </text>
        <text x="400" y="300" font-family="Arial" font-size="12" fill="#4B5563" text-anchor="middle">
          Generated on: ${new Date().toLocaleDateString()}
        </text>
        <text x="400" y="350" font-family="Arial" font-size="10" fill="#6B7280" text-anchor="middle">
          Digital E-Panchayat System - Village Governance
        </text>
      </svg>`;
        await (0, sharp_1.default)({
            create: {
                width: 800,
                height: 600,
                channels: 3,
                background: { r: 249, g: 250, b: 251 } // Light gray background
            }
        })
            .jpeg({ quality: 95 })
            .toBuffer()
            .then(buffer => (0, sharp_1.default)(buffer)
            .composite([
            {
                input: Buffer.from(errorSvgContent),
                top: 0,
                left: 0
            }
        ])
            .jpeg({ quality: 95 })
            .toFile(jpgPath));
        return fileName;
    }
};
exports.generatePropertyJPG = generatePropertyJPG;
// Property Tax Controller
const getPropertyTax = async (req, res) => {
    try {
        const { propertyId, ownerName, village } = req.body;
        // Validate required fields
        if (!propertyId || !ownerName || !village) {
            return res.status(400).json({
                success: false,
                message: 'Property ID, owner name, and village are required'
            });
        }
        // Validate that propertyId is a string
        if (typeof propertyId !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Property ID must be a valid text'
            });
        }
        // Validate that ownerName is a string
        if (typeof ownerName !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Owner name must be a valid text'
            });
        }
        // Validate that village is a string
        if (typeof village !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Village must be a valid text'
            });
        }
        // Create mock property tax data
        const propertyTaxData = {
            propertyId,
            ownerName,
            village,
            taxDue: 0, // Digital service - no fees
            status: 'Paid',
            createdAt: new Date()
        };
        // Save to in-memory storage
        inMemoryProperties.set(propertyId, propertyTaxData);
        // Emit real-time update (assuming ownerName is the citizenId)
        (0, socket_1.emitApplicationUpdate)(ownerName, // Using ownerName as citizenId for demo purposes
        propertyId, 'Property Tax', propertyTaxData.status, `Property tax receipt generated for ${propertyId}`);
        res.status(200).json({
            success: true,
            ...propertyTaxData
        });
    }
    catch (error) {
        console.error('Error fetching property tax:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};
exports.getPropertyTax = getPropertyTax;
// Download Property Tax Receipt
const downloadPropertyTaxReceipt = async (req, res) => {
    try {
        const { id } = req.params;
        const { format } = req.query; // 'pdf' or 'jpg'
        // Try to get from in-memory storage
        let propertyData = inMemoryProperties.get(id);
        // If not found in in-memory storage, create minimal data to prevent errors
        if (!propertyData) {
            propertyData = {
                propertyId: id,
                ownerName: 'Unknown Owner',
                village: 'Unknown Village',
                taxDue: 0,
                status: 'Unknown',
                createdAt: new Date()
            };
            // Save this minimal data to prevent repeated errors
            inMemoryProperties.set(id, propertyData);
        }
        // For PDF format
        if (format === 'pdf' || !format) {
            const fileName = `property-tax-receipt-${id || propertyData.propertyId}.pdf`;
            const filePath = path_1.default.join(UPLOAD_DIR, fileName);
            // Check if file exists, if not regenerate it
            if (!fs_1.default.existsSync(filePath)) {
                await generatePropertyPDF(propertyData, 'propertyTax', id);
            }
            if (!fs_1.default.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: 'Property tax receipt not found'
                });
            }
            // Emit real-time update (assuming ownerName is the citizenId)
            (0, socket_1.emitApplicationUpdate)(propertyData.ownerName, // Using ownerName as citizenId for demo purposes
            id, 'Property Tax', propertyData.status, `Property tax receipt downloaded in PDF format`);
            // Set appropriate headers for PDF download
            res.setHeader('Content-Disposition', `inline; filename="property-tax-receipt.pdf"`);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Length', fs_1.default.statSync(filePath).size);
            // Send the file
            res.sendFile(filePath);
            return;
        }
        // JPG format is not supported for property tax receipts
        if (format === 'jpg') {
            return res.status(400).json({
                success: false,
                message: 'JPG format is not supported for property tax receipts. Please download the PDF version instead.'
            });
        }
        // If format is not supported
        return res.status(400).json({
            success: false,
            message: 'Unsupported format. Use pdf or jpg.'
        });
    }
    catch (error) {
        console.error('Error downloading property tax receipt:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};
exports.downloadPropertyTaxReceipt = downloadPropertyTaxReceipt;
// Mutation Status Controller
const getMutationStatus = async (req, res) => {
    try {
        const { applicationId } = req.body;
        // Validate required fields
        if (!applicationId) {
            return res.status(400).json({
                success: false,
                message: 'Application ID is required'
            });
        }
        // Create mock mutation status data
        const mutationStatusData = {
            applicationId,
            propertyId: 'PROP-2023-001',
            statusTimeline: [
                { step: 'Submitted', status: 'Completed', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
                { step: 'Verification', status: 'Completed', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
                { step: 'Officer Approval', status: 'In Progress', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
                { step: 'Completed', status: 'Pending', date: new Date() }
            ],
            createdAt: new Date()
        };
        // Save to in-memory storage
        inMemoryMutations.set(applicationId, mutationStatusData);
        // Emit real-time update (assuming applicationId contains citizen info)
        (0, socket_1.emitApplicationUpdate)(applicationId, // Using applicationId as citizenId for demo purposes
        applicationId, 'Mutation', 'In Progress', `Mutation application status updated`);
        res.status(200).json({
            success: true,
            ...mutationStatusData
        });
    }
    catch (error) {
        console.error('Error fetching mutation status:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};
exports.getMutationStatus = getMutationStatus;
// Download Mutation Acknowledgement
const downloadMutationAcknowledgement = async (req, res) => {
    try {
        const { id } = req.params;
        const { format } = req.query; // 'pdf' or 'jpg'
        console.log('Attempting to download mutation status for ID:', id);
        console.log('Available mutation IDs in memory:', Array.from(inMemoryMutations.keys()));
        // Try to get from in-memory storage
        let mutationData = inMemoryMutations.get(id);
        console.log('Found mutation data:', mutationData);
        // If not found in in-memory storage, create minimal data to prevent errors
        if (!mutationData) {
            console.log('Mutation data not found, creating minimal data');
            mutationData = {
                applicationId: id,
                propertyId: 'Unknown Property',
                statusTimeline: [
                    { step: 'Submitted', status: 'Completed', date: new Date().toISOString() },
                    { step: 'Verification', status: 'In Progress', date: new Date().toISOString() }
                ],
                createdAt: new Date()
            };
            // Save this minimal data to prevent repeated errors
            inMemoryMutations.set(id, mutationData);
            console.log('Created and stored minimal mutation data');
        }
        // For PDF format
        if (format === 'pdf' || !format) {
            const fileName = `mutation-status-${id || mutationData.applicationId}.pdf`;
            const filePath = path_1.default.join(UPLOAD_DIR, fileName);
            // Check if file exists, if not regenerate it
            if (!fs_1.default.existsSync(filePath)) {
                await generatePropertyPDF(mutationData, 'mutation', id);
            }
            if (!fs_1.default.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: 'Mutation acknowledgement not found'
                });
            }
            // Emit real-time update (assuming applicationId contains citizen info)
            (0, socket_1.emitApplicationUpdate)(mutationData.applicationId, // Using applicationId as citizenId for demo purposes
            id, 'Mutation', 'Completed', `Mutation acknowledgement downloaded in PDF format`);
            // Set appropriate headers for PDF download
            res.setHeader('Content-Disposition', `inline; filename="mutation-status.pdf"`);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Length', fs_1.default.statSync(filePath).size);
            // Send the file
            res.sendFile(filePath);
            return;
        }
        // JPG format is not supported for mutation status
        if (format === 'jpg') {
            return res.status(400).json({
                success: false,
                message: 'JPG format is not supported for mutation status. Please download the PDF version instead.'
            });
        }
        // If format is not supported
        return res.status(400).json({
            success: false,
            message: 'Unsupported format. Use pdf or jpg.'
        });
    }
    catch (error) {
        console.error('Error downloading mutation acknowledgement:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};
exports.downloadMutationAcknowledgement = downloadMutationAcknowledgement;
