import { Request, Response } from 'express';
import Grievance from '../models/Grievance';
import { generateGrievanceAcknowledgmentPDF, convertPDFToJPG, generateGrievanceResolutionPDF } from '../utils/documentGenerator';
import fs from 'fs';
import path from 'path';

export const createGrievance = async (req: Request, res: Response) => {
  try {
    const { citizenId, title, description, category, name, email, phone } = req.body;
    
    // Validate required fields
    if (!citizenId || !title || !description || !category) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    const grievance = new Grievance({
      citizenId,
      title,
      description,
      category,
      name,
      email,
      phone
    });
    
    await grievance.save();
    
    // Generate acknowledgment PDF
    try {
      await generateGrievanceAcknowledgmentPDF(grievance);
    } catch (pdfError) {
      console.error('Error generating PDF:', pdfError);
    }
    
    res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully',
      grievanceId: grievance._id,
      status: grievance.status
    });
  } catch (error) {
    console.error('Error creating grievance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGrievances = async (req: Request, res: Response) => {
  try {
    const grievances = await Grievance.find().sort({ createdAt: -1 });
    res.json(grievances);
  } catch (error) {
    console.error('Error fetching grievances:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGrievanceById = async (req: Request, res: Response) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    res.json(grievance);
  } catch (error) {
    console.error('Error fetching grievance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateGrievance = async (req: Request, res: Response) => {
  try {
    const { status, remarks } = req.body;
    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { status, remarks, updatedAt: new Date() },
      { new: true }
    );
    
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    
    // If status is changed to resolved, generate resolution certificate
    if (status === 'resolved') {
      try {
        await generateGrievanceResolutionPDF(grievance);
      } catch (pdfError) {
        console.error('Error generating resolution PDF:', pdfError);
      }
    }
    
    res.json(grievance);
  } catch (error) {
    console.error('Error updating grievance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get grievances by user ID
export const getUserGrievances = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const grievances = await Grievance.find({ citizenId: userId })
      .sort({ createdAt: -1 });
    
    res.json(grievances);
  } catch (error) {
    console.error('Error fetching user grievances:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a grievance
export const deleteGrievance = async (req: Request, res: Response) => {
  try {
    const { grievanceId } = req.params;
    
    // Find and delete the grievance
    const grievance = await Grievance.findByIdAndDelete(grievanceId);
    
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    
    // Also delete the associated files if they exist
    const ackFileNameBase = `grievance-acknowledgement-${grievanceId}`;
    const resFileNameBase = `grievance-resolution-${grievanceId}`;
    
    const ackPdfPath = path.join(__dirname, '../../uploads', `${ackFileNameBase}.pdf`);
    const ackJpgPath = path.join(__dirname, '../../uploads', `${ackFileNameBase}.jpg`);
    const resPdfPath = path.join(__dirname, '../../uploads', `${resFileNameBase}.pdf`);
    const resJpgPath = path.join(__dirname, '../../uploads', `${resFileNameBase}.jpg`);
    
    // Delete acknowledgment files if they exist
    if (fs.existsSync(ackPdfPath)) {
      fs.unlinkSync(ackPdfPath);
    }
    
    if (fs.existsSync(ackJpgPath)) {
      fs.unlinkSync(ackJpgPath);
    }
    
    // Delete resolution files if they exist
    if (fs.existsSync(resPdfPath)) {
      fs.unlinkSync(resPdfPath);
    }
    
    if (fs.existsSync(resJpgPath)) {
      fs.unlinkSync(resJpgPath);
    }
    
    res.json({ 
      success: true, 
      message: 'Grievance deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting grievance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit grievance before finalization
export const editGrievance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.__v;
    
    const grievance = await Grievance.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    
    res.json({
      success: true,
      message: 'Grievance updated successfully',
      grievance
    });
  } catch (error) {
    console.error('Error editing grievance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resolve grievance and generate resolution certificate
export const resolveGrievance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;
    
    const grievance = await Grievance.findByIdAndUpdate(
      id,
      { 
        status: 'resolved', 
        remarks,
        updatedAt: new Date() 
      },
      { new: true }
    );
    
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    
    // Generate resolution certificate
    try {
      await generateGrievanceResolutionPDF(grievance);
    } catch (pdfError) {
      console.error('Error generating resolution PDF:', pdfError);
    }
    
    res.json({
      success: true,
      message: 'Grievance resolved successfully',
      grievance
    });
  } catch (error) {
    console.error('Error resolving grievance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Download grievance acknowledgment (PDF or JPG)
export const downloadGrievanceAcknowledgment = async (req: Request, res: Response) => {
  try {
    const { grievanceId } = req.params;
    const { format } = req.query; // 'pdf' or 'jpg'
    
    // Find the grievance
    const grievance = await Grievance.findById(grievanceId);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    
    // Generate filename
    const fileNameBase = `grievance-acknowledgement-${grievanceId}`;
    
    if (format === 'jpg') {
      // Generate JPG
      const pdfPath = path.join(__dirname, '../../uploads', `${fileNameBase}.pdf`);
      
      // Check if PDF exists, if not generate it
      if (!fs.existsSync(pdfPath)) {
        await generateGrievanceAcknowledgmentPDF(grievance);
      }
      
      // Check if PDF was generated successfully
      if (!fs.existsSync(pdfPath)) {
        throw new Error('PDF file was not generated successfully');
      }
      
      // Convert PDF to JPG
      try {
        const jpgPath = await convertPDFToJPG(pdfPath, `${fileNameBase}.jpg`);
        
        // Check if JPG file exists
        if (!fs.existsSync(jpgPath)) {
          throw new Error('JPG file was not generated successfully');
        }
        
        // Send the JPG file
        res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.jpg"`);
        res.setHeader('Content-Type', 'image/jpeg');
        res.sendFile(jpgPath);
      } catch (conversionError: any) {
        console.error('Error converting PDF to JPG:', conversionError);
        return res.status(500).json({ message: `Error generating JPG file: ${conversionError.message}. Please try downloading as PDF instead.` });
      }
    } else {
      // Generate PDF (default)
      const pdfPath = path.join(__dirname, '../../uploads', `${fileNameBase}.pdf`);
      
      // Check if PDF exists, if not generate it
      if (!fs.existsSync(pdfPath)) {
        await generateGrievanceAcknowledgmentPDF(grievance);
      }
      
      // Send the PDF file
      res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.pdf"`);
      res.setHeader('Content-Type', 'application/pdf');
      res.sendFile(pdfPath);
    }
  } catch (error) {
    console.error('Error downloading grievance acknowledgment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Download grievance resolution certificate (PDF or JPG)
export const downloadGrievanceResolution = async (req: Request, res: Response) => {
  try {
    const { grievanceId } = req.params;
    const { format } = req.query; // 'pdf' or 'jpg'
    
    // Find the grievance
    const grievance = await Grievance.findById(grievanceId);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    
    // Check if grievance is resolved
    if (grievance.status !== 'resolved') {
      return res.status(400).json({ message: 'Grievance is not resolved yet' });
    }
    
    // Generate filename
    const fileNameBase = `grievance-resolution-${grievanceId}`;
    
    if (format === 'jpg') {
      // Generate JPG
      const pdfPath = path.join(__dirname, '../../uploads', `${fileNameBase}.pdf`);
      
      // Check if PDF exists, if not generate it
      if (!fs.existsSync(pdfPath)) {
        await generateGrievanceResolutionPDF(grievance);
      }
      
      // Check if PDF was generated successfully
      if (!fs.existsSync(pdfPath)) {
        throw new Error('PDF file was not generated successfully');
      }
      
      // Convert PDF to JPG
      try {
        const jpgPath = await convertPDFToJPG(pdfPath, `${fileNameBase}.jpg`);
        
        // Check if JPG file exists
        if (!fs.existsSync(jpgPath)) {
          throw new Error('JPG file was not generated successfully');
        }
        
        // Send the JPG file
        res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.jpg"`);
        res.setHeader('Content-Type', 'image/jpeg');
        res.sendFile(jpgPath);
      } catch (conversionError: any) {
        console.error('Error converting PDF to JPG:', conversionError);
        return res.status(500).json({ message: `Error generating JPG file: ${conversionError.message}. Please try downloading as PDF instead.` });
      }
    } else {
      // Generate PDF (default)
      const pdfPath = path.join(__dirname, '../../uploads', `${fileNameBase}.pdf`);
      
      // Check if PDF exists, if not generate it
      if (!fs.existsSync(pdfPath)) {
        await generateGrievanceResolutionPDF(grievance);
      }
      
      // Send the PDF file
      res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.pdf"`);
      res.setHeader('Content-Type', 'application/pdf');
      res.sendFile(pdfPath);
    }
  } catch (error) {
    console.error('Error downloading grievance resolution:', error);
    res.status(500).json({ message: 'Server error' });
  }
};