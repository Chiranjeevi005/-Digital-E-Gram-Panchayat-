import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import { generateCertificatePDF, convertPDFToJPG } from '../utils/documentGenerator';
import { emitApplicationUpdate } from '../utils/socket';
import CertificateApplication, { ICertificateApplication } from '../models/CertificateApplication';

// Get all certificates
export const getAllCertificates = async (req: Request, res: Response) => {
  try {
    const certificates = await CertificateApplication.find().sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Apply for a certificate
export const applyForCertificate = async (req: Request, res: Response) => {
  try {
    // Extract all possible fields from request body
    const {
      userId, // Extract userId from request
      type,
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
      district
    } = req.body;
    
    if (!type || !applicantName) {
      return res.status(400).json({ message: 'Type and applicant name are required' });
    }
    
    // Create new certificate application in database
    const newCertificate = new CertificateApplication({
      userId, // Add userId
      certificateType: type,
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
    
    res.status(201).json({
      success: true,
      applicationId: newCertificate._id,
      status: newCertificate.status,
      message: 'Certificate application submitted successfully'
    });
  } catch (error) {
    console.error('Error applying for certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get certificate preview data
export const getCertificatePreview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const certificate = await CertificateApplication.findById(id);
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json(certificate);
  } catch (error) {
    console.error('Error fetching certificate preview:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update certificate data
export const updateCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const certificate = await CertificateApplication.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json(certificate);
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get certificate status
export const getCertificateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const certificate = await CertificateApplication.findById(id);
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json({ status: certificate.status });
  } catch (error) {
    console.error('Error fetching certificate status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Download certificate
export const downloadCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { format } = req.query;
    
    console.log('Downloading certificate:', { id, format }); // Debug log
    
    const certificate = await CertificateApplication.findById(id);
    
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
      const pdfPath = await generateCertificatePDF(certificate, fileName);
      
      // Convert PDF to JPG using the shared utility function
      try {
        const jpgPath = await convertPDFToJPG(pdfPath, `${fileName}.jpg`);
        
        // Check if JPG file exists
        if (!fs.existsSync(jpgPath)) {
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
          
          emitApplicationUpdate(
            certificate.userId, 
            certificate._id.toString(), 
            'Certificates', 
            certificate.status, 
            `Certificate downloaded in JPG format`
          );
        } else {
          console.log('No userId found for certificate, skipping real-time update');
        }
        
        // Send the JPG file
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.jpg"`);
        res.setHeader('Content-Type', 'image/jpeg');
        res.sendFile(jpgPath);
      } catch (conversionError: any) {
        console.error('Error converting PDF to JPG:', conversionError);
        // Clean up temporary PDF file
        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath);
        }
        return res.status(500).json({ 
          message: `Error generating JPG file: ${conversionError.message}. Please try downloading as PDF instead.` 
        });
      } finally {
        // Clean up temporary PDF file after sending response
        setTimeout(() => {
          if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
          }
        }, 1000); // Wait a bit to ensure file is sent
      }
    } else {
      // Generate PDF certificate
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });
      
      // Create buffer to store PDF
      const chunks: Buffer[] = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
      });
      
      // Emit event for real-time dashboard update if userId exists
      if (certificate.userId) {
        console.log('Emitting application update for PDF download:', {
          userId: certificate.userId,
          certificateId: certificate._id.toString(),
          serviceType: 'Certificates',
          status: certificate.status,
          message: `Certificate downloaded in PDF format`
        });
        
        emitApplicationUpdate(
          certificate.userId, 
          certificate._id.toString(), 
          'Certificates', 
          certificate.status, 
          `Certificate downloaded in PDF format`
        );
      } else {
        console.log('No userId found for certificate, skipping real-time update');
      }
      
      // Add header with panchayat info
      doc.fillColor('#000000');
      doc.fontSize(20);
      doc.text('Digital E-Panchayat', 50, 50, { align: 'center' });
      doc.fontSize(16);
      doc.text(`${certificate.certificateType} Certificate`, 50, 80, { align: 'center' });
      doc.moveDown();
      
      // Add horizontal line
      doc.moveTo(50, 110).lineTo(550, 110).stroke();
      doc.moveDown();
      
      // Certificate details
      doc.fontSize(12);
      doc.text(`Certificate ID: ${certificate._id}`);
      doc.text(`Applicant Name: ${certificate.applicantName}`);
      
      if (certificate.fatherName) {
        doc.text(`Father/Husband Name: ${certificate.fatherName}`);
      }
      
      if (certificate.motherName) {
        doc.text(`Mother Name: ${certificate.motherName}`);
      }
      
      if (certificate.date) {
        doc.text(`Date: ${new Date(certificate.date).toLocaleDateString()}`);
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
      
      doc.text(`Certificate Number: ${certificate._id || 'N/A'}`);
      doc.text(`Issued Date: ${certificate.createdAt ? new Date(certificate.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}`);
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
  } catch (error) {
    console.error('Error downloading certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
};