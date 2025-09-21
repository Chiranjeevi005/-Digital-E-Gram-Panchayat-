"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Scheme_1 = __importDefault(require("./models/Scheme"));
// Load environment variables
dotenv_1.default.config();
// Connect to database
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/digital-e-panchayat';
        console.log('Connecting to MongoDB with URI:', mongoUri);
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ MongoDB Connected');
    }
    catch (error) {
        console.error('❌ MongoDB Connection Failed', error);
        process.exit(1);
    }
};
// Sample schemes data
const sampleSchemes = [
    {
        name: 'Agricultural Subsidy Program',
        description: 'Financial assistance for farmers to purchase seeds, fertilizers, and farming equipment.',
        eligibility: 'All registered farmers with valid land ownership documents',
        benefits: 'Up to ₹50,000 subsidy for crop cultivation and farm equipment'
    },
    {
        name: 'Educational Scholarship Scheme',
        description: 'Merit-based scholarships for students from economically weaker sections.',
        eligibility: 'Students with family income below ₹2.5 lakh per annum',
        benefits: 'Tuition fees coverage and monthly stipend of ₹2,000'
    },
    {
        name: 'Healthcare Support Initiative',
        description: 'Free medical checkups and subsidized treatment for senior citizens.',
        eligibility: 'Citizens above 60 years of age',
        benefits: 'Annual health checkup packages and 70% discount on medicines'
    },
    {
        name: 'Women Empowerment Grant',
        description: 'Financial support for women entrepreneurs to start small businesses.',
        eligibility: 'Women above 18 years with valid Aadhaar and bank account',
        benefits: 'Interest-free loan up to ₹5 lakh and business mentoring'
    },
    {
        name: 'Rural Infrastructure Development',
        description: 'Funding for village infrastructure projects like roads, water supply, and sanitation.',
        eligibility: 'Community groups and local bodies',
        benefits: 'Up to 80% funding for approved infrastructure projects'
    }
];
// Seed schemes
const seedSchemes = async () => {
    try {
        // Clear existing schemes
        await Scheme_1.default.deleteMany({});
        console.log('🧹 Cleared existing schemes');
        // Insert sample schemes
        await Scheme_1.default.insertMany(sampleSchemes);
        console.log('✅ Sample schemes seeded successfully');
        // Verify insertion
        const schemes = await Scheme_1.default.find({});
        console.log(`📊 Total schemes in database: ${schemes.length}`);
        schemes.forEach(scheme => {
            console.log(`- ${scheme.name}`);
        });
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding schemes:', error);
        process.exit(1);
    }
};
// Run the seeding script
const run = async () => {
    await connectDB();
    await seedSchemes();
};
run();
