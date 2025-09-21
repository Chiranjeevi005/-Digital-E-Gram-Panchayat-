import { Request, Response } from 'express';
import ServiceRequest from '../models/ServiceRequest';
import { emitApplicationUpdate } from '../utils/socket'; // Import socket utility

export const createServiceRequest = async (req: Request, res: Response) => {
  try {
    const { citizenId, serviceType, description } = req.body;
    
    const serviceRequest = new ServiceRequest({
      citizenId,
      serviceType,
      description,
    });
    
    await serviceRequest.save();
    
    // Emit real-time update to the citizen who created the service request
    emitApplicationUpdate(
      citizenId,
      serviceRequest._id.toString(),
      'Services',
      serviceRequest.status,
      `Service request for ${serviceType} created successfully`
    );
    
    res.status(201).json(serviceRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getServiceRequests = async (req: Request, res: Response) => {
  try {
    const serviceRequests = await ServiceRequest.find();
    res.json(serviceRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getServiceRequestById = async (req: Request, res: Response) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id);
    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }
    res.json(serviceRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateServiceRequest = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const serviceRequest = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }
    
    // Emit real-time update to the citizen who created the service request
    emitApplicationUpdate(
      serviceRequest.citizenId,
      serviceRequest._id.toString(),
      'Services',
      serviceRequest.status,
      `Service request status updated to ${status}`
    );
    
    res.json(serviceRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};