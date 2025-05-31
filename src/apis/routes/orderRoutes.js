/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

import express from 'express';
import * as orderController from '../controllers/orderController.js';
import authMiddleware from '../../middlewares/auth.js';

const router = express.Router();
router.use(authMiddleware);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Orders retrieved
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     responses:
 *       201:
 *         description: Order created
 */
router.get('/', orderController.getOrders);
router.post('/', orderController.addOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Order details
 *   put:
 *     summary: Update order by ID
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Order updated
 *   delete:
 *     summary: Delete order by ID
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Order deleted
 */
router.get('/:id', orderController.getOrderById);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

/**
 * @swagger
 * /api/orders/customer/{customerId}:
 *   get:
 *     summary: Get orders for a specific customer
 *     tags: [Orders]
 *     parameters:
 *       - name: customerId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Customer orders retrieved
 */
router.get('/customer/:customerId', orderController.getCustomerOrders);

/**
 * @swagger
 * /api/orders/bulk-import:
 *   post:
 *     summary: Bulk import orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Orders imported
 */
router.post('/bulk-import', orderController.bulkImportOrders);

export default router;
