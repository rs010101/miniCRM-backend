import express from 'express';
import * as communicationLogController from '../controllers/communicationLogController.js';
import authMiddleware from '../../middlewares/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all communication logs
router.get('/', communicationLogController.getCommunicationLogs);

// Get communication logs for a specific campaign
router.get('/campaign/:campaignId', communicationLogController.getCampaignLogs);

// Get communication logs for a specific customer
router.get('/customer/:customerId', communicationLogController.getCustomerLogs);

// Create a new communication log
router.post('/', communicationLogController.createCommunicationLog);

// Update communication log status (for delivery receipt API)
router.put('/:id/status', communicationLogController.updateLogStatus);

// Delete a communication log
router.delete('/:id', communicationLogController.deleteLog);

// Get communication log statistics
router.get('/stats', communicationLogController.getLogStats);

export default router;