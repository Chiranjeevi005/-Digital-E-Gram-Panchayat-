import mongoose from 'mongoose';
import Scheme from './models/Scheme';
import connectDB from './config/db';

// Connect to database
connectDB();

const testSchemes = async () => {
  try {
    // Check if schemes exist
    const schemes = await Scheme.find();
    console.log(`Found ${schemes.length} schemes in database:`);
    console.log(schemes);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error testing schemes:', error);
    mongoose.connection.close();
  }
};

testSchemes();