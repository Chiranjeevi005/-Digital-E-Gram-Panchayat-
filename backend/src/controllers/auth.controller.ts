import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../utils/password.utils';

// Predefined officer and staff emails with default passwords
const OFFICER_EMAIL = 'officer@epanchayat.com';
const OFFICER_DEFAULT_PASSWORD = 'officer123';
const STAFF_EMAILS = ['staff1@epanchayat.com', 'staff2@epanchayat.com'];
const STAFF_DEFAULT_PASSWORD = 'staff123';

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
      { expiresIn: '7d' }
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
  } catch (error: any) {
    console.error('Registration error:', error);
    // More detailed error handling
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid user data provided' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    res.status(500).json({ message: 'Server error during registration', error: error.message });
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

    // For Officer and Staff, create or update account if it doesn't exist or has wrong user type
    if ((userType === 'Officer' || userType === 'Staff')) {
      if (!user) {
        // Create new user with correct user type
        const defaultPassword = userType === 'Officer' ? OFFICER_DEFAULT_PASSWORD : STAFF_DEFAULT_PASSWORD;
        const name = userType; // Use userType as name for Officer/Staff
        const hashedPassword = await hashPassword(defaultPassword);
        user = new User({
          name,
          email,
          password: hashedPassword,
          userType,
        });
        await user.save();
      } else if (user.userType !== userType) {
        // Update existing user's user type if it doesn't match
        user.userType = userType as 'Officer' | 'Staff';
        // Also update the password to the default password for security
        const defaultPassword = userType === 'Officer' ? OFFICER_DEFAULT_PASSWORD : STAFF_DEFAULT_PASSWORD;
        const hashedPassword = await hashPassword(defaultPassword);
        user.password = hashedPassword;
        await user.save();
      }
    }

    // If user doesn't exist and it's not an Officer/Staff account
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password (allow default passwords for predefined accounts)
    let isMatch = await comparePassword(password, user.password);
    
    // For predefined accounts, also check if using default password
    if (!isMatch && 
        ((userType === 'Officer' && email === OFFICER_EMAIL) || 
         (userType === 'Staff' && STAFF_EMAILS.includes(email)))) {
      const defaultPassword = userType === 'Officer' ? OFFICER_DEFAULT_PASSWORD : STAFF_DEFAULT_PASSWORD;
      isMatch = password === defaultPassword;
      
      // If using default password, hash it and update the user's password
      if (isMatch) {
        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        await user.save();
      }
    }
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if Staff limit is exceeded (only check when trying to login as Staff)
    if (userType === 'Staff') {
      // If this is a new Staff login (user was just created or updated), check the limit
      const staffUsers = await User.find({ userType: 'Staff' });
      // Filter out the current user to avoid counting them twice
      const otherStaffUsers = staffUsers.filter(u => u._id.toString() !== user!._id.toString());
      if (otherStaffUsers.length >= 2) {
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
      { expiresIn: '7d' }
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