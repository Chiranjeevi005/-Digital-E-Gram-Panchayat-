"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const password_utils_1 = require("../utils/password.utils");
// Predefined officer and staff emails
const OFFICER_EMAIL = 'officer@epanchayat.com';
const STAFF_EMAILS = ['staff1@epanchayat.com', 'staff2@epanchayat.com'];
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // For registration, only citizens can register
        const userType = 'Citizen';
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }
        // Hash password
        const hashedPassword = await (0, password_utils_1.hashPassword)(password);
        // Create user (only citizens can register)
        const user = new User_1.default({
            name,
            email,
            password: hashedPassword,
            userType,
        });
        await user.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
            userType: user.userType,
            name: user.name
        }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};
exports.register = register;
const login = async (req, res) => {
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
        let user = await User_1.default.findOne({ email });
        // For Officer and Staff, create account if it doesn't exist
        if (!user && (userType === 'Officer' || userType === 'Staff')) {
            const name = userType; // Use userType as name for Officer/Staff
            const hashedPassword = await (0, password_utils_1.hashPassword)(password);
            user = new User_1.default({
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
        const isMatch = await (0, password_utils_1.comparePassword)(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Check user type matches
        if (user.userType !== userType) {
            return res.status(400).json({ message: 'User type mismatch' });
        }
        // Check if Staff limit is exceeded
        if (userType === 'Staff') {
            const staffCount = await User_1.default.countDocuments({ userType: 'Staff' });
            if (staffCount > 2) {
                return res.status(400).json({ message: 'Staff account limit exceeded' });
            }
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
            userType: user.userType,
            name: user.name
        }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};
exports.login = login;
// Get current user details
const getCurrentUser = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Get current user error:', error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Server error while fetching user data' });
    }
};
exports.getCurrentUser = getCurrentUser;
