import express from 'express';
import * as segmentRuleController from '../controllers/segmentRuleController.js';
import authMiddleware from '../../middlewares/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all segment rules
router.get('/', segmentRuleController.getSegmentRules);

// Get a single segment rule by ID
router.get('/:id', segmentRuleController.getSegmentRuleById);

// Create a new segment rule
router.post('/', segmentRuleController.createSegmentRule);

// Update an existing segment rule
router.put('/:id', segmentRuleController.updateSegmentRule);

// Delete a segment rule
router.delete('/:id', segmentRuleController.deleteSegmentRule);

// Get customers that match a segment rule
router.get('/:id/customers', segmentRuleController.getCustomersForSegment);

export default router;