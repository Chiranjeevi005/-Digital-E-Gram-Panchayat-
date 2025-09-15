import { Request, Response } from 'express';
import Scheme from '../models/Scheme';

export const createScheme = async (req: Request, res: Response) => {
  try {
    const { name, description, eligibility, benefits } = req.body;
    
    const scheme = new Scheme({
      name,
      description,
      eligibility,
      benefits,
    });
    
    await scheme.save();
    res.status(201).json(scheme);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSchemes = async (req: Request, res: Response) => {
  try {
    const schemes = await Scheme.find();
    res.json(schemes);
  } catch (error) {
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
    res.status(500).json({ message: 'Server error' });
  }
};