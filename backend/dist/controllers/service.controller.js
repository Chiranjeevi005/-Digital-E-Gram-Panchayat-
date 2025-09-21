"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceRequest = exports.getServiceRequestById = exports.getServiceRequests = exports.createServiceRequest = void 0;
const ServiceRequest_1 = __importDefault(require("../models/ServiceRequest"));
const socket_1 = require("../utils/socket"); // Import socket utility
const createServiceRequest = async (req, res) => {
    try {
        const { citizenId, serviceType, description } = req.body;
        const serviceRequest = new ServiceRequest_1.default({
            citizenId,
            serviceType,
            description,
        });
        await serviceRequest.save();
        // Emit real-time update to the citizen who created the service request
        (0, socket_1.emitApplicationUpdate)(citizenId, serviceRequest._id.toString(), 'Services', serviceRequest.status, `Service request for ${serviceType} created successfully`);
        res.status(201).json(serviceRequest);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createServiceRequest = createServiceRequest;
const getServiceRequests = async (req, res) => {
    try {
        const serviceRequests = await ServiceRequest_1.default.find();
        res.json(serviceRequests);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getServiceRequests = getServiceRequests;
const getServiceRequestById = async (req, res) => {
    try {
        const serviceRequest = await ServiceRequest_1.default.findById(req.params.id);
        if (!serviceRequest) {
            return res.status(404).json({ message: 'Service request not found' });
        }
        res.json(serviceRequest);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getServiceRequestById = getServiceRequestById;
const updateServiceRequest = async (req, res) => {
    try {
        const { status } = req.body;
        const serviceRequest = await ServiceRequest_1.default.findByIdAndUpdate(req.params.id, { status, updatedAt: new Date() }, { new: true });
        if (!serviceRequest) {
            return res.status(404).json({ message: 'Service request not found' });
        }
        // Emit real-time update to the citizen who created the service request
        (0, socket_1.emitApplicationUpdate)(serviceRequest.citizenId, serviceRequest._id.toString(), 'Services', serviceRequest.status, `Service request status updated to ${status}`);
        res.json(serviceRequest);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateServiceRequest = updateServiceRequest;
