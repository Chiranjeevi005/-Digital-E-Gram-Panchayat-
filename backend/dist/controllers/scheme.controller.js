"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemeById = exports.getSchemes = exports.createScheme = void 0;
const Scheme_1 = __importDefault(require("../models/Scheme"));
const createScheme = async (req, res) => {
    try {
        const { name, description, eligibility, benefits } = req.body;
        const scheme = new Scheme_1.default({
            name,
            description,
            eligibility,
            benefits,
        });
        await scheme.save();
        res.status(201).json(scheme);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createScheme = createScheme;
const getSchemes = async (req, res) => {
    try {
        const schemes = await Scheme_1.default.find();
        res.json(schemes);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getSchemes = getSchemes;
const getSchemeById = async (req, res) => {
    try {
        const scheme = await Scheme_1.default.findById(req.params.id);
        if (!scheme) {
            return res.status(404).json({ message: 'Scheme not found' });
        }
        res.json(scheme);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getSchemeById = getSchemeById;
