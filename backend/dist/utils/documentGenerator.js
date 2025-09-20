"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPDFToJPG = exports.generateCertificatePDF = exports.generateGrievanceResolutionPDF = exports.generateGrievanceAcknowledgmentPDF = exports.generateSchemeAcknowledgmentPDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const sharp_1 = __importDefault(require("sharp"));
const writeFileAsync = (0, util_1.promisify)(fs_1.default.writeFile);
const mkdirAsync = (0, util_1.promisify)(fs_1.default.mkdir);
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Function to add header with logo and panchayat info
const addDocumentHeader = (doc, title) => {
    // Add panchayat emblem as watermark (30% opacity)
    doc.save();
    doc.fillColor('#000000', 0.3);
    doc.fontSize(60);
    doc.text('DIGITAL E-PANCHAYAT', 50, 200, {
        width: 500,
        align: 'center'
    });
    doc.restore();
    // Add header with title
    doc.fillColor('#000000');
    doc.fontSize(20);
    doc.text('Digital E-Panchayat', 50, 50, { align: 'center' });
    doc.fontSize(16);
    doc.text(title, 50, 80, { align: 'center' });
    doc.moveDown();
    // Add horizontal line
    doc.moveTo(50, 110).lineTo(550, 110).stroke();
    doc.moveDown();
};
// Function to add footer with disclaimer
const addDocumentFooter = (doc) => {
    const footerY = 750;
    // Add horizontal line
    doc.moveTo(50, footerY - 20).lineTo(550, footerY - 20).stroke();
    // Add disclaimer
    doc.fontSize(8);
    doc.text('This is a computer-generated document. No signature required.', 50, footerY);
    doc.text('Valid digitally as per the provisions of the Digital Signature Act, 2000.', 50, footerY + 15);
    // Add seal and signature placeholders
    doc.rect(450, footerY - 50, 100, 100).stroke();
    doc.fontSize(10);
    doc.text('Seal', 480, footerY - 30);
    doc.rect(450, footerY - 150, 100, 50).stroke();
    doc.text('Signature', 460, footerY - 130);
};
// Function to generate scheme acknowledgment PDF
const generateSchemeAcknowledgmentPDF = async (applicationData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new pdfkit_1.default({
                size: 'A4',
                margin: 50
            });
            const fileName = `scheme-application-${applicationData._id}.pdf`;
            const filePath = path_1.default.join(uploadsDir, fileName);
            // Create write stream
            const writeStream = fs_1.default.createWriteStream(filePath);
            doc.pipe(writeStream);
            // Add header
            addDocumentHeader(doc, 'Scheme Application Acknowledgment');
            // Application details
            doc.fontSize(12);
            doc.text(`Application ID: ${applicationData._id}`);
            doc.text(`Scheme: ${applicationData.schemeName}`);
            doc.text(`Date: ${new Date(applicationData.submittedAt).toLocaleDateString()}`);
            doc.moveDown();
            // Applicant details
            doc.fontSize(14);
            doc.text('Applicant Details:', { underline: true });
            doc.fontSize(12);
            doc.text(`Name: ${applicationData.applicantName}`);
            doc.text(`Father's Name: ${applicationData.fatherName}`);
            doc.text(`Address: ${applicationData.address}`);
            doc.text(`Phone: ${applicationData.phone}`);
            doc.text(`Email: ${applicationData.email}`);
            doc.text(`Aadhaar: ${applicationData.aadhaar || 'Not provided'}`);
            doc.text(`Age: ${applicationData.age || 'Not provided'}`);
            doc.text(`Gender: ${applicationData.gender || 'Not provided'}`);
            doc.moveDown();
            // Additional details
            doc.text(`Income: ${applicationData.income || 'Not provided'}`);
            doc.text(`Caste: ${applicationData.caste || 'Not provided'}`);
            doc.text(`Education: ${applicationData.education || 'Not provided'}`);
            doc.text(`Land Size: ${applicationData.landSize || 'Not provided'}`);
            doc.moveDown();
            // Add footer
            addDocumentFooter(doc);
            doc.end();
            writeStream.on('finish', () => {
                resolve();
            });
            writeStream.on('error', (err) => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.generateSchemeAcknowledgmentPDF = generateSchemeAcknowledgmentPDF;
// Function to generate grievance acknowledgment PDF
const generateGrievanceAcknowledgmentPDF = async (grievanceData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new pdfkit_1.default({
                size: 'A4',
                margin: 50
            });
            const fileName = `grievance-acknowledgement-${grievanceData._id}.pdf`;
            const filePath = path_1.default.join(uploadsDir, fileName);
            // Create write stream
            const writeStream = fs_1.default.createWriteStream(filePath);
            doc.pipe(writeStream);
            // Add header
            addDocumentHeader(doc, 'Grievance Acknowledgment');
            // Grievance details
            doc.fontSize(12);
            doc.text(`Grievance ID: ${grievanceData._id}`);
            doc.text(`Date: ${new Date(grievanceData.createdAt).toLocaleDateString()}`);
            doc.text(`Status: ${grievanceData.status}`);
            doc.moveDown();
            // Grievance details
            doc.fontSize(14);
            doc.text('Grievance Details:', { underline: true });
            doc.fontSize(12);
            doc.text(`Title: ${grievanceData.title}`);
            doc.text(`Category: ${grievanceData.category}`);
            doc.moveDown();
            // Description
            doc.text('Description:');
            doc.text(grievanceData.description, { width: 500 });
            doc.moveDown();
            // Citizen details
            doc.fontSize(14);
            doc.text('Citizen Details:', { underline: true });
            doc.fontSize(12);
            doc.text(`Name: ${grievanceData.name || 'Not provided'}`);
            doc.text(`Email: ${grievanceData.email || 'Not provided'}`);
            doc.text(`Phone: ${grievanceData.phone || 'Not provided'}`);
            doc.moveDown();
            // Add footer
            addDocumentFooter(doc);
            doc.end();
            writeStream.on('finish', () => {
                resolve();
            });
            writeStream.on('error', (err) => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.generateGrievanceAcknowledgmentPDF = generateGrievanceAcknowledgmentPDF;
// Function to generate grievance resolution PDF
const generateGrievanceResolutionPDF = async (grievanceData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new pdfkit_1.default({
                size: 'A4',
                margin: 50
            });
            const fileName = `grievance-resolution-${grievanceData._id}.pdf`;
            const filePath = path_1.default.join(uploadsDir, fileName);
            // Create write stream
            const writeStream = fs_1.default.createWriteStream(filePath);
            doc.pipe(writeStream);
            // Add header
            addDocumentHeader(doc, 'Grievance Resolution Certificate');
            // Resolution details
            doc.fontSize(12);
            doc.text(`Grievance ID: ${grievanceData._id}`);
            doc.text(`Date Filed: ${new Date(grievanceData.createdAt).toLocaleDateString()}`);
            doc.text(`Date Resolved: ${new Date(grievanceData.updatedAt).toLocaleDateString()}`);
            doc.text(`Status: ${grievanceData.status}`);
            doc.moveDown();
            // Grievance details
            doc.fontSize(14);
            doc.text('Grievance Details:', { underline: true });
            doc.fontSize(12);
            doc.text(`Title: ${grievanceData.title}`);
            doc.text(`Category: ${grievanceData.category}`);
            doc.moveDown();
            // Description
            doc.text('Description:');
            doc.text(grievanceData.description, { width: 500 });
            doc.moveDown();
            // Resolution remarks
            doc.fontSize(14);
            doc.text('Resolution Remarks:', { underline: true });
            doc.fontSize(12);
            doc.text(grievanceData.remarks || 'No remarks provided', { width: 500 });
            doc.moveDown();
            // Citizen details
            doc.fontSize(14);
            doc.text('Citizen Details:', { underline: true });
            doc.fontSize(12);
            doc.text(`Name: ${grievanceData.name || 'Not provided'}`);
            doc.text(`Email: ${grievanceData.email || 'Not provided'}`);
            doc.text(`Phone: ${grievanceData.phone || 'Not provided'}`);
            doc.moveDown();
            // Add footer
            addDocumentFooter(doc);
            doc.end();
            writeStream.on('finish', () => {
                resolve();
            });
            writeStream.on('error', (err) => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.generateGrievanceResolutionPDF = generateGrievanceResolutionPDF;
// Function to generate certificate PDF
const generateCertificatePDF = async (certificateData, fileName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const filePath = path_1.default.join(uploadsDir, `${fileName}.pdf`);
            const doc = new pdfkit_1.default({
                size: 'A4',
                margin: 50
            });
            // Create write stream
            const writeStream = fs_1.default.createWriteStream(filePath);
            doc.pipe(writeStream);
            // Add header with panchayat info
            doc.fillColor('#000000');
            doc.fontSize(20);
            doc.text('Digital E-Panchayat', 50, 50, { align: 'center' });
            doc.fontSize(16);
            doc.text(`${certificateData.type}`, 50, 80, { align: 'center' });
            doc.moveDown();
            // Add horizontal line
            doc.moveTo(50, 110).lineTo(550, 110).stroke();
            doc.moveDown();
            // Certificate details
            doc.fontSize(12);
            doc.text(`Certificate ID: ${certificateData.id}`);
            doc.text(`Applicant Name: ${certificateData.applicantName}`);
            if (certificateData.fatherName) {
                doc.text(`Father/Husband Name: ${certificateData.fatherName}`);
            }
            if (certificateData.motherName) {
                doc.text(`Mother Name: ${certificateData.motherName}`);
            }
            if (certificateData.date) {
                doc.text(`Date: ${certificateData.date}`);
            }
            if (certificateData.place) {
                doc.text(`Place: ${certificateData.place}`);
            }
            if (certificateData.address) {
                doc.text(`Address: ${certificateData.address}`);
            }
            if (certificateData.income) {
                doc.text(`Income: ${certificateData.income}`);
            }
            if (certificateData.caste) {
                doc.text(`Caste: ${certificateData.caste}`);
                if (certificateData.subCaste) {
                    doc.text(`Sub-Caste: ${certificateData.subCaste}`);
                }
            }
            if (certificateData.ward) {
                doc.text(`Ward: ${certificateData.ward}`);
            }
            if (certificateData.village) {
                doc.text(`Village: ${certificateData.village}`);
            }
            if (certificateData.district) {
                doc.text(`District: ${certificateData.district}`);
            }
            doc.text(`Certificate Number: ${certificateData.certificateNumber || 'N/A'}`);
            doc.text(`Issued Date: ${certificateData.issuedDate || new Date().toISOString().split('T')[0]}`);
            doc.text(`Status: ${certificateData.status}`);
            doc.moveDown();
            // Add footer with disclaimer
            const footerY = 750;
            doc.moveTo(50, footerY - 20).lineTo(550, footerY - 20).stroke();
            doc.fontSize(8);
            doc.text('This is a computer-generated document. No signature required.', 50, footerY);
            doc.text('Valid digitally as per the provisions of the Digital Signature Act, 2000.', 50, footerY + 15);
            doc.end();
            writeStream.on('finish', () => {
                resolve(filePath);
            });
            writeStream.on('error', (err) => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.generateCertificatePDF = generateCertificatePDF;
// Function to convert PDF to JPG
const convertPDFToJPG = async (pdfPath, filename) => {
    try {
        const jpgPath = path_1.default.join(uploadsDir, filename.replace('.pdf', '.jpg'));
        // Convert PDF to JPG using sharp
        await (0, sharp_1.default)(pdfPath, { density: 150 })
            .jpeg({ quality: 90 })
            .toFile(jpgPath);
        return jpgPath;
    }
    catch (error) {
        throw new Error(`Error converting PDF to JPG: ${error}`);
    }
};
exports.convertPDFToJPG = convertPDFToJPG;
