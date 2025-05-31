/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and data operations
 */

import express from 'express';
import * as userController from '../controllers/userController.js';
import authMiddleware from '../../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 */
router.get('/profile', userController.getUserProfile);

/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: Update user data
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User data updated
 */
router.put('/', userController.updateUser);

/**
 * @swagger
 * /api/user/data:
 *   get:
 *     summary: Get user-related customer and order data
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Data fetched
 *   post:
 *     summary: Save user-related customer and order data
 *     tags: [User]
 *     responses:
 *       201:
 *         description: Data saved
 */
router.get('/data', userController.getUserData);
router.post('/data', userController.saveUserData);

export default router;