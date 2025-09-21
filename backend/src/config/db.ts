import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Use MONGODB_URI if available, otherwise fallback to MONGO_URI, then to default
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/digital-e-panchayat';
    console.log('Connecting to MongoDB with URI:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected");
    console.log('MongoDB connection state:', mongoose.connection.readyState);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed", error);
    console.log("⚠️  Running in mock mode without database");
    // In development, we can continue without MongoDB for basic functionality
    if (process.env.NODE_ENV === 'development') {
      console.log("🔧 Development mode: proceeding without database");
    } else {
      // In production, log the error but don't exit to prevent service crash
      console.log("🔧 Production mode: continuing without database - some features may be limited");
      // Don't exit the process - allow the service to run even without database
    }
  }
};

export default connectDB;