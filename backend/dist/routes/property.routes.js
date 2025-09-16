"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const property_controller_1 = require("../controllers/property.controller");
const router = express_1.default.Router();
// Property Tax Routes
router.post('/property-tax', property_controller_1.getPropertyTax);
router.get('/property-tax/:id/download', property_controller_1.downloadPropertyTaxReceipt);
// Mutation Status Routes
router.post('/mutation-status', property_controller_1.getMutationStatus);
router.get('/mutation-status/:id/download', property_controller_1.downloadMutationAcknowledgement);
exports.default = router;
