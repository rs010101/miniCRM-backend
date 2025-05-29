import express from 'express';
import * as segmentRuleController from '../controllers/segmentRuleController.js';
import authMiddleware from '../../middlewares/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

/**
 * @swagger
 * /api/segment-rules:
 *   get:
 *     summary: Get all segment rules
 *     tags: [SegmentRules]
 *     responses:
 *       200:
 *         description: A list of segment rules
 */
router.get('/', segmentRuleController.getSegmentRules);

/**
 * @swagger
 * /api/segment-rules/{id}:
 *   get:
 *     summary: Get a single segment rule by ID
 *     tags: [SegmentRules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Segment rule ID
 *     responses:
 *       200:
 *         description: Segment rule data
 */
router.get('/:id', segmentRuleController.getSegmentRuleById);

/**
 * @swagger
 * /api/segment-rules:
 *   post:
 *     summary: Create a new segment rule
 *     tags: [SegmentRules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Segment rule created
 */
router.post('/', segmentRuleController.createSegmentRule);

/**
 * @swagger
 * /api/segment-rules/{id}:
 *   put:
 *     summary: Update an existing segment rule
 *     tags: [SegmentRules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Segment rule updated
 */
router.put('/:id', segmentRuleController.updateSegmentRule);

/**
 * @swagger
 * /api/segment-rules/{id}:
 *   delete:
 *     summary: Delete a segment rule
 *     tags: [SegmentRules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Segment rule deleted
 */
router.delete('/:id', segmentRuleController.deleteSegmentRule);

/**
 * @swagger
 * /api/segment-rules/{id}/customers:
 *   get:
 *     summary: Get customers matching a segment rule
 *     tags: [SegmentRules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customers list
 */
router.get('/:id/customers', segmentRuleController.getCustomersForSegment);

export default router;
