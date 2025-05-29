/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management
 */

import express from 'express';
import * as customerController from '../controllers/customerController.js';
import authMiddleware from '../../middlewares/auth.js';

const router = express.Router();
router.use(authMiddleware);

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Customer list
 *   post:
 *     summary: Add a new customer
 *     tags: [Customers]
 *     responses:
 *       201:
 *         description: Customer created
 */
router.get('/', customerController.getCustomers);
router.post('/', customerController.addCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer found
 *   put:
 *     summary: Update customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Customer updated
 *   delete:
 *     summary: Delete customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Customer deleted
 */
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

/**
 * @swagger
 * /api/customers/bulk-import:
 *   post:
 *     summary: Bulk import customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Bulk import successful
 */
router.post('/bulk-import', customerController.bulkImportCustomers);

export default router;