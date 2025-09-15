import { Request, Response } from 'express';
import CertificateApplication, { ICertificateApplication } from '../models/CertificateApplication';
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';  // Add sharp for JPG conversion
import mongoose from 'mongoose';

// In-memory storage for demo purposes when MongoDB is not available
const inMemoryApplications = new Map<string, any>();

// In-memory storage for demo purposes
// In production, use a proper file storage solution
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Create directories if they don't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Generate a PDF certificate with professional design (optimized for both mobile and desktop)
const generateCertificatePDF = async (application: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `certificate_${application._id}.pdf`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      
      // Create a document with A4 size
      const doc = new PDFDocument({
        size: 'A4',
        margin: 30
      });
      
      // Pipe its output to a file
      doc.pipe(fs.createWriteStream(filePath));
      
      // Set background color to match frontend
      doc.save();
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f0f9ff'); // Light blue background
      doc.restore();
      
      // Add elegant border/frame around page to match frontend
      doc.rect(10, 10, doc.page.width - 20, doc.page.height - 20).stroke('#1e40af'); // Dark blue border
      
      // Add watermark to match frontend
      doc.save();
      doc.fontSize(24);
      doc.fillColor('#dbeafe'); // Very light blue for watermark
      doc.text('Digital e-Gram Panchayat - Official', 0, doc.page.height / 2 - 10, {
        width: doc.page.width,
        align: 'center',
        oblique: true
      });
      doc.restore();
      
      // Add header with certificate title to match frontend
      doc.save();
      
      // Certificate title - Bold, Serif font
      doc.fontSize(28);
      doc.fillColor('#1e40af'); // Dark blue for headings
      doc.font('Helvetica-Bold');
      doc.text('CERTIFICATE', 0, 50, { width: doc.page.width, align: 'center' });
      
      doc.fontSize(18);
      doc.text(`OF ${application.certificateType.toUpperCase()}`, 0, 85, { width: doc.page.width, align: 'center' });
      
      // Add decorative line under title to match frontend
      doc.moveTo(60, 110)
         .lineTo(doc.page.width - 60, 110)
         .stroke('#1e40af');
      
      doc.restore();
      
      // Add content to the PDF with proper spacing (optimized for single page)
      doc.fontSize(10);
      doc.fillColor('#374151'); // Dark gray for body text
      doc.font('Helvetica');
      
      // Certificate body with clean, well-aligned fields
      const contentStartY = 130;
      
      // "This is to certify that" section
      doc.fontSize(11);
      doc.text('This is to certify that', 0, contentStartY, { width: doc.page.width, align: 'center' });
      
      // Applicant name - larger and bold
      doc.fontSize(16);
      doc.font('Helvetica-Bold');
      doc.text(application.applicantName, 0, contentStartY + 20, { width: doc.page.width, align: 'center' });
      
      // Parents' names if available
      if (application.fatherName || application.motherName) {
        let parentText = '';
        if (application.fatherName && application.motherName) {
          parentText = `Son/Daughter of ${application.fatherName} and ${application.motherName}`;
        } else if (application.fatherName) {
          parentText = `Son/Daughter of ${application.fatherName}`;
        } else if (application.motherName) {
          parentText = `Son/Daughter of ${application.motherName}`;
        }
        
        doc.fontSize(11);
        doc.font('Helvetica');
        doc.text(parentText, 0, contentStartY + 38, { width: doc.page.width, align: 'center' });
      }
      
      // Certificate event description
      const parentOffset = application.fatherName || application.motherName ? 18 : 0;
      doc.fontSize(11);
      doc.text(`was involved in a ${application.certificateType.toLowerCase()} event`, 0, contentStartY + 38 + parentOffset, { width: doc.page.width, align: 'center' });
      
      // Date and place information
      doc.fontSize(11);
      doc.text(`on ${new Date(application.date).toDateString()}`, 0, contentStartY + 56 + parentOffset, { width: doc.page.width, align: 'center' });
      doc.text(`at ${application.place}`, 0, contentStartY + 74 + parentOffset, { width: doc.page.width, align: 'center' });
      
      // Application ID and status
      doc.fontSize(9);
      doc.text(`Application ID: ${application._id}`, 0, contentStartY + 100 + parentOffset, { width: doc.page.width, align: 'center' });
      doc.text(`Status: ${application.status}`, 0, contentStartY + 115 + parentOffset, { width: doc.page.width, align: 'center' });
      
      // Add seal in bottom-right corner to match frontend
      const sealX = doc.page.width - 65;
      const sealY = doc.page.height - 100;
      
      // Draw circular seal
      doc.circle(sealX, sealY, 25).lineWidth(1.5).stroke('#92400e'); // Gold/brown color for seal
      doc.circle(sealX, sealY, 20).lineWidth(1).stroke('#92400e');
      
      // Seal text
      doc.fontSize(5);
      doc.fillColor('#92400e');
      doc.text('Digital e-Gram', sealX - 20, sealY - 10, { width: 40, align: 'center' });
      doc.text('Panchayat', sealX - 20, sealY - 6, { width: 40, align: 'center' });
      doc.text('Official', sealX - 20, sealY - 2, { width: 40, align: 'center' });
      doc.text('Seal', sealX - 20, sealY + 2, { width: 40, align: 'center' });
      
      // Add signature area in bottom-left corner to match frontend
      const signatureX = 60;
      const signatureY = doc.page.height - 85;
      
      doc.fontSize(7);
      doc.fillColor('#374151');
      doc.text('Generated by Digital e-Gram Panchayat', signatureX, signatureY - 25);
      
      // Draw signature line
      doc.moveTo(signatureX, signatureY - 12)
         .lineTo(signatureX + 100, signatureY - 12)
         .stroke('#374151');
      
      doc.text('Authorized Officer Signature', signatureX, signatureY);
      
      // Add official stamp text
      doc.fontSize(6);
      doc.text('Official Document', 0, doc.page.height - 25, { width: doc.page.width, align: 'center' });
      
      // Finalize PDF file
      doc.end();
      
      // Resolve with the file name when the document is finished
      doc.on('end', () => {
        resolve(fileName);
      });
      
      // Handle errors
      doc.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Generate a JPG certificate from PDF
const generateCertificateJPG = async (application: any): Promise<string> => {
  try {
    // First generate the PDF
    const pdfFileName = await generateCertificatePDF(application);
    const pdfPath = path.join(UPLOAD_DIR, pdfFileName);
    
    // Ensure the PDF file exists
    if (!fs.existsSync(pdfPath)) {
      throw new Error('PDF file was not generated successfully');
    }
    
    // Convert PDF to JPG
    const jpgFileName = `certificate_${application._id}.jpg`;
    const jpgPath = path.join(UPLOAD_DIR, jpgFileName);
    
    // Try to convert PDF to JPG using sharp
    try {
      const pdfBuffer = await fs.promises.readFile(pdfPath);
      await sharp(pdfBuffer, { 
        density: 300,
        pages: 1 // Only convert first page
      })
      .jpeg({ quality: 90 })
      .toFile(jpgPath);
    } catch (pdfConversionError) {
      // If PDF conversion fails, create a simple placeholder JPG
      console.warn('PDF to JPG conversion failed, creating placeholder image:', pdfConversionError);
      
      // Create a simple placeholder image with the same design as the PDF
      const placeholderBuffer = await sharp({
        create: {
          width: 800,
          height: 600,
          channels: 3,
          background: { r: 240, g: 249, b: 255 } // Light blue background
        }
      })
      .jpeg({ quality: 90 })
      .toBuffer();
      
      await sharp(placeholderBuffer)
        .composite([
          // Add text to the placeholder
          {
            input: Buffer.from(
              `<svg width="800" height="600">
                <rect x="20" y="20" width="760" height="560" fill="none" stroke="#1e40af" stroke-width="2"/>
                <text x="400" y="100" font-family="Arial" font-size="36" fill="#1e40af" text-anchor="middle">CERTIFICATE</text>
                <text x="400" y="150" font-family="Arial" font-size="24" fill="#1e40af" text-anchor="middle">OF ${application.certificateType.toUpperCase()}</text>
                <text x="400" y="250" font-family="Arial" font-size="20" fill="#374151" text-anchor="middle">${application.applicantName}</text>
                <text x="400" y="300" font-family="Arial" font-size="14" fill="#374151" text-anchor="middle">This is to certify that</text>
                <text x="400" y="350" font-family="Arial" font-size="14" fill="#374151" text-anchor="middle">was involved in a ${application.certificateType.toLowerCase()} event</text>
                <text x="400" y="400" font-family="Arial" font-size="14" fill="#374151" text-anchor="middle">on ${new Date(application.date).toDateString()} at ${application.place}</text>
                <text x="400" y="500" font-family="Arial" font-size="10" fill="#374151" text-anchor="middle">Generated by Digital e-Gram Panchayat</text>
                <text x="400" y="550" font-family="Arial" font-size="8" fill="#374151" text-anchor="middle">Official Document</text>
              </svg>`
            ),
            top: 0,
            left: 0
          }
        ])
        .jpeg({ quality: 90 })
        .toFile(jpgPath);
    }
    
    return jpgFileName;
  } catch (error) {
    console.error('Error generating JPG certificate:', error);
    throw error;
  }
};

// Helper function to generate a mock ID
const generateMockId = () => {
  return 'CRT-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

export const applyForCertificate = async (req: Request, res: Response) => {
  try {
    const { applicantName, fatherName, motherName, certificateType, date, place, supportingFiles, declaration } = req.body;
    
    // Validate required fields
    if (!applicantName || !certificateType || !date || !place) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be provided' 
      });
    }
    
    // Validate certificate type (only allow Birth and Death)
    const validCertificateTypes = ['Birth', 'Death'];
    if (!validCertificateTypes.includes(certificateType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid certificate type. Only Birth and Death certificates are available.' 
      });
    }
    
    // Validate that applicantName is a string
    if (typeof applicantName !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Applicant name must be a valid text' 
      });
    }
    
    // Validate that place is a string
    if (typeof place !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Place must be a valid text' 
      });
    }
    
    // Validate declaration
    if (!declaration) {
      return res.status(400).json({ 
        success: false, 
        message: 'You must declare that the information is correct' 
      });
    }
    
    // Create new certificate application
    const newApplication = {
      _id: generateMockId(),
      applicantName,
      fatherName,
      motherName,
      certificateType,
      date: new Date(date),
      place,
      supportingFiles: supportingFiles || [],
      status: 'Submitted',
      createdAt: new Date()
    };
    
    // Save to in-memory storage
    inMemoryApplications.set(newApplication._id, newApplication);
    
    // Update status to Ready
    newApplication.status = 'Ready';
    
    // Generate certificate file
    const certificateFile = await generateCertificatePDF(newApplication);
    
    res.status(201).json({
      success: true,
      message: 'Certificate application submitted successfully',
      applicationId: newApplication._id,
      status: newApplication.status,
      downloadUrl: `/api/certificates/${newApplication._id}/download`
    });
  } catch (error: any) {
    console.error('Error applying for certificate:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};

export const getCertificatePreview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Try to get from MongoDB first, then from in-memory storage
    let application = null;
    
    try {
      application = await CertificateApplication.findById(id);
    } catch (dbError) {
      // If MongoDB is not available, check in-memory storage
      application = inMemoryApplications.get(id);
    }
    
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Certificate application not found' 
      });
    }
    
    res.status(200).json(application);
  } catch (error: any) {
    console.error('Error fetching certificate preview:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};

export const updateCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Try to get from MongoDB first, then from in-memory storage
    let application = null;
    
    try {
      application = await CertificateApplication.findById(id);
      if (application) {
        // Update the application with new data
        Object.assign(application, updateData);
        // Save the updated application
        const updatedApplication = await application.save();
        application = updatedApplication;
      }
    } catch (dbError) {
      // If MongoDB is not available, check in-memory storage
      application = inMemoryApplications.get(id);
      if (application) {
        // Update the in-memory application
        Object.assign(application, updateData);
        inMemoryApplications.set(id, application);
      }
    }
    
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Certificate application not found' 
      });
    }
    
    // Regenerate the certificate file with updated data
    const certificateFile = await generateCertificatePDF(application);
    
    res.status(200).json(application);
  } catch (error: any) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};

export const getCertificateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Try to get from MongoDB first, then from in-memory storage
    let application = null;
    
    try {
      application = await CertificateApplication.findById(id);
    } catch (dbError) {
      // If MongoDB is not available, check in-memory storage
      application = inMemoryApplications.get(id);
    }
    
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Certificate application not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      applicationId: application._id,
      status: application.status,
      certificateType: application.certificateType,
      applicantName: application.applicantName,
      fatherName: application.fatherName,
      motherName: application.motherName,
      date: application.date,
      place: application.place
    });
  } catch (error: any) {
    console.error('Error fetching certificate status:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};

export const downloadCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { format } = req.query; // 'pdf' or 'jpg'
    
    // Try to get from MongoDB first, then from in-memory storage
    let application = null;
    
    try {
      application = await CertificateApplication.findById(id);
    } catch (dbError) {
      // If MongoDB is not available, check in-memory storage
      application = inMemoryApplications.get(id);
    }
    
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Certificate application not found' 
      });
    }
    
    if (application.status !== 'Ready') {
      return res.status(400).json({ 
        success: false, 
        message: 'Certificate is not ready for download' 
      });
    }
    
    // Create proper filename based on certificate type
    const fileNameBase = `${application.certificateType.toLowerCase()}-certificate`;
    
    // For PDF format
    if (format === 'pdf' || !format) {
      const fileName = `certificate_${id}.pdf`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      
      // Check if file exists, if not regenerate it
      if (!fs.existsSync(filePath)) {
        await generateCertificatePDF(application);
      }
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ 
          success: false, 
          message: 'Certificate file not found' 
        });
      }
      
      // Set appropriate headers for PDF download with proper filename
      res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.pdf"`);
      res.setHeader('Content-Type', 'application/pdf');
      
      // Send the file
      res.sendFile(filePath);
      return;
    }
    
    // For JPG format
    if (format === 'jpg') {
      try {
        const fileName = `certificate_${id}.jpg`;
        const filePath = path.join(UPLOAD_DIR, fileName);
        
        // Check if file exists, if not regenerate it
        if (!fs.existsSync(filePath)) {
          await generateCertificateJPG(application);
        }
        
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ 
            success: false, 
            message: 'Certificate file not found' 
          });
        }
        
        // Set appropriate headers for JPG download with proper filename
        res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.jpg"`);
        res.setHeader('Content-Type', 'image/jpeg');
        
        // Send the file
        res.sendFile(filePath);
        return;
      } catch (jpgError: any) {
        console.error('Error generating JPG certificate:', jpgError);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to generate JPG certificate: ' + (jpgError.message || 'Unknown error')
        });
      }
    }
    
    // If format is not supported
    return res.status(400).json({ 
      success: false, 
      message: 'Unsupported format. Use pdf or jpg.' 
    });
  } catch (error: any) {
    console.error('Error downloading certificate:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};