"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.debugUsers = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const password_utils_1 = require("../utils/password.utils");
// Predefined officer and staff emails with default passwords
const OFFICER_EMAIL = 'officer@epanchayat.com';
const OFFICER_DEFAULT_PASSWORD = 'officer123';
const STAFF_EMAILS = ['staff1@epanchayat.com', 'staff2@epanchayat.com'];
const STAFF_DEFAULT_PASSWORD = 'staff123';
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
        }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password, userType } = req.body;
        // Validate user type
        if (!userType || !['Citizen', 'Officer', 'Staff'].includes(userType)) {
            return res.status(400).json({ message: 'Invalid user type. Please select Citizen, Officer, or Staff.' });
        }
        // Check if this is a predefined officer or staff account
        const isPredefinedOfficer = email === OFFICER_EMAIL;
        const isPredefinedStaff = STAFF_EMAILS.includes(email);
        const isPredefinedAccount = isPredefinedOfficer || isPredefinedStaff;
        // Validate that predefined accounts are used with correct user type
        if (isPredefinedOfficer && userType !== 'Officer') {
            return res.status(400).json({
                message: `Invalid officer credentials. Please use Officer user type with ${OFFICER_EMAIL}.`
            });
        }
        if (isPredefinedStaff && userType !== 'Staff') {
            return res.status(400).json({
                message: `Invalid staff credentials. Please use Staff user type with one of the following emails: ${STAFF_EMAILS.join(', ')}.`
            });
        }
        // Check if user exists
        let user = await User_1.default.findOne({ email });
        // For Officer and Staff predefined accounts, create or update account if it doesn't exist or has wrong user type
        if (isPredefinedAccount) {
            if (!user) {
                // Create new user with correct user type
                const defaultPassword = isPredefinedOfficer ? OFFICER_DEFAULT_PASSWORD : STAFF_DEFAULT_PASSWORD;
                const name = isPredefinedOfficer ? 'Officer' : 'Staff';
                const hashedPassword = await (0, password_utils_1.hashPassword)(defaultPassword);
                user = new User_1.default({
                    name,
                    email,
                    password: hashedPassword,
                    userType: isPredefinedOfficer ? 'Officer' : 'Staff',
                });
                await user.save();
            }
            else if (user.userType !== (isPredefinedOfficer ? 'Officer' : 'Staff')) {
                // Update existing user's user type if it doesn't match
                user.userType = isPredefinedOfficer ? 'Officer' : 'Staff';
                // Also update the password to the default password for security
                const defaultPassword = isPredefinedOfficer ? OFFICER_DEFAULT_PASSWORD : STAFF_DEFAULT_PASSWORD;
                const hashedPassword = await (0, password_utils_1.hashPassword)(defaultPassword);
                user.password = hashedPassword;
                await user.save();
            }
        }
        // If user doesn't exist and it's not a predefined account
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials. Please check your email and password.' });
        }
        // Check password (allow default passwords for predefined accounts)
        let isMatch = await (0, password_utils_1.comparePassword)(password, user.password);
        // For predefined accounts, also check if using default password
        if (!isMatch && isPredefinedAccount) {
            const defaultPassword = isPredefinedOfficer ? OFFICER_DEFAULT_PASSWORD : STAFF_DEFAULT_PASSWORD;
            isMatch = password === defaultPassword;
            // If using default password, hash it and update the user's password
            if (isMatch) {
                const hashedPassword = await (0, password_utils_1.hashPassword)(password);
                user.password = hashedPassword;
                await user.save();
            }
        }
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials. Please check your email and password.' });
        }
        // Check if Staff limit is exceeded (only check when trying to login as Staff)
        if (userType === 'Staff') {
            // If this is a new Staff login (user was just created or updated), check the limit
            const staffUsers = await User_1.default.find({ userType: 'Staff' });
            // Filter out the current user to avoid counting them twice
            const otherStaffUsers = staffUsers.filter(u => u._id.toString() !== user._id.toString());
            if (otherStaffUsers.length >= 2) {
                return res.status(400).json({ message: 'Staff account limit exceeded. Only 2 staff accounts are allowed.' });
            }
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
            userType: user.userType,
            name: user.name,
            email: user.email // Add email to token payload for better identification
        }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
        res.status(500).json({ message: 'Server error during login. Please try again later.' });
    }
};
exports.login = login;
// Temporary debugging function to check users in database
const debugUsers = async (req, res) => {
    try {
        const users = await User_1.default.find({});
        res.json(users);
    }
    catch (error) {
        console.error('Debug users error:', error);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
};
exports.debugUsers = debugUsers;
// Get current user details
const getCurrentUser = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Check if this is a predefined officer or staff account
        const isPredefinedOfficer = decoded.email === OFFICER_EMAIL;
        const isPredefinedStaff = STAFF_EMAILS.includes(decoded.email);
        if (isPredefinedOfficer || isPredefinedStaff) {
            // For predefined accounts, we might need to recreate them if they don't exist
            let user = await User_1.default.findById(decoded.userId);
            // If user doesn't exist or has wrong user type, fix it
            if (!user || (isPredefinedOfficer && user.userType !== 'Officer') || (isPredefinedStaff && user.userType !== 'Staff')) {
                // If user exists but has wrong user type, update it
                if (user) {
                    user.userType = isPredefinedOfficer ? 'Officer' : 'Staff';
                    // Also update the password to the default password for security
                    const defaultPassword = isPredefinedOfficer ? OFFICER_DEFAULT_PASSWORD : STAFF_DEFAULT_PASSWORD;
                    const hashedPassword = await (0, password_utils_1.hashPassword)(defaultPassword);
                    user.password = hashedPassword;
                    await user.save();
                }
                else {
                    // Recreate the predefined account
                    const userType = isPredefinedOfficer ? 'Officer' : 'Staff';
                    const defaultPassword = isPredefinedOfficer ? OFFICER_DEFAULT_PASSWORD : STAFF_DEFAULT_PASSWORD;
                    const name = userType; // Use userType as name for Officer/Staff
                    const hashedPassword = await (0, password_utils_1.hashPassword)(defaultPassword);
                    user = new User_1.default({
                        _id: decoded.userId, // Try to use the same ID from the token
                        name,
                        email: decoded.email,
                        password: hashedPassword,
                        userType,
                    });
                    try {
                        await user.save();
                    }
                    catch (saveError) {
                        // If saving with the same ID fails, create a new user
                        user._id = new mongoose_1.default.Types.ObjectId();
                        await user.save();
                    }
                }
            }
            // Return user data without password (consistent with the frontend expectations)
            const userData = {
                id: user._id.toString(), // Convert to string to match frontend expectations
                name: user.name,
                email: user.email,
                userType: user.userType
            };
            return res.json(userData);
        }
        // For regular users (citizens)
        const user = await User_1.default.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Return user data without password (consistent with frontend expectations)
        const userData = {
            id: user._id.toString(), // Convert to string to match frontend expectations
            name: user.name,
            email: user.email,
            userType: user.userType
        };
        res.json(userData);
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
