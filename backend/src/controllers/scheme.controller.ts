import { Request, Response } from 'express';
import Scheme from '../models/Scheme';
import SchemeApplication from '../models/SchemeApplication';
import { generateSchemeAcknowledgmentPDF, convertPDFToJPG } from '../utils/documentGenerator';
import fs from 'fs';
import path from 'path';

export const createScheme = async (req: Request, res: Response) => {
  try {
    const { name, description, eligibility, benefits } = req.body;
    
    // Validate required fields
    if (!name || !description || !eligibility || !benefits) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const scheme = new Scheme({
      name,
      description,
      eligibility,
      benefits,
    });
    
    await scheme.save();
    res.status(201).json(scheme);
  } catch (error) {
    console.error('Error creating scheme:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSchemes = async (req: Request, res: Response) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    res.json(schemes);
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSchemeById = async (req: Request, res: Response) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }
    res.json(scheme);
  } catch (error) {
    console.error('Error fetching scheme:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Apply for a scheme
export const applyForScheme = async (req: Request, res: Response) => {
  try {
    const { 
      citizenId, 
      schemeId, 
      schemeName,
      applicantName, 
      fatherName, 
      address, 
      phone, 
      email, 
      income, 
      caste, 
      documents 
    } = req.body;
    
    // Validate required fields
    if (!citizenId || !schemeId || !schemeName || !applicantName || !fatherName || 
        !address || !phone || !email) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    // Check if scheme exists
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }
    
    // Create new scheme application
    const application = new SchemeApplication({
      citizenId,
      schemeId,
      schemeName,
      applicantName,
      fatherName,
      address,
      phone,
      email,
      income,
      caste,
      documents: documents || [],
      status: 'pending',
      submittedAt: new Date(),
      updatedAt: new Date()
    });
    
    await application.save();
    
    // Generate acknowledgment PDF
    try {
      await generateSchemeAcknowledgmentPDF(application);
    } catch (pdfError) {
      console.error('Error generating PDF:', pdfError);
    }
    
    res.status(201).json({
      success: true,
      message: 'Scheme application submitted successfully',
      applicationId: application._id,
      status: application.status
    });
  } catch (error) {
    console.error('Error applying for scheme:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get scheme applications for a user
export const getSchemeApplications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const applications = await SchemeApplication.find({ citizenId: userId })
      .sort({ submittedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching scheme applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a scheme application
export const deleteSchemeApplication = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    
    // Find and delete the application
    const application = await SchemeApplication.findByIdAndDelete(applicationId);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Also delete the associated files if they exist
    const fileNameBase = `scheme-application-${applicationId}`;
    const pdfPath = path.join(__dirname, '../../uploads', `${fileNameBase}.pdf`);
    const jpgPath = path.join(__dirname, '../../uploads', `${fileNameBase}.jpg`);
    
    // Delete PDF file if it exists
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }
    
    // Delete JPG file if it exists
    if (fs.existsSync(jpgPath)) {
      fs.unlinkSync(jpgPath);
    }
    
    res.json({ 
      success: true, 
      message: 'Application deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting scheme application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a scheme
export const deleteScheme = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find and delete the scheme
    const scheme = await Scheme.findByIdAndDelete(id);
    
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Scheme deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting scheme:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Download scheme acknowledgment (PDF or JPG)
export const downloadSchemeAcknowledgment = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { format } = req.query; // 'pdf' or 'jpg'
    
    // Find the application
    const application = await SchemeApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Generate filename
    const fileNameBase = `scheme-application-${applicationId}`;
    
    if (format === 'jpg') {
      // Generate JPG
      const pdfPath = path.join(__dirname, '../../uploads', `${fileNameBase}.pdf`);
      
      // Check if PDF exists, if not generate it
      if (!fs.existsSync(pdfPath)) {
        await generateSchemeAcknowledgmentPDF(application);
      }
      
      // Convert PDF to JPG
      const jpgPath = await convertPDFToJPG(pdfPath, `${fileNameBase}.jpg`);
      
      // Send the JPG file
      res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.jpg"`);
      res.setHeader('Content-Type', 'image/jpeg');
      res.sendFile(jpgPath);
    } else {
      // Generate PDF (default)
      const pdfPath = path.join(__dirname, '../../uploads', `${fileNameBase}.pdf`);
      
      // Check if PDF exists, if not generate it
      if (!fs.existsSync(pdfPath)) {
        await generateSchemeAcknowledgmentPDF(application);
      }
      
      // Send the PDF file
      res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.pdf"`);
      res.setHeader('Content-Type', 'application/pdf');
      res.sendFile(pdfPath);
    }
  } catch (error) {
    console.error('Error downloading scheme acknowledgment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};