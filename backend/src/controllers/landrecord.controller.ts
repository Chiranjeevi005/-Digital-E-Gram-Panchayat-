import { Request, Response } from 'express';
import LandRecord, { ILandRecord } from '../models/LandRecord';
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import mongoose from 'mongoose';
import { emitApplicationUpdate } from '../utils/socket'; // Import socket utility

// In-memory storage for demo purposes when MongoDB is not available
const inMemoryLandRecords = new Map<string, any>();

// In-memory storage for demo purposes
// In production, use a proper file storage solution
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Create directories if they don't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Helper function to generate a mock ID
const generateMockId = () => {
  return 'LND-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Generate a PDF certificate with professional design (matching Birth/Death certificates)
const generateLandRecordCertificatePDF = async (landRecord: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `land-record-certificate-${landRecord._id}.pdf`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      
      // Create a document with A4 size
      const doc = new PDFDocument({
        size: 'A4',
        margin: 30
      });
      
      // Pipe its output to a file
      doc.pipe(fs.createWriteStream(filePath));
      
      // Set background color to match certificate style
      doc.save();
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f0f9ff'); // Light blue background
      doc.restore();
      
      // Add elegant border/frame around page
      doc.rect(10, 10, doc.page.width - 20, doc.page.height - 20).stroke('#1e40af'); // Dark blue border
      
      // Add watermark diagonally across the page (matching certificate style)
      doc.save();
      doc.fontSize(24);
      doc.fillColor('#dbeafe'); // Very light blue for watermark
      doc.rotate(45, { origin: [doc.page.width / 2, doc.page.height / 2] });
      doc.text('Digital e-Gram Panchayat - Official', 0, doc.page.height / 2 - 10, {
        width: doc.page.width,
        align: 'center',
        oblique: true
      });
      doc.rotate(-45, { origin: [doc.page.width / 2, doc.page.height / 2] }); // Reset rotation
      doc.restore();
      
      // Add header with certificate title
      doc.save();
      
      // Certificate title - Bold, Serif font
      doc.fontSize(28);
      doc.fillColor('#1e40af'); // Dark blue for headings
      doc.font('Helvetica-Bold');
      doc.text('LAND RECORD', 0, 50, { width: doc.page.width, align: 'center' });
      
      doc.fontSize(18);
      doc.text('CERTIFICATE', 0, 85, { width: doc.page.width, align: 'center' });
      
      // Add decorative line under title
      doc.moveTo(60, 110)
         .lineTo(doc.page.width - 60, 110)
         .stroke('#1e40af');
      
      doc.restore();
      
      // Add content to the PDF with proper spacing
      doc.fontSize(10);
      doc.fillColor('#374151'); // Dark gray for body text
      doc.font('Helvetica');
      
      // Certificate body with clean, well-aligned fields
      const contentStartY = 140;
      
      // "This is to certify that" section
      doc.fontSize(11);
      doc.text('This is to certify that the following land record details', 0, contentStartY, { width: doc.page.width, align: 'center' });
      doc.text('are officially registered with the Digital e-Gram Panchayat system:', 0, contentStartY + 15, { width: doc.page.width, align: 'center' });
      
      // Land owner name - larger and bold
      doc.fontSize(16);
      doc.font('Helvetica-Bold');
      doc.text(landRecord.owner, 0, contentStartY + 45, { width: doc.page.width, align: 'center' });
      
      // Additional detailed information
      doc.fontSize(11);
      doc.font('Helvetica');
      
      // Survey Number
      doc.text('Survey Number:', 80, contentStartY + 75);
      doc.font('Helvetica-Bold');
      doc.text(landRecord.surveyNo, 200, contentStartY + 75);
      
      // Total Area
      doc.text('Total Area:', 80, contentStartY + 95);
      doc.font('Helvetica-Bold');
      doc.text(landRecord.area, 200, contentStartY + 95);
      
      // Land Type
      doc.text('Land Type:', 80, contentStartY + 115);
      doc.font('Helvetica-Bold');
      doc.text(landRecord.landType, 200, contentStartY + 115);
      
      // Encumbrance Status
      doc.text('Encumbrance Status:', 80, contentStartY + 135);
      doc.font('Helvetica-Bold');
      doc.text(landRecord.encumbranceStatus, 200, contentStartY + 135);
      
      // Issue Date
      const issueDate = new Date().toDateString();
      doc.text('Certificate Issued On:', 80, contentStartY + 155);
      doc.font('Helvetica-Bold');
      doc.text(issueDate, 200, contentStartY + 155);
      
      // Certificate ID
      doc.text('Certificate ID:', 80, contentStartY + 175);
      doc.font('Helvetica-Bold');
      doc.text(`LND-${landRecord._id}`, 200, contentStartY + 175);
      
      // Add seal in bottom-right corner (matching certificate style)
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
      
      // Add signature area in bottom-left corner (matching certificate style)
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
      doc.text('Official Document - Valid for Land Transactions', 0, doc.page.height - 25, { width: doc.page.width, align: 'center' });
      
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

// Generate a JPG certificate from PDF (matching certificate style)
const generateLandRecordCertificateJPG = async (landRecord: any): Promise<string> => {
  try {
    // First generate the PDF
    const pdfFileName = await generateLandRecordCertificatePDF(landRecord);
    const pdfPath = path.join(UPLOAD_DIR, pdfFileName);
    
    // Ensure the PDF file exists
    if (!fs.existsSync(pdfPath)) {
      throw new Error('PDF file was not generated successfully');
    }
    
    // Convert PDF to JPG
    const jpgFileName = `land-record-certificate-${landRecord._id}.jpg`;
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
                <text x="400" y="100" font-family="Arial" font-size="36" fill="#1e40af" text-anchor="middle">LAND RECORD</text>
                <text x="400" y="150" font-family="Arial" font-size="24" fill="#1e40af" text-anchor="middle">CERTIFICATE</text>
                <text x="400" y="250" font-family="Arial" font-size="20" fill="#374151" text-anchor="middle">${landRecord.owner}</text>
                <text x="400" y="300" font-family="Arial" font-size="14" fill="#374151" text-anchor="middle">This is to certify that</text>
                <text x="400" y="350" font-family="Arial" font-size="14" fill="#374151" text-anchor="middle">the following land record details are officially registered</text>
                <text x="200" y="400" font-family="Arial" font-size="14" fill="#374151">Survey Number:</text>
                <text x="350" y="400" font-family="Arial" font-size="14" fill="#374151" font-weight="bold">${landRecord.surveyNo}</text>
                <text x="200" y="425" font-family="Arial" font-size="14" fill="#374151">Total Area:</text>
                <text x="350" y="425" font-family="Arial" font-size="14" fill="#374151" font-weight="bold">${landRecord.area}</text>
                <text x="200" y="450" font-family="Arial" font-size="14" fill="#374151">Land Type:</text>
                <text x="350" y="450" font-family="Arial" font-size="14" fill="#374151" font-weight="bold">${landRecord.landType}</text>
                <text x="400" y="500" font-family="Arial" font-size="10" fill="#374151" text-anchor="middle">Generated by Digital e-Gram Panchayat</text>
                <text x="400" y="550" font-family="Arial" font-size="8" fill="#374151" text-anchor="middle">Official Document - Valid for Land Transactions</text>
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

// Apply for a land record certificate
export const applyForLandRecordCertificate = async (req: Request, res: Response) => {
  try {
    const { owner, surveyNo, area, landType, encumbranceStatus } = req.body;
    
    // Validate required fields
    if (!owner || !surveyNo || !area || !landType || !encumbranceStatus) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be provided' 
      });
    }
    
    // Validate that owner is a string
    if (typeof owner !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Owner name must be a valid text' 
      });
    }
    
    // Validate that surveyNo is a string
    if (typeof surveyNo !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Survey number must be a valid text' 
      });
    }
    
    // Validate that area is a string
    if (typeof area !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Area must be a valid text' 
      });
    }
    
    // Validate that landType is a string
    if (typeof landType !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Land type must be a valid text' 
      });
    }
    
    // Validate that encumbranceStatus is a string
    if (typeof encumbranceStatus !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Encumbrance status must be a valid text' 
      });
    }
    
    // Create new land record
    const newLandRecord = {
      _id: generateMockId(),
      owner,
      surveyNo,
      area,
      landType,
      encumbranceStatus,
      status: 'Ready',
      createdAt: new Date()
    };
    
    // Save to in-memory storage
    inMemoryLandRecords.set(newLandRecord._id, newLandRecord);
    
    // Emit real-time update (assuming owner is the citizenId)
    emitApplicationUpdate(
      owner, // Using owner as citizenId for demo purposes
      newLandRecord._id,
      'Land Records',
      newLandRecord.status,
      `Land record certificate application submitted successfully`
    );
    
    res.status(201).json({
      success: true,
      message: 'Land record certificate application submitted successfully',
      applicationId: newLandRecord._id,
      status: newLandRecord.status,
      downloadUrl: `/api/landrecords/${newLandRecord._id}/download`
    });
  } catch (error: any) {
    console.error('Error applying for land record certificate:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};

// Get land record preview data
export const getLandRecordPreview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Try to get from MongoDB first, then from in-memory storage
    let landRecord = null;
    
    try {
      landRecord = await LandRecord.findById(id);
    } catch (dbError) {
      // If MongoDB is not available, check in-memory storage
      landRecord = inMemoryLandRecords.get(id);
    }
    
    if (!landRecord) {
      return res.status(404).json({ 
        success: false, 
        message: 'Land record not found' 
      });
    }
    
    res.status(200).json(landRecord);
  } catch (error: any) {
    console.error('Error fetching land record preview:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};

// Update land record data
export const updateLandRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Try to get from MongoDB first, then from in-memory storage
    let landRecord = null;
    
    try {
      landRecord = await LandRecord.findById(id);
      if (landRecord) {
        // Update the land record with new data
        Object.assign(landRecord, updateData);
        // Save the updated land record
        const updatedLandRecord = await landRecord.save();
        landRecord = updatedLandRecord;
      }
    } catch (dbError) {
      // If MongoDB is not available, check in-memory storage
      landRecord = inMemoryLandRecords.get(id);
      if (landRecord) {
        // Update the in-memory land record
        Object.assign(landRecord, updateData);
        inMemoryLandRecords.set(id, landRecord);
      }
    }
    
    if (!landRecord) {
      return res.status(404).json({ 
        success: false, 
        message: 'Land record not found' 
      });
    }
    
    // Regenerate the certificate file with updated data
    const certificateFile = await generateLandRecordCertificatePDF(landRecord);
    
    res.status(200).json(landRecord);
  } catch (error: any) {
    console.error('Error updating land record:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};

// Get land record status
export const getLandRecordStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Try to get from MongoDB first, then from in-memory storage
    let landRecord = null;
    
    try {
      landRecord = await LandRecord.findById(id);
    } catch (dbError) {
      // If MongoDB is not available, check in-memory storage
      landRecord = inMemoryLandRecords.get(id);
    }
    
    if (!landRecord) {
      return res.status(404).json({ 
        success: false, 
        message: 'Land record not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      applicationId: landRecord._id,
      status: landRecord.status,
      owner: landRecord.owner,
      surveyNo: landRecord.surveyNo,
      area: landRecord.area,
      landType: landRecord.landType,
      encumbranceStatus: landRecord.encumbranceStatus
    });
  } catch (error: any) {
    console.error('Error fetching land record status:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};

// Download land record certificate
export const downloadLandRecordCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { format } = req.query; // 'pdf' or 'jpg'
    
    console.log('Downloading land record certificate:', { id, format }); // Debug log
    
    // Try to get from MongoDB first, then from in-memory storage
    let landRecord = null;
    
    try {
      landRecord = await LandRecord.findById(id);
    } catch (dbError) {
      // If MongoDB is not available, check in-memory storage
      landRecord = inMemoryLandRecords.get(id);
    }
    
    if (!landRecord) {
      return res.status(404).json({ 
        success: false, 
        message: 'Land record not found' 
      });
    }
    
    if (landRecord.status !== 'Ready') {
      return res.status(400).json({ 
        success: false, 
        message: 'Land record certificate is not ready for download' 
      });
    }
    
    // Create proper filename based on certificate type
    const fileNameBase = `land-record-certificate-${id}`;
    
    // For PDF format
    if (format === 'pdf' || !format) {
      const fileName = `land-record-certificate-${id}.pdf`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      
      // Check if file exists, if not regenerate it
      if (!fs.existsSync(filePath)) {
        await generateLandRecordCertificatePDF(landRecord);
      }
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ 
          success: false, 
          message: 'Land record certificate file not found' 
        });
      }
      
      // Emit real-time update (assuming owner is the citizenId)
      console.log('Emitting application update for PDF download:', {
        citizenId: landRecord.owner,
        landRecordId: id,
        serviceType: 'Land Records',
        status: landRecord.status,
        message: `Land record certificate downloaded in PDF format`
      });
      
      emitApplicationUpdate(
        landRecord.owner, // Using owner as citizenId for demo purposes
        id,
        'Land Records',
        landRecord.status,
        `Land record certificate downloaded in PDF format`
      );
      
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
        const fileName = `land-record-certificate-${id}.jpg`;
        const filePath = path.join(UPLOAD_DIR, fileName);
        
        // Check if file exists, if not regenerate it
        if (!fs.existsSync(filePath)) {
          await generateLandRecordCertificateJPG(landRecord);
        }
        
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ 
            success: false, 
            message: 'Land record certificate file not found' 
          });
        }
        
        // Emit real-time update (assuming owner is the citizenId)
        console.log('Emitting application update for JPG download:', {
          citizenId: landRecord.owner,
          landRecordId: id,
          serviceType: 'Land Records',
          status: landRecord.status,
          message: `Land record certificate downloaded in JPG format`
        });
        
        emitApplicationUpdate(
          landRecord.owner, // Using owner as citizenId for demo purposes
          id,
          'Land Records',
          landRecord.status,
          `Land record certificate downloaded in JPG format`
        );
        
        // Set appropriate headers for JPG download with proper filename
        res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.jpg"`);
        res.setHeader('Content-Type', 'image/jpeg');
        
        // Send the file
        res.sendFile(filePath);
        return;
      } catch (jpgError: any) {
        console.error('Error generating JPG land record certificate:', jpgError);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to generate JPG land record certificate: ' + (jpgError.message || 'Unknown error')
        });
      }
    }
    
    // If format is not supported
    return res.status(400).json({ 
      success: false, 
      message: 'Unsupported format. Use pdf or jpg.' 
    });
  } catch (error: any) {
    console.error('Error downloading land record certificate:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};