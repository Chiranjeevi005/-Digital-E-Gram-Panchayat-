import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../utils/password.utils';

// Predefined officer and staff emails
const OFFICER_EMAIL = 'officer@epanchayat.com';
const STAFF_EMAILS = ['staff1@epanchayat.com', 'staff2@epanchayat.com'];

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // For registration, only citizens can register
    const userType = 'Citizen';

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user (only citizens can register)
    const user = new User({
      name,
      email,
      password: hashedPassword,
      userType,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        userType: user.userType,
        name: user.name
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        userType: user.userType 
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, userType } = req.body;

    // Validate user type
    if (!userType || !['Citizen', 'Officer', 'Staff'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Check predefined accounts for Officer and Staff
    if (userType === 'Officer' && email !== OFFICER_EMAIL) {
      return res.status(400).json({ message: 'Invalid officer credentials' });
    }

    if (userType === 'Staff' && !STAFF_EMAILS.includes(email)) {
      return res.status(400).json({ message: 'Invalid staff credentials' });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    // For Officer and Staff, create account if it doesn't exist
    if (!user && (userType === 'Officer' || userType === 'Staff')) {
      const name = userType; // Use userType as name for Officer/Staff
      const hashedPassword = await hashPassword(password);
      user = new User({
        name,
        email,
        password: hashedPassword,
        userType,
      });
      await user.save();
    }

    // If user doesn't exist and it's not an Officer/Staff account
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check user type matches
    if (user.userType !== userType) {
      return res.status(400).json({ message: 'User type mismatch' });
    }

    // Check if Staff limit is exceeded
    if (userType === 'Staff') {
      const staffCount = await User.countDocuments({ userType: 'Staff' });
      if (staffCount > 2) {
        return res.status(400).json({ message: 'Staff account limit exceeded' });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        userType: user.userType,
        name: user.name
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        userType: user.userType 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user details
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error while fetching user data' });
  }
};