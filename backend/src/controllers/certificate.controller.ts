import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

// Mock data for certificates
interface Certificate {
  id: string;
  type: string;
  applicantName: string;
  applicationDate: string;
  status: string;
  certificateNumber?: string;
  issuedDate?: string;
}

// Mock database
let certificates: Certificate[] = [
  {
    id: '1',
    type: 'Birth Certificate',
    applicantName: 'John Doe',
    applicationDate: '2023-05-15',
    status: 'Approved',
    certificateNumber: 'BC-2023-001',
    issuedDate: '2023-05-20'
  },
  {
    id: '2',
    type: 'Income Certificate',
    applicantName: 'Jane Smith',
    applicationDate: '2023-06-10',
    status: 'Pending'
  }
];

// Get all certificates
export const getAllCertificates = async (req: Request, res: Response) => {
  try {
    res.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Apply for a certificate
export const applyForCertificate = async (req: Request, res: Response) => {
  try {
    const { type, applicantName } = req.body;
    
    if (!type || !applicantName) {
      return res.status(400).json({ message: 'Type and applicant name are required' });
    }
    
    const newCertificate: Certificate = {
      id: (certificates.length + 1).toString(),
      type,
      applicantName,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    
    certificates.push(newCertificate);
    
    res.status(201).json(newCertificate);
  } catch (error) {
    console.error('Error applying for certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get certificate preview data
export const getCertificatePreview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const certificate = certificates.find(cert => cert.id === id);
    
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
    
    const certificateIndex = certificates.findIndex(cert => cert.id === id);
    
    if (certificateIndex === -1) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    certificates[certificateIndex] = { ...certificates[certificateIndex], ...updates };
    
    res.json(certificates[certificateIndex]);
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get certificate status
export const getCertificateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const certificate = certificates.find(cert => cert.id === id);
    
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
    const certificate = certificates.find(cert => cert.id === id);
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    if (certificate.status !== 'Approved') {
      return res.status(400).json({ message: 'Certificate not approved yet' });
    }
    
    // In a real implementation, this would generate and return an actual PDF
    // For now, we'll simulate a download with a text file
    const fileName = `${certificate.type.replace(/\s+/g, '_')}_${certificate.id}.txt`;
    const fileContent = `Certificate: ${certificate.type}
Applicant: ${certificate.applicantName}
Certificate Number: ${certificate.certificateNumber}
Issued Date: ${certificate.issuedDate}
Status: ${certificate.status}`;
    
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(fileContent);
  } catch (error) {
    console.error('Error downloading certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
};