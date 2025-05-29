import express from 'express';
import * as campaignController from '../controllers/campaignController.js';
import authMiddleware from '../../middlewares/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all campaigns
router.get('/', campaignController.getCampaigns);

// Get all campaigns with their stats and segment names
router.get('/with-stats', campaignController.getAllCampaignsWithStats);

// Get a single campaign by ID
router.get('/:id', campaignController.getCampaignById);

// Create a new campaign
router.post('/', campaignController.createCampaign);

// Update an existing campaign
router.put('/:id', campaignController.updateCampaign);

// Delete a campaign
router.delete('/:id', campaignController.deleteCampaign);

// Send campaign messages to customers in the segment
router.post('/:id/send', campaignController.sendCampaignMessages);

// Get campaign statistics
router.get('/:id/stats', campaignController.getCampaignStats);

// Generate AI message suggestions for a campaign
router.post('/ai-suggestions', campaignController.getAIMessageSuggestions);

export default router;