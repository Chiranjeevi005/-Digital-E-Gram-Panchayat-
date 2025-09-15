import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user/me', getCurrentUser);

export default router;