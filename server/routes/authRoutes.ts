import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticateJWT, getMe);
router.put('/me', authenticateJWT, updateProfile);
router.put('/profile', authenticateJWT, updateProfile);

export default router;
