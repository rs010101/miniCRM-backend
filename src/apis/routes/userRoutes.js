import express from 'express';
import * as userController from '../controllers/userController.js';
import authMiddleware from '../../middlewares/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get user profile
router.get('/profile', userController.getUserProfile);

// Update user data
router.put('/', userController.updateUser);

// Get user data (customers and orders)
router.get('/data', userController.getUserData);

// Save user data (customers and orders)
router.post('/data', userController.saveUserData);

export default router;