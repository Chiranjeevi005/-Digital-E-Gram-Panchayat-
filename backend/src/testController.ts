import mongoose from 'mongoose';
import { getSchemes } from './controllers/scheme.controller';
import connectDB from './config/db';

// Connect to database
connectDB();

// Mock request and response objects
const mockReq = {} as any;
const mockRes = {
  json: (data: any) => {
    console.log('Response data:', data);
  },
  status: (code: number) => {
    console.log('Status code:', code);
    return mockRes;
  }
} as any;

const testController = async () => {
  try {
    console.log('Testing getSchemes controller function...');
    await getSchemes(mockReq, mockRes);
    console.log('Controller test completed');
  } catch (error) {
    console.error('Error testing controller:', error);
  } finally {
    mongoose.connection.close();
  }
};

testController();