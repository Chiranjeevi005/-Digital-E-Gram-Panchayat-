"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupTests;
// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.MONGODB_URI = 'mongodb://localhost:27017/digital-e-panchayat-test';
// Mock bcrypt
jest.mock('bcrypt', () => {
    return {
        hash: jest.fn().mockImplementation((password) => Promise.resolve(`hashed-${password}`)),
        compare: jest.fn().mockImplementation((password, hash) => Promise.resolve(password === hash || password === hash.replace('hashed-', ''))),
    };
});
// Mock the User model
jest.mock('../src/models/User', () => {
    const mockUserInstance = {
        _id: 'mock-user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        userType: 'Citizen',
        save: jest.fn().mockResolvedValue(this),
    };
    const mockUserModel = {
        findOne: jest.fn().mockResolvedValue(null),
        find: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockImplementation((userData) => {
            return Promise.resolve({
                ...mockUserInstance,
                ...userData,
                _id: 'mock-user-id-' + Math.random(),
            });
        }),
        findById: jest.fn().mockResolvedValue(mockUserInstance),
        findByIdAndUpdate: jest.fn().mockResolvedValue(mockUserInstance),
        deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 }),
    };
    // Make it work with 'new User()'
    const UserConstructor = jest.fn().mockImplementation((userData) => {
        return {
            ...mockUserInstance,
            ...userData,
            save: jest.fn().mockResolvedValue({
                ...mockUserInstance,
                ...userData,
            }),
        };
    });
    // Attach static methods to the constructor
    Object.assign(UserConstructor, mockUserModel);
    return UserConstructor;
});
// Mock password utilities
jest.mock('../src/utils/password.utils', () => {
    return {
        hashPassword: jest.fn().mockImplementation((password) => Promise.resolve(`hashed-${password}`)),
        comparePassword: jest.fn().mockImplementation((password, hash) => Promise.resolve(password === hash || password === hash.replace('hashed-', ''))),
    };
});
// Mock MongoDB connection for tests
jest.mock('mongoose', () => {
    const actualMongoose = jest.requireActual('mongoose');
    return {
        ...actualMongoose,
        connect: jest.fn().mockResolvedValue(undefined),
        connection: {
            close: jest.fn().mockResolvedValue(undefined),
            dropDatabase: jest.fn().mockResolvedValue(undefined),
        },
    };
});
async function setupTests() {
    // Any additional test setup can go here
}
