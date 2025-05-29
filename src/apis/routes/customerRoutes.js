import express from 'express';
import * as customerController from '../controllers/customerController.js';
import authMiddleware from '../../middlewares/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all customers
router.get('/', customerController.getCustomers);

// Get a single customer by ID
router.get('/:id', customerController.getCustomerById);

// Add a new customer
router.post('/', customerController.addCustomer);

// Update an existing customer
router.put('/:id', customerController.updateCustomer);

// Delete a customer
router.delete('/:id', customerController.deleteCustomer);

// Bulk import customers
router.post('/bulk-import', customerController.bulkImportCustomers);

export default router;