"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        // Use MONGODB_URI if available, otherwise fallback to MONGO_URI, then to default
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/digital-e-panchayat';
        await mongoose_1.default.connect(mongoUri);
        console.log("✅ MongoDB Connected");
    }
    catch (error) {
        console.error("❌ MongoDB Connection Failed", error);
        console.log("⚠️  Running in mock mode without database");
        // In development, we can continue without MongoDB for basic functionality
        if (process.env.NODE_ENV === 'development') {
            console.log("🔧 Development mode: proceeding without database");
        }
        else {
            process.exit(1);
        }
    }
};
exports.default = connectDB;
