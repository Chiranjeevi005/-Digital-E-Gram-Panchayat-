import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import sharp from 'sharp';
const pdf = require('pdf-poppler');

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Function to add header with logo and panchayat info
const addDocumentHeader = (doc: PDFKit.PDFDocument, title: string) => {
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
const addDocumentFooter = (doc: PDFKit.PDFDocument) => {
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
export const generateSchemeAcknowledgmentPDF = async (applicationData: any) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });
      
      const fileName = `scheme-application-${applicationData._id}.pdf`;
      const filePath = path.join(uploadsDir, fileName);
      
      // Create write stream
      const writeStream = fs.createWriteStream(filePath);
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
    } catch (error) {
      reject(error);
    }
  });
};

// Function to generate grievance acknowledgment PDF
export const generateGrievanceAcknowledgmentPDF = async (grievanceData: any) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });
      
      const fileName = `grievance-acknowledgement-${grievanceData._id}.pdf`;
      const filePath = path.join(uploadsDir, fileName);
      
      // Create write stream
      const writeStream = fs.createWriteStream(filePath);
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
    } catch (error) {
      reject(error);
    }
  });
};

// Function to generate grievance resolution PDF
export const generateGrievanceResolutionPDF = async (grievanceData: any) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });
      
      const fileName = `grievance-resolution-${grievanceData._id}.pdf`;
      const filePath = path.join(uploadsDir, fileName);
      
      // Create write stream
      const writeStream = fs.createWriteStream(filePath);
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
    } catch (error) {
      reject(error);
    }
  });
};

// Function to generate certificate PDF
export const generateCertificatePDF = async (certificateData: any, fileName: string): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const filePath = path.join(uploadsDir, `${fileName}.pdf`);
      
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });
      
      // Create write stream
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);
      
      // Use basic fonts to avoid potential issues
      doc.font('Helvetica');
      
      // Add header with panchayat info
      doc.fillColor('#000000');
      doc.fontSize(20);
      doc.text('Digital E-Panchayat', 0, 50, { align: 'center' });
      doc.fontSize(16);
      doc.text(`${certificateData.type}`, 0, 80, { align: 'center' });
      doc.moveDown();
      
      // Add horizontal line using simple rectangle
      doc.rect(50, 110, 500, 1).fill('#000000');
      doc.moveDown(2);
      
      // Certificate details with simpler formatting
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
      doc.moveDown(2);
      
      // Add footer with disclaimer using simpler approach
      const footerY = 750;
      doc.rect(50, footerY - 20, 500, 1).fill('#000000');
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
    } catch (error) {
      reject(error);
    }
  });
};

// Function to convert PDF to JPG
export const convertPDFToJPG = async (pdfPath: string, filename: string): Promise<string> => {
  const jpgPath = path.join(uploadsDir, filename.replace('.pdf', '.jpg'));
  
  try {
    // First, let's check if the PDF file exists and is valid
    if (!fs.existsSync(pdfPath)) {
      throw new Error('PDF file does not exist');
    }
    
    // Try using pdf-poppler first as it's more reliable for PDF conversion
    try {
      const opts = {
        format: 'jpeg',
        out_dir: uploadsDir,
        out_prefix: filename.replace('.pdf', ''),
        page: 1
      };
      
      await pdf.convert(pdfPath, opts);
      
      // pdf-poppler saves as {prefix}-1.jpg, so we need to rename it
      const generatedPath = path.join(uploadsDir, `${filename.replace('.pdf', '')}-1.jpg`);
      if (fs.existsSync(generatedPath)) {
        fs.renameSync(generatedPath, jpgPath);
        return jpgPath;
      } else {
        throw new Error('PDF conversion failed - output file not found');
      }
    } catch (popplerError) {
      // Fallback to sharp with improved options
      await sharp(pdfPath, { 
        density: 150,
        failOnError: false
      })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .jpeg({ quality: 90 })
        .toFile(jpgPath);
      
      return jpgPath;
    }
  } catch (error: any) {
    // If direct conversion fails, try alternative approach
    try {
      // Alternative approach: Convert to PNG first, then to JPG
      const pngPath = pdfPath.replace('.pdf', '_temp.png');
      await sharp(pdfPath, { 
        density: 150,
        failOnError: false
      })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .png()
        .toFile(pngPath);
      
      // Then convert PNG to JPG
      await sharp(pngPath)
        .jpeg({ quality: 90 })
        .toFile(jpgPath);
      
      // Clean up temporary PNG file
      if (fs.existsSync(pngPath)) {
        fs.unlinkSync(pngPath);
      }
      
      return jpgPath;
    } catch (secondaryError: any) {
      throw new Error(`Error converting PDF to JPG: ${secondaryError.message}`);
    }
  }
};