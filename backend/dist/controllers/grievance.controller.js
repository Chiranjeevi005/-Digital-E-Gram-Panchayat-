"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGrievance = exports.getGrievanceById = exports.getGrievances = exports.createGrievance = void 0;
const Grievance_1 = __importDefault(require("../models/Grievance"));
const createGrievance = async (req, res) => {
    try {
        const { citizenId, title, description, category } = req.body;
        const grievance = new Grievance_1.default({
            citizenId,
            title,
            description,
            category,
        });
        await grievance.save();
        res.status(201).json(grievance);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createGrievance = createGrievance;
const getGrievances = async (req, res) => {
    try {
        const grievances = await Grievance_1.default.find();
        res.json(grievances);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getGrievances = getGrievances;
const getGrievanceById = async (req, res) => {
    try {
        const grievance = await Grievance_1.default.findById(req.params.id);
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }
        res.json(grievance);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getGrievanceById = getGrievanceById;
const updateGrievance = async (req, res) => {
    try {
        const { status } = req.body;
        const grievance = await Grievance_1.default.findByIdAndUpdate(req.params.id, { status, updatedAt: new Date() }, { new: true });
        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }
        res.json(grievance);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateGrievance = updateGrievance;
