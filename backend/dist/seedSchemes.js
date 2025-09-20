"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Scheme_1 = __importDefault(require("./models/Scheme"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Connect to database
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-e-panchayat';
        console.log('Connecting to MongoDB with URI:', mongoUri);
        await mongoose_1.default.connect(mongoUri);
        console.log("✅ MongoDB Connected");
    }
    catch (error) {
        console.error("❌ MongoDB Connection Failed", error);
        process.exit(1);
    }
};
connectDB();
// Sample schemes data
const sampleSchemes = [
    {
        name: 'Agricultural Subsidy Program',
        description: 'Financial assistance for farmers to purchase seeds, fertilizers, and farming equipment. This scheme aims to boost agricultural productivity and support farmers in adopting modern farming techniques.',
        eligibility: 'All registered farmers with valid land ownership documents',
        benefits: 'Up to ₹50,000 subsidy per farmer for agricultural inputs and equipment'
    },
    {
        name: 'Rural Employment Guarantee',
        description: 'Guarantees 100 days of wage employment per year to rural households. The scheme focuses on creating durable infrastructure assets in rural areas while providing employment opportunities.',
        eligibility: 'Any adult member of a rural household',
        benefits: 'Minimum wage payment for unskilled manual work as per state regulations'
    },
    {
        name: 'Women Empowerment Initiative',
        description: 'Supports women entrepreneurs with training, financial assistance, and business development services. The program aims to promote women-led enterprises and enhance economic independence.',
        eligibility: 'Women aged 18-55 years with viable business proposals',
        benefits: 'Interest-free loans up to ₹5,00,000 and skill development training'
    },
    {
        name: 'Educational Scholarship Program',
        description: 'Provides financial assistance to students from economically weaker sections to pursue higher education. Covers tuition fees, books, and other educational expenses for meritorious students.',
        eligibility: 'Students with family income below ₹2,50,000 per annum',
        benefits: 'Scholarships ranging from ₹10,000 to ₹50,000 per annum'
    },
    {
        name: 'Healthcare Support Scheme',
        description: 'Offers financial assistance for medical treatments to families below the poverty line. Covers hospitalization costs, medicines, and diagnostic tests for critical illnesses.',
        eligibility: 'Families with BPL cards and annual income below ₹1,00,000',
        benefits: 'Financial assistance up to ₹2,00,000 per family per year'
    },
    {
        name: 'Senior Citizen Welfare Program',
        description: 'Provides monthly pension and healthcare benefits to senior citizens above 60 years of age. The scheme ensures financial security and access to medical care for elderly citizens.',
        eligibility: 'Citizens above 60 years with no regular income source',
        benefits: 'Monthly pension of ₹2,000 and free healthcare services'
    }
];
const seedSchemes = async () => {
    try {
        // Clear existing schemes
        await Scheme_1.default.deleteMany({});
        console.log('Cleared existing schemes');
        // Insert sample schemes
        const insertedSchemes = await Scheme_1.default.insertMany(sampleSchemes);
        console.log(`Inserted ${insertedSchemes.length} sample schemes`);
        console.log('Sample schemes seeded successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding schemes:', error);
        process.exit(1);
    }
};
// Run the seed function
seedSchemes();
