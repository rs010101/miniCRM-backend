import express from 'express';
import * as orderController from '../controllers/orderController.js';
import authMiddleware from '../../middlewares/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all orders
router.get('/', orderController.getOrders);

// Get a single order by ID
router.get('/:id', orderController.getOrderById);

// Add a new order
router.post('/', orderController.addOrder);

// Update an existing order
router.put('/:id', orderController.updateOrder);

// Delete an order
router.delete('/:id', orderController.deleteOrder);

// Get orders for a specific customer
router.get('/customer/:customerId', orderController.getCustomerOrders);

// Bulk import orders
router.post('/bulk-import', orderController.bulkImportOrders);

export default router;