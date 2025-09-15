"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const grievance_routes_1 = __importDefault(require("./routes/grievance.routes"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const scheme_routes_1 = __importDefault(require("./routes/scheme.routes"));
const certificate_routes_1 = __importDefault(require("./routes/certificate.routes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
    credentials: true
}));
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/grievances', grievance_routes_1.default);
app.use('/api/services', service_routes_1.default);
app.use('/api/schemes', scheme_routes_1.default);
app.use('/api/certificates', certificate_routes_1.default);
// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Digital E-Panchayat API' });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
exports.default = app;
