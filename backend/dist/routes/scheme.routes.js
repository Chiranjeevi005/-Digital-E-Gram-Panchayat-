"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scheme_controller_1 = require("../controllers/scheme.controller");
const router = (0, express_1.Router)();
router.post('/', scheme_controller_1.createScheme);
router.get('/', scheme_controller_1.getSchemes);
router.get('/:id', scheme_controller_1.getSchemeById);
exports.default = router;
