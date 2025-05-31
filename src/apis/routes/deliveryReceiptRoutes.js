import express from 'express';
import * as deliveryReceiptController from '../controllers/deliveryReceiptController.js';
import { messageQueue } from '../services/messageQueueService.js';

const router = express.Router();

/**
 * @swagger
 * /api/delivery-receipts/webhook:
 *   post:
 *     summary: Handle message delivery status updates
 *     tags: [Delivery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messageId
 *               - status
 *             properties:
 *               messageId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [sent, delivered, failed]
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Delivery status updated successfully
 */
router.post('/webhook', deliveryReceiptController.handleDeliveryReceipt);

/**
 * @swagger
 * /api/delivery-receipts/queue-status:
 *   get:
 *     summary: Get the current status of the message queue
 *     tags: [Delivery]
 *     responses:
 *       200:
 *         description: Current status of the message queue
 */
router.get('/queue-status', (req, res) => {
  const status = messageQueue.getQueueStatus();
  res.json(status);
});

export default router;