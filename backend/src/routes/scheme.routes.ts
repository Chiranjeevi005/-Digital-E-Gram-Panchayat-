import { Router } from 'express';
import {
  createScheme,
  getSchemes,
  getSchemeById,
} from '../controllers/scheme.controller';

const router = Router();

router.post('/', createScheme);
router.get('/', getSchemes);
router.get('/:id', getSchemeById);

export default router;