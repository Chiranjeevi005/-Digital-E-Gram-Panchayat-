import { Router } from 'express';
import { register, login, getCurrentUser, debugUsers } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user/me', getCurrentUser);
router.get('/debug/users', debugUsers); // Temporary debug route

export default router;