import { Request, Response } from 'express';
import Grievance from '../models/Grievance';

export const createGrievance = async (req: Request, res: Response) => {
  try {
    const { citizenId, title, description, category } = req.body;
    
    const grievance = new Grievance({
      citizenId,
      title,
      description,
      category,
    });
    
    await grievance.save();
    res.status(201).json(grievance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGrievances = async (req: Request, res: Response) => {
  try {
    const grievances = await Grievance.find();
    res.json(grievances);
  } catch (error) {
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
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateGrievance = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    
    res.json(grievance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};