import { Request, Response } from 'express';
import CertificateApplication from '../models/CertificateApplication';
import SchemeApplication from '../models/SchemeApplication';
import Grievance from '../models/Grievance';

// Unified interface for tracking items
interface TrackingItem {
  id: string;
  type: 'certificate' | 'scheme' | 'grievance';
  title: string;
  status: string;
  date: string;
  referenceNumber: string;
  serviceType: 'Certificates' | 'Schemes' | 'Grievances';
}

// Get all applications for a user across all services
export const getUserApplications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Fetch certificates for the user
    const certificates = await CertificateApplication.find({ userId: userId });
    
    // Fetch schemes for the user
    const schemes = await SchemeApplication.find({ citizenId: userId });
    
    // Fetch grievances for the user
    const grievances = await Grievance.find({ citizenId: userId });
    
    // Transform certificates to tracking items
    const certificateItems: TrackingItem[] = certificates.map(cert => ({
      id: cert._id.toString(),
      type: 'certificate',
      title: `${cert.certificateType} Certificate Application`,
      status: cert.status,
      date: cert.createdAt.toISOString().split('T')[0],
      referenceNumber: `CERT-${cert._id.toString().substring(0, 8).toUpperCase()}`,
      serviceType: 'Certificates'
    }));
    
    // Transform schemes to tracking items
    const schemeItems: TrackingItem[] = schemes.map(scheme => ({
      id: scheme._id.toString(),
      type: 'scheme',
      title: `${scheme.schemeName} Application`,
      status: scheme.status,
      date: scheme.submittedAt.toISOString().split('T')[0],
      referenceNumber: `SCHM-${scheme._id.toString().substring(0, 8).toUpperCase()}`,
      serviceType: 'Schemes'
    }));
    
    // Transform grievances to tracking items
    const grievanceItems: TrackingItem[] = grievances.map(grievance => ({
      id: grievance._id.toString(),
      type: 'grievance',
      title: grievance.title,
      status: grievance.status,
      date: grievance.createdAt.toISOString().split('T')[0],
      referenceNumber: `GRV-${grievance._id.toString().substring(0, 8).toUpperCase()}`,
      serviceType: 'Grievances'
    }));
    
    // Combine all items and sort by date (newest first)
    const allItems = [...certificateItems, ...schemeItems, ...grievanceItems]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    res.json(allItems);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get application statistics for dashboards
export const getApplicationStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    console.log('Fetching application stats for user:', userId); // Debug log
    
    // Fetch counts for each application type
    const certificateCount = await CertificateApplication.countDocuments({ userId: userId });
    const schemeCount = await SchemeApplication.countDocuments({ citizenId: userId });
    const grievanceCount = await Grievance.countDocuments({ citizenId: userId });
    
    console.log('Counts - Certificates:', certificateCount, 'Schemes:', schemeCount, 'Grievances:', grievanceCount); // Debug log
    
    // Fetch status counts for certificates
    const certificateStatuses = await CertificateApplication.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    // Fetch status counts for schemes
    const schemeStatuses = await SchemeApplication.aggregate([
      { $match: { citizenId: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    // Fetch status counts for grievances
    const grievanceStatuses = await Grievance.aggregate([
      { $match: { citizenId: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    const result = {
      totals: {
        certificates: certificateCount,
        schemes: schemeCount,
        grievances: grievanceCount,
        total: certificateCount + schemeCount + grievanceCount
      },
      statuses: {
        certificates: certificateStatuses.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {} as Record<string, number>),
        schemes: schemeStatuses.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {} as Record<string, number>),
        grievances: grievanceStatuses.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {} as Record<string, number>)
      }
    };
    
    console.log('Returning stats:', result); // Debug log
    res.json(result);
  } catch (error) {
    console.error('Error fetching application statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get recent activity for dashboards
export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    console.log('Fetching recent activity for user:', userId); // Debug log
    
    // Fetch recent certificates
    const recentCertificates = await CertificateApplication.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(5);
    console.log('Found certificates:', recentCertificates.length); // Debug log
    
    // Fetch recent schemes
    const recentSchemes = await SchemeApplication.find({ citizenId: userId })
      .sort({ submittedAt: -1 })
      .limit(5);
    console.log('Found schemes:', recentSchemes.length); // Debug log
    
    // Fetch recent grievances
    const recentGrievances = await Grievance.find({ citizenId: userId })
      .sort({ createdAt: -1 })
      .limit(5);
    console.log('Found grievances:', recentGrievances.length); // Debug log
    
    // Transform to activity format
    const certificateActivities = recentCertificates.map(cert => ({
      id: cert._id.toString(),
      title: `${cert.certificateType} Certificate Application`,
      date: cert.createdAt,
      status: cert.status,
      type: 'Certificates',
      details: `Certificate application for ${cert.certificateType}`
    }));
    
    const schemeActivities = recentSchemes.map(scheme => ({
      id: scheme._id.toString(),
      title: `${scheme.schemeName} Application`,
      date: scheme.submittedAt,
      status: scheme.status,
      type: 'Schemes',
      details: `Scheme application for ${scheme.schemeName}`
    }));
    
    const grievanceActivities = recentGrievances.map(grievance => ({
      id: grievance._id.toString(),
      title: 'Grievance Filed',
      date: grievance.createdAt,
      status: grievance.status,
      type: 'Grievances',
      details: grievance.description || 'Grievance filed'
    }));
    
    // Combine and sort by date (newest first)
    const allActivities = [...certificateActivities, ...schemeActivities, ...grievanceActivities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // Limit to 5 most recent activities
    
    console.log('Returning activities:', allActivities.length); // Debug log
    res.json(allActivities);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};