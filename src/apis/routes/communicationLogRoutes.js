import express from 'express';
import * as communicationLogController from '../controllers/communicationLogController.js';
import authMiddleware from '../../middlewares/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

/**
 * @swagger
 * /api/communication-logs:
 *   get:
 *     summary: Get all communication logs
 *     tags: [Communication Logs]
 *     responses:
 *       200:
 *         description: List of communication logs
 */
router.get('/', communicationLogController.getCommunicationLogs);

/**
 * @swagger
 * /api/communication-logs/campaign/{campaignId}:
 *   get:
 *     summary: Get communication logs for a specific campaign
 *     tags: [Communication Logs]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign communication logs
 */
router.get('/campaign/:campaignId', communicationLogController.getCampaignLogs);

/**
 * @swagger
 * /api/communication-logs/customer/{customerId}:
 *   get:
 *     summary: Get communication logs for a specific customer
 *     tags: [Communication Logs]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer communication logs
 */
router.get('/customer/:customerId', communicationLogController.getCustomerLogs);

/**
 * @swagger
 * /api/communication-logs:
 *   post:
 *     summary: Create a new communication log
 *     tags: [Communication Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Communication log created
 */
router.post('/', communicationLogController.createCommunicationLog);

/**
 * @swagger
 * /api/communication-logs/{id}/status:
 *   put:
 *     summary: Update communication log status
 *     tags: [Communication Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Communication log ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Communication log status updated
 */
router.put('/:id/status', communicationLogController.updateLogStatus);

/**
 * @swagger
 * /api/communication-logs/{id}:
 *   delete:
 *     summary: Delete a communication log
 *     tags: [Communication Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Communication log ID
 *     responses:
 *       200:
 *         description: Communication log deleted
 */
router.delete('/:id', communicationLogController.deleteLog);

/**
 * @swagger
 * /api/communication-logs/stats:
 *   get:
 *     summary: Get communication log statistics
 *     tags: [Communication Logs]
 *     responses:
 *       200:
 *         description: Communication log statistics
 */
router.get('/stats', communicationLogController.getLogStats);

export default router;