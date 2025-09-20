import mongoose from 'mongoose';
import Scheme from './models/Scheme';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const debugSchemes = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/digital-e-panchayat';
    console.log('Connecting to MongoDB with URI:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected");
    console.log('MongoDB connection state:', mongoose.connection.readyState);

    // Fetch schemes directly
    console.log('Fetching schemes directly from database...');
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    console.log(`Found ${schemes.length} schemes`);
    console.log('Schemes data:', JSON.stringify(schemes, null, 2));

    // Close connection
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error in debug script:', error);
  }
};

debugSchemes();