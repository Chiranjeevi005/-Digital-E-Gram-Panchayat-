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
      
      // Certificate-specific content
      if (application.certificateType === 'Marriage') {
        // "This is to certify that" section
        doc.fontSize(11);
        doc.text('This is to certify that', 0, contentStartY, { width: doc.page.width, align: 'center' });
        
        // Bride and Groom names - larger and bold
        doc.fontSize(16);
        doc.font('Helvetica-Bold');
        doc.text(`${application.brideName} and ${application.groomName}`, 0, contentStartY + 20, { width: doc.page.width, align: 'center' });
        
        // Marriage event description
        doc.fontSize(11);
        doc.font('Helvetica');
        doc.text('were married on', 0, contentStartY + 40, { width: doc.page.width, align: 'center' });
        
        // Date and place information
        doc.text(`${new Date(application.date).toDateString()}`, 0, contentStartY + 58, { width: doc.page.width, align: 'center' });
        doc.text(`at ${application.place}`, 0, contentStartY + 76, { width: doc.page.width, align: 'center' });
        
        // Witnesses
        doc.text('Witnesses:', 0, contentStartY + 96, { width: doc.page.width, align: 'center' });
        doc.text(application.witnessNames, 0, contentStartY + 114, { width: doc.page.width, align: 'center' });
        
        // Registration number
        doc.text(`Registration No: ${application.registrationNo}`, 0, contentStartY + 134, { width: doc.page.width, align: 'center' });
      } 
      else if (application.certificateType === 'Income' || 
               application.certificateType === 'Caste' || 
               application.certificateType === 'Residence') {
        // "This is to certify that" section
        doc.fontSize(11);
        doc.text('This is to certify that', 0, contentStartY, { width: doc.page.width, align: 'center' });
        
        // Applicant name - larger and bold
        doc.fontSize(16);
        doc.font('Helvetica-Bold');
        doc.text(application.applicantName, 0, contentStartY + 20, { width: doc.page.width, align: 'center' });
        
        // Father/Husband name
        if (application.fatherName) {
          doc.fontSize(11);
          doc.font('Helvetica');
          doc.text(`Father/Husband: ${application.fatherName}`, 0, contentStartY + 40, { width: doc.page.width, align: 'center' });
        }
        
        // Address
        if (application.address) {
          doc.text(`Address: ${application.address}`, 0, contentStartY + 58, { width: doc.page.width, align: 'center' });
        }
        
        // Certificate-specific details
        if (application.certificateType === 'Income') {
          doc.text(`has declared an annual income of ${application.income}`, 0, contentStartY + 76, { width: doc.page.width, align: 'center' });
        } else if (application.certificateType === 'Caste') {
          doc.text(`belongs to ${application.caste}${application.subCaste ? ` (${application.subCaste})` : ''} caste`, 0, contentStartY + 76, { width: doc.page.width, align: 'center' });
        } else if (application.certificateType === 'Residence') {
          doc.text(`is a permanent resident of Ward ${application.ward}, Village ${application.village}, District ${application.district}`, 0, contentStartY + 76, { width: doc.page.width, align: 'center' });
        }
      } 
      else {
        // Birth and Death certificates (existing logic)
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
      }
      
      // Application ID and status
      const startY = application.certificateType === 'Marriage' ? contentStartY + 160 : 
                    (application.certificateType === 'Income' || application.certificateType === 'Caste' || application.certificateType === 'Residence') ? contentStartY + 100 : 
                    contentStartY + 120;
      
      doc.fontSize(9);
      doc.text(`Application ID: ${application._id}`, 0, startY, { width: doc.page.width, align: 'center' });
      doc.text(`Status: ${application.status}`, 0, startY + 15, { width: doc.page.width, align: 'center' });
      
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
      
      // Certificate-specific content for placeholder
      let certificateContent = '';
      if (application.certificateType === 'Marriage') {
        certificateContent = `
          <text x="400" y="250" font-family="Arial" font-size="20" fill="#374151" text-anchor="middle">${application.brideName} and ${application.groomName}</text>
          <text x="400" y="300" font-family="Arial" font-size="14" fill="#374151" text-anchor="middle">were married on</text>
          <text x="400" y="320" font-family="Arial" font-size="14" fill="#374151" text-anchor="middle">${new Date(application.date).toDateString()} at ${application.place}</text>
        `;
      } else if (application.certificateType === 'Income' || 
                 application.certificateType === 'Caste' || 
                 application.certificateType === 'Residence') {
        certificateContent = `
          <text x="400" y="250" font-family="Arial" font-size="20" fill="#374151" text-anchor="middle">${application.applicantName}</text>
          <text x="400" y="280" font-family="Arial" font-size="14" fill="#374151" text-anchor="middle">Father/Husband: ${application.fatherName || ''}</text>
        `;
        
        if (application.certificateType === 'Income') {
          certificateContent += `<text x="400" y="310" font-family="Arial" font-size="14" fill="#374151" text-anchor="middle">has declared an annual income of ${application.income}</text>`;
        } else if (application.certificateType === 'Caste') {
          certificateContent += `<text x="400" y="310" font-family="Arial" font-size="14" fill="#374151" text-anchor="middle">belongs to ${application.caste}${application.subCaste ? ` (${application.subCaste})` : ''} caste</text>`;
        } else if (application.certificateType === 'Residence') {
          certificateContent += `<text x="400" y="310" font-family="Arial" font-size="14" fill="#374151" text-anchor="middle">is a permanent resident of Ward ${application.ward}, Village ${application.village}, District ${application.district}</text>`;
        }
      } else {
        // Birth and Death certificates
        certificateContent = `
          <text x="400" y="250" font-family="Arial" font-size="20" fill="#374151" text-anchor="middle">${application.applicantName}</text>
          <text x="400" y="300" font-family="Arial" font-size="14" fill="#374151" text-anchor="middle">This is to certify that</text>
          <text x="400" y="320" font-family="Arial" font-size="14" fill="#374151" text-anchor="middle">was involved in a ${application.certificateType.toLowerCase()} event</text>
          <text x="400" y="340" font-family="Arial" font-size="14" fill="#374151" text-anchor="middle">on ${new Date(application.date).toDateString()} at ${application.place}</text>
        `;
      }
      
      await sharp(placeholderBuffer)
        .composite([
          // Add text to the placeholder
          {
            input: Buffer.from(
              `<svg width="800" height="600">
                <rect x="20" y="20" width="760" height="560" fill="none" stroke="#1e40af" stroke-width="2"/>
                <text x="400" y="100" font-family="Arial" font-size="36" fill="#1e40af" text-anchor="middle">CERTIFICATE</text>
                <text x="400" y="150" font-family="Arial" font-size="24" fill="#1e40af" text-anchor="middle">OF ${application.certificateType.toUpperCase()}</text>
                ${certificateContent}
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
    // Log the incoming request body for debugging
    console.log('=== Certificate Application Debug Info ===');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    const { 
      applicantName, 
      fatherName, 
      motherName, 
      certificateType, 
      date, 
      place,
      // Marriage certificate fields
      brideName,
      groomName,
      witnessNames,
      registrationNo,
      // Income/Caste/Residence certificate fields
      address,
      income,
      caste,
      subCaste,
      ward,
      village,
      district,
      issueDate,
      validity,
      supportingFiles, 
      declaration 
    } = req.body;
    
    // Validate required fields
    
    // For Marriage, Birth, and Death certificates, date and place are required
    // For Income, Caste, and Residence certificates, date and place are not required in the form
    const isDateAndPlaceRequired = ['Marriage', 'Birth', 'Death'].includes(certificateType);
    
    console.log('Validation check - applicantName:', applicantName, 'certificateType:', certificateType, 'place:', place, 'isDateAndPlaceRequired:', isDateAndPlaceRequired, 'date:', date);
    
    // Validate basic required fields
    // For Marriage, Birth, and Death certificates, both applicantName, certificateType, date, and place are required
    // For Income, Caste, and Residence certificates, only applicantName and certificateType are required at this stage
    // Additional validations for specific certificate types are done later
    if (!applicantName || !applicantName.trim() || !certificateType) {
      console.log('Basic validation failed - missing applicantName or certificateType');
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be provided' 
      });
    }
    
    // For Marriage, Birth, and Death certificates, date and place are also required at this stage
    if (isDateAndPlaceRequired && (!date || date.trim() === '' || !place || place.trim() === '')) {
      console.log('Basic validation failed - missing date or place for certificate type that requires them');
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be provided' 
      });
    }
    
    // Validate certificate type (allow all new certificate types)
    const validCertificateTypes = ['Birth', 'Death', 'Marriage', 'Income', 'Caste', 'Residence'];
    if (!validCertificateTypes.includes(certificateType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid certificate type.' 
      });
    }
    
    // Validate that applicantName is a string
    if (typeof applicantName !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Applicant name must be a valid text' 
      });
    }
    
    // Validate that place is a string when provided
    if (place && typeof place !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Place must be a valid text' 
      });
    }
    
    // Certificate-specific validations
    if (certificateType === 'Marriage') {
      if (!brideName || !brideName.trim() || !groomName || !groomName.trim() || !witnessNames || !witnessNames.trim() || !registrationNo || !registrationNo.trim()) {
        return res.status(400).json({ 
          success: false, 
          message: 'All required fields for Marriage certificate must be provided' 
        });
      }
    } else if (certificateType === 'Income') {
      if (!fatherName || !fatherName.trim() || !address || !address.trim() || !income || !income.trim()) {
        return res.status(400).json({ 
          success: false, 
          message: 'All required fields for Income certificate must be provided' 
        });
      }
    } else if (certificateType === 'Caste') {
      if (!fatherName || !fatherName.trim() || !address || !address.trim() || !caste || !caste.trim()) {
        return res.status(400).json({ 
          success: false, 
          message: 'All required fields for Caste certificate must be provided' 
        });
      }
    } else if (certificateType === 'Residence') {
      if (!fatherName || !fatherName.trim() || !address || !address.trim() || !ward || !ward.trim() || !village || !village.trim() || !district || !district.trim()) {
        return res.status(400).json({ 
          success: false, 
          message: 'All required fields for Residence certificate must be provided' 
        });
      }
    } else if (certificateType === 'Birth' || certificateType === 'Death') {
      // For Birth and Death certificates, date and place are required
      if (!date || !date.trim() || !place || !place.trim()) {
        return res.status(400).json({ 
          success: false, 
          message: 'All required fields for Birth/Death certificate must be provided' 
        });
      }
    }
    
    // Validate declaration
    console.log('Declaration value:', declaration, 'Type:', typeof declaration);
    if (declaration !== true) {
      return res.status(400).json({ 
        success: false, 
        message: 'You must declare that the information is correct' 
      });
    }
    
    // Create new certificate application
    // For Income, Caste, and Residence certificates, use current date if no date is provided
    const isDateRequiredForApp = ['Marriage', 'Birth', 'Death'].includes(certificateType);
    const applicationDate = isDateRequiredForApp && date ? new Date(date) : new Date();
    
    const newApplication = {
      _id: generateMockId(),
      applicantName,
      fatherName,
      motherName,
      certificateType,
      date: applicationDate,
      place: place || '', // Use empty string if place is not provided
      // Marriage certificate fields
      brideName,
      groomName,
      witnessNames,
      registrationNo,
      // Income/Caste/Residence certificate fields
      address,
      income,
      caste,
      subCaste,
      ward,
      village,
      district,
      issueDate: issueDate ? new Date(issueDate) : undefined,
      validity,
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