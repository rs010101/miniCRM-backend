import * as campaignService from '../services/campaignService.js';

/**
 * Get all campaigns for a user
 */
export const getCampaigns = async (req, res) => {
  try {
    const userId = req.user._id;
    const campaigns = await campaignService.getCampaigns(userId);
    res.json(campaigns);
  } catch (error) {
    console.error('Error in getCampaigns controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Create a new campaign
 */
export const createCampaign = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Handle both direct data and wrapped data
    let campaignData;
    if (req.body.campaign) {
      // Data is wrapped in 'campaign' object
      campaignData = req.body.campaign;
      
      // Convert campaignName to name if provided
      if (campaignData.campaignName) {
        campaignData.name = campaignData.name || campaignData.campaignName;
        delete campaignData.campaignName;
      }
    } else {
      // Data is direct
      campaignData = req.body;
    }
    
    console.log('Creating campaign with data:', campaignData);
    
    const campaign = await campaignService.createCampaign(userId, campaignData);
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error in createCampaign controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get a single campaign by ID
 */
export const getCampaignById = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const campaign = await campaignService.getCampaignById(campaignId);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.json(campaign);
  } catch (error) {
    console.error('Error in getCampaignById controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update an existing campaign
 */
export const updateCampaign = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const campaignData = req.body;
    const campaign = await campaignService.updateCampaign(campaignId, campaignData);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.json(campaign);
  } catch (error) {
    console.error('Error in updateCampaign controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete a campaign
 */
export const deleteCampaign = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const result = await campaignService.deleteCampaign(campaignId);
    res.json(result);
  } catch (error) {
    console.error('Error in deleteCampaign controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Send campaign messages to customers in the segment
 */
export const sendCampaignMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const campaignId = req.params.id;
    const result = await campaignService.sendCampaignMessages(userId, campaignId);
    res.json(result);
  } catch (error) {
    console.error('Error in sendCampaignMessages controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get campaign statistics
 */
export const getCampaignStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const campaignId = req.params.id;
    
    try {
      const stats = await campaignService.getCampaignStats(userId, campaignId);
      res.json(stats);
    } catch (statsError) {
      // Handle not found or invalid ID gracefully
      if (statsError.message && statsError.message.includes('not found')) {
        return res.status(404).json({ 
          message: `Campaign not found: ${campaignId}`, 
          error: statsError.message 
        });
      }
      // Handle invalid ObjectId gracefully
      if (statsError.name === 'CastError') {
        return res.status(400).json({ 
          message: `Invalid campaign ID format: ${campaignId}`, 
          error: statsError.message 
        });
      }
      throw statsError; // Re-throw other errors
    }
  } catch (error) {
    console.error('Error in getCampaignStats controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all campaigns with their stats and segment names
 */
export const getAllCampaignsWithStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const campaigns = await campaignService.getAllCampaignsWithStats(userId);
    res.json(campaigns);
  } catch (error) {
    console.error('Error in getAllCampaignsWithStats controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Generate AI message suggestions for a campaign
 */
export const getAIMessageSuggestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { intent, segmentRuleId } = req.body;
    
    if (!intent || !segmentRuleId) {
      return res.status(400).json({ message: 'Intent and segmentRuleId are required' });
    }
    
    const suggestions = await campaignService.getAIMessageSuggestions(intent, segmentRuleId, userId);
    res.json(suggestions);
  } catch (error) {
    console.error('Error in getAIMessageSuggestions controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};