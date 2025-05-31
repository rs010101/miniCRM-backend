import express from 'express';
import * as campaignController from '../controllers/campaignController.js';
import authMiddleware from '../../middlewares/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

/**
 * @swagger
 * /api/campaigns:
 *   get:
 *     summary: Get all campaigns
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: List of campaigns
 */
router.get('/', campaignController.getCampaigns);

/**
 * @swagger
 * /api/campaigns/with-stats:
 *   get:
 *     summary: Get all campaigns with stats and segment names
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: Campaigns with stats
 */
router.get('/with-stats', campaignController.getAllCampaignsWithStats);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   get:
 *     summary: Get a campaign by ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign details
 */
router.get('/:id', campaignController.getCampaignById);

/**
 * @swagger
 * /api/campaigns:
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Campaign created
 */
router.post('/', campaignController.createCampaign);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   put:
 *     summary: Update an existing campaign
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Campaign updated
 */
router.put('/:id', campaignController.updateCampaign);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   delete:
 *     summary: Delete a campaign
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign deleted
 */
router.delete('/:id', campaignController.deleteCampaign);

/**
 * @swagger
 * /api/campaigns/{id}/send:
 *   post:
 *     summary: Send campaign messages to customers in the segment
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign messages sent
 */
router.post('/:id/send', campaignController.sendCampaignMessages);

/**
 * @swagger
 * /api/campaigns/{campaignId}/stats:
 *   get:
 *     summary: Get campaign statistics
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign statistics retrieved successfully
 */
router.get('/:campaignId/stats', authMiddleware, campaignController.getCampaignStats);

/**
 * @swagger
 * /api/campaigns/ai-suggestions:
 *   post:
 *     summary: Generate AI message suggestions for a campaign
 *     tags: [Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: AI suggestions generated
 */
router.post('/ai-suggestions', campaignController.getAIMessageSuggestions);

export default router;