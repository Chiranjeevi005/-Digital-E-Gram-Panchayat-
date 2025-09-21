import { Request, Response } from 'express';
import Scheme from '../models/Scheme';
import SchemeApplication from '../models/SchemeApplication';
import { generateSchemeAcknowledgmentPDF, convertPDFToJPG } from '../utils/documentGenerator';
import fs from 'fs';
import path from 'path';
import { emitApplicationUpdate } from '../utils/socket';

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
  } catch (error: any) {
    console.error('Error creating scheme:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSchemes = async (req: Request, res: Response) => {
  try {
    // Check if we should seed schemes (special parameter for testing)
    const shouldSeed = req.query.seed === 'true';
    if (shouldSeed) {
      console.log('Seeding schemes requested');
      // Sample schemes data
      const sampleSchemes = [
        {
          name: 'Agricultural Subsidy Program',
          description: 'Financial assistance for farmers to purchase seeds, fertilizers, and farming equipment.',
          eligibility: 'All registered farmers with valid land ownership documents',
          benefits: 'Up to ₹50,000 subsidy for crop cultivation and farm equipment'
        },
        {
          name: 'Educational Scholarship Scheme',
          description: 'Merit-based scholarships for students from economically weaker sections.',
          eligibility: 'Students with family income below ₹2.5 lakh per annum',
          benefits: 'Tuition fees coverage and monthly stipend of ₹2,000'
        },
        {
          name: 'Healthcare Support Initiative',
          description: 'Free medical checkups and subsidized treatment for senior citizens.',
          eligibility: 'Citizens above 60 years of age',
          benefits: 'Annual health checkup packages and 70% discount on medicines'
        },
        {
          name: 'Women Empowerment Grant',
          description: 'Financial support for women entrepreneurs to start small businesses.',
          eligibility: 'Women above 18 years with valid Aadhaar and bank account',
          benefits: 'Interest-free loan up to ₹5 lakh and business mentoring'
        },
        {
          name: 'Rural Infrastructure Development',
          description: 'Funding for village infrastructure projects like roads, water supply, and sanitation.',
          eligibility: 'Community groups and local bodies',
          benefits: 'Up to 80% funding for approved infrastructure projects'
        }
      ];
      
      console.log('Clearing existing schemes');
      // Clear existing schemes
      await Scheme.deleteMany({});
      console.log('🧹 Cleared existing schemes');
      
      console.log('Inserting sample schemes');
      // Insert sample schemes
      await Scheme.insertMany(sampleSchemes);
      console.log('✅ Sample schemes seeded successfully');
    }
    
    console.log('Fetching schemes from database...');
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    console.log(`Found ${schemes.length} schemes`);
    console.log('Schemes data:', JSON.stringify(schemes, null, 2));
    
    // Filter out Housing Subsidy Program
    const filteredSchemes = schemes.filter(scheme => scheme.name !== 'Housing Subsidy Program');
    console.log(`Filtered to ${filteredSchemes.length} schemes after removing Housing Subsidy Program`);
    
    res.json(filteredSchemes);
  } catch (error: any) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSchemeById = async (req: Request, res: Response) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }
    res.json(scheme);
  } catch (error: any) {
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
    
    console.log('Applying for scheme with data:', { 
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
    }); // Debug log
    
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
    console.log('Saved scheme application:', application._id); // Debug log
    
    // Generate acknowledgment PDF
    try {
      await generateSchemeAcknowledgmentPDF(application);
    } catch (pdfError: any) {
      console.error('Error generating PDF:', pdfError);
    }
    
    // Emit real-time update to the citizen who applied for the scheme
    console.log('Emitting application update for scheme application:', {
      citizenId,
      applicationId: application._id.toString(),
      serviceType: 'Schemes',
      status: application.status,
      message: `Scheme application for ${schemeName} submitted successfully`
    });
    
    emitApplicationUpdate(
      citizenId,
      application._id.toString(),
      'Schemes',
      application.status,
      `Scheme application for ${schemeName} submitted successfully`
    );
    
    res.status(201).json({
      success: true,
      message: 'Scheme application submitted successfully',
      applicationId: application._id,
      status: application.status
    });
  } catch (error: any) {
    console.error('Error applying for scheme:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get scheme applications for a user or all applications
export const getSchemeApplications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    let applications;
    if (userId === 'all') {
      // Get all scheme applications
      applications = await SchemeApplication.find().sort({ submittedAt: -1 });
    } else {
      // Get scheme applications for a specific user
      applications = await SchemeApplication.find({ citizenId: userId })
        .sort({ submittedAt: -1 });
    }
    
    res.json(applications);
  } catch (error: any) {
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
    
    // Emit real-time update to the citizen who applied for the scheme
    emitApplicationUpdate(
      application.citizenId,
      applicationId,
      'Schemes',
      'Deleted',
      `Scheme application for ${application.schemeName} deleted`
    );
    
    res.json({ 
      success: true, 
      message: 'Application deleted successfully' 
    });
  } catch (error: any) {
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
  } catch (error: any) {
    console.error('Error deleting scheme:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Seed schemes with sample data
export const seedSchemes = async (req: Request, res: Response) => {
  try {
    console.log('Seeding schemes requested via POST endpoint');
    
    // Sample schemes data
    const sampleSchemes = [
      {
        name: 'Agricultural Subsidy Program',
        description: 'Financial assistance for farmers to purchase seeds, fertilizers, and farming equipment.',
        eligibility: 'All registered farmers with valid land ownership documents',
        benefits: 'Up to ₹50,000 subsidy for crop cultivation and farm equipment'
      },
      {
        name: 'Educational Scholarship Scheme',
        description: 'Merit-based scholarships for students from economically weaker sections.',
        eligibility: 'Students with family income below ₹2.5 lakh per annum',
        benefits: 'Tuition fees coverage and monthly stipend of ₹2,000'
      },
      {
        name: 'Healthcare Support Initiative',
        description: 'Free medical checkups and subsidized treatment for senior citizens.',
        eligibility: 'Citizens above 60 years of age',
        benefits: 'Annual health checkup packages and 70% discount on medicines'
      },
      {
        name: 'Women Empowerment Grant',
        description: 'Financial support for women entrepreneurs to start small businesses.',
        eligibility: 'Women above 18 years with valid Aadhaar and bank account',
        benefits: 'Interest-free loan up to ₹5 lakh and business mentoring'
      },
      {
        name: 'Rural Infrastructure Development',
        description: 'Funding for village infrastructure projects like roads, water supply, and sanitation.',
        eligibility: 'Community groups and local bodies',
        benefits: 'Up to 80% funding for approved infrastructure projects'
      }
    ];
    
    console.log('Clearing existing schemes');
    // Clear existing schemes
    await Scheme.deleteMany({});
    console.log('🧹 Cleared existing schemes');
    
    console.log('Inserting sample schemes');
    // Insert sample schemes
    const insertedSchemes = await Scheme.insertMany(sampleSchemes);
    console.log('✅ Sample schemes seeded successfully');
    
    res.status(200).json({
      message: 'Schemes seeded successfully',
      count: insertedSchemes.length,
      schemes: insertedSchemes.map(scheme => scheme.name)
    });
  } catch (error: any) {
    console.error('Error seeding schemes:', error);
    res.status(500).json({ 
      message: 'Error seeding schemes', 
      error: error.message 
    });
  }
};

// Download scheme acknowledgment (PDF or JPG)
export const downloadSchemeAcknowledgment = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { format } = req.query; // 'pdf' or 'jpg'
    
    console.log('Downloading scheme acknowledgment:', { applicationId, format }); // Debug log
    
    // Find the application
    const application = await SchemeApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    console.log('Found application:', application._id); // Debug log
    
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
      
      // Check if JPG file exists
      if (!fs.existsSync(jpgPath)) {
        throw new Error('JPG file was not generated successfully');
      }
      
      // Emit real-time update to the citizen who applied for the scheme
      console.log('Emitting application update for JPG download:', {
        citizenId: application.citizenId,
        applicationId: application._id.toString(),
        serviceType: 'Schemes',
        status: application.status,
        message: `Scheme acknowledgment downloaded in JPG format`
      });
      
      emitApplicationUpdate(
        application.citizenId,
        applicationId,
        'Schemes',
        application.status,
        `Scheme acknowledgment downloaded in JPG format`
      );
      
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
      
      // Emit real-time update to the citizen who applied for the scheme
      console.log('Emitting application update for PDF download:', {
        citizenId: application.citizenId,
        applicationId: application._id.toString(),
        serviceType: 'Schemes',
        status: application.status,
        message: `Scheme acknowledgment downloaded in PDF format`
      });
      
      emitApplicationUpdate(
        application.citizenId,
        applicationId,
        'Schemes',
        application.status,
        `Scheme acknowledgment downloaded in PDF format`
      );
      
      // Send the PDF file
      res.setHeader('Content-Disposition', `attachment; filename="${fileNameBase}.pdf"`);
      res.setHeader('Content-Type', 'application/pdf');
      res.sendFile(pdfPath);
    }
  } catch (error: any) {
    console.error('Error downloading scheme acknowledgment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};