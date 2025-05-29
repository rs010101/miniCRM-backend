import Campaign from '../../models/Campaign.js';
import CommunicationLog from '../../models/CommunicationLog.js';
import { getSegmentRuleById, getCustomersForSegment } from './segmentRuleService.js';
import axios from 'axios';

/**
 * Get all campaigns for a user
 */
export const getCampaigns = async (userId) => {
  try {
    // Populate the segmentRuleId field to get segment names
    const campaigns = await Campaign.find({ userId }).populate('segmentRuleId');
    
    // Format the response to include helpful fields
    return campaigns.map(campaign => {
      const formattedCampaign = campaign.toObject();
      
      // Add segmentName as a direct property for easier access
      if (campaign.segmentRuleId && campaign.segmentRuleId.name) {
        formattedCampaign.segmentName = campaign.segmentRuleId.name;
      }
      
      // Ensure createdAt is available for frontend display
      if (campaign.created_at && !campaign.createdAt) {
        formattedCampaign.createdAt = campaign.created_at;
      }
      
      return formattedCampaign;
    });
  } catch (error) {
    console.error('Error getting campaigns:', error);
    throw error;
  }
};

/**
 * Create a new campaign
 */
export const createCampaign = async (userId, campaignData) => {
  try {
    const campaign = new Campaign({
      userId,
      ...campaignData
    });
    
    await campaign.save();
    return campaign;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};

/**
 * Get a single campaign by ID
 */
export const getCampaignById = async (campaignId) => {
  try {
    const campaign = await Campaign.findById(campaignId).populate('segmentRuleId');
    return campaign;
  } catch (error) {
    console.error('Error getting campaign:', error);
    throw error;
  }
};

/**
 * Update an existing campaign
 */
export const updateCampaign = async (campaignId, campaignData) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      campaignId,
      campaignData,
      { new: true }
    );
    return campaign;
  } catch (error) {
    console.error('Error updating campaign:', error);
    throw error;
  }
};

/**
 * Delete a campaign
 */
export const deleteCampaign = async (campaignId) => {
  try {
    await Campaign.findByIdAndDelete(campaignId);
    // Also delete associated communication logs
    await CommunicationLog.deleteMany({ campaignId });
    return { success: true };
  } catch (error) {
    console.error('Error deleting campaign:', error);
    throw error;
  }
};

/**
 * Send campaign messages to customers in the segment
 */
export const sendCampaignMessages = async (userId, campaignId) => {
  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    const customers = await getCustomersForSegment(userId, campaign.segmentRuleId);
    
    // Create communication logs for each customer
    const communicationLogs = [];
    
    for (const customer of customers) {
      const log = new CommunicationLog({
        userId,
        campaignId,
        customerId: customer._id,
        message: campaign.message,
        status: 'pending',
        sent_at: new Date()
      });
      
      await log.save();
      communicationLogs.push(log);
      
      // Here you would integrate with actual messaging service
      // For now, we'll just simulate sending
      // simulateSendMessage(customer, campaign.message, log._id);
    }
    
    return {
      campaign,
      customersCount: customers.length,
      communicationLogs
    };
  } catch (error) {
    console.error('Error sending campaign messages:', error);
    throw error;
  }
};

/**
 * Update communication log status
 */
export const updateCommunicationStatus = async (logId, status, metadata = {}) => {
  try {
    const statusFields = {};
    
    if (status === 'sent') {
      statusFields.sent_at = new Date();
    } else if (status === 'delivered') {
      statusFields.delivered_at = new Date();
    } else if (status === 'read') {
      statusFields.read_at = new Date();
    } else if (status === 'failed') {
      statusFields.failed_at = new Date();
      statusFields.error = metadata.error || 'Unknown error';
    }
    
    const log = await CommunicationLog.findByIdAndUpdate(
      logId,
      { 
        status,
        ...statusFields,
        ...(Object.keys(metadata).length > 0 ? { metadata } : {})
      },
      { new: true }
    );
    
    return log;
  } catch (error) {
    console.error('Error updating communication status:', error);
    throw error;
  }
};

/**
 * Get campaign statistics
 */
export const getCampaignStats = async (userId, campaignId) => {
  try {
    // Handle string IDs that aren't valid ObjectIds
    let campaign;
    try {
      // Try to find the campaign by ID first
      campaign = await Campaign.findById(campaignId).populate('segmentRuleId');
    } catch (idError) {
      // If that fails, maybe it's a campaign name
      campaign = await Campaign.findOne({ 
        userId, 
        $or: [
          { name: campaignId },
          { _id: campaignId }
        ] 
      }).populate('segmentRuleId');
    }
    
    if (!campaign) {
      throw new Error(`Campaign not found: ${campaignId}`);
    }
    
    // Now use the actual campaign ID
    const logs = await CommunicationLog.find({ 
      userId, 
      campaignId: campaign._id 
    });
    
    const stats = {
      total: logs.length,
      pending: logs.filter(log => log.status === 'pending').length,
      sent: logs.filter(log => log.status === 'sent').length,
      delivered: logs.filter(log => log.status === 'delivered').length,
      read: logs.filter(log => log.status === 'read').length,
      failed: logs.filter(log => log.status === 'failed').length,
      name: campaign.name,
      message: campaign.message,
      segmentName: campaign.segmentRuleId ? campaign.segmentRuleId.name : 'Unknown',
      summary: `Campaign sent to ${logs.length} customers.`
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting campaign stats:', error);
    throw error;
  }
};

/**
 * Get all campaigns with their stats and segment names
 */
export const getAllCampaignsWithStats = async (userId) => {
  try {
    const campaigns = await Campaign.find({ userId }).populate('segmentRuleId');
    
    const campaignsWithStats = await Promise.all(campaigns.map(async (campaign) => {
      const stats = await getCampaignStats(userId, campaign._id);
      
      return {
        _id: campaign._id,
        name: campaign.name,
        intent: campaign.intent,
        message: campaign.message,
        created_at: campaign.created_at,
        segmentName: campaign.segmentRuleId ? campaign.segmentRuleId.name : 'Unknown',
        stats
      };
    }));
    
    return campaignsWithStats;
  } catch (error) {
    console.error('Error getting campaigns with stats:', error);
    throw error;
  }
};

/**
 * Generate AI message suggestions for a campaign
 */
export const getAIMessageSuggestions = async (intent, segmentRuleId, userId) => {
  try {
    // Check if Gemini API key is configured
    const GEMINI_API_KEY = 'AIzaSyDagmaulncEf7VJt6asZalOsMXa9zOaq8g';
    
    if (!GEMINI_API_KEY) {
      console.log('Gemini API key not configured, using fallback messages');
      return generateFallbackMessages(intent);
    }
    
    // Get segment rule and matching customers
    const segmentRule = await getSegmentRuleById(segmentRuleId);
    const customers = await getCustomersForSegment(userId, segmentRuleId);
    
    // Prepare prompt for Gemini
    const prompt = `Generate 3 different marketing messages for a campaign with the intent: "${intent}".
    The target audience is defined by these criteria: ${JSON.stringify(segmentRule.rules)}.
    There are ${customers.length} customers in this segment.
    Each message should be concise, engaging, and tailored to this specific audience.
    Format the response as a JSON array of strings.`;
    
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      let suggestions;
      try {
        // Parse the Gemini response which has a different structure than OpenAI
        const content = response.data.candidates[0].content.parts[0].text;
        
        // Try to extract a JSON array from the text response
        const match = content.match(/\[.*\]/s);
        if (match) {
          suggestions = JSON.parse(match[0]);
        } else {
          // If no JSON array is found, extract messages by splitting on newlines or bullet points
          suggestions = content
            .split(/\n+/)
            .filter(line => line.trim().length > 0 && (line.includes('"') || line.startsWith('-') || line.startsWith('*')))
            .map(line => line.replace(/^["-*\s]+|["-]+$/g, '').trim())
            .filter(line => line.length > 10)
            .slice(0, 3);
        }
        
        // Ensure we have at least 3 suggestions
        if (!Array.isArray(suggestions) || suggestions.length < 3) {
          const fallback = generateFallbackMessages(intent);
          suggestions = Array.isArray(suggestions) ? 
            [...suggestions, ...fallback].slice(0, 3) : fallback;
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        suggestions = generateFallbackMessages(intent);
      }
      
      return Array.isArray(suggestions) ? suggestions : generateFallbackMessages(intent);
    } catch (apiError) {
      console.error('Error calling Gemini API:', apiError);
      return generateFallbackMessages(intent);
    }
  } catch (error) {
    console.error('Error generating AI message suggestions:', error);
    return generateFallbackMessages(intent);
  }
};

/**
 * Generate fallback messages when AI API is not available
 */
const generateFallbackMessages = (intent) => {
  const intentLower = intent.toLowerCase();
  
  if (intentLower.includes('discount') || intentLower.includes('sale') || intentLower.includes('offer')) {
    return [
      `Special offer just for you! Get 20% off your next purchase.`,
      `Limited time discount: Save big on your favorite items today!`,
      `Exclusive deal for our valued customers: Use code SAVE20 for 20% off.`
    ];
  } else if (intentLower.includes('new') || intentLower.includes('launch') || intentLower.includes('product')) {
    return [
      `Introducing our newest product line! Be the first to experience it.`,
      `New arrivals just for you! Check out what we've added to our collection.`,
      `Just launched: Discover our latest products that you'll love.`
    ];
  } else if (intentLower.includes('remind') || intentLower.includes('abandoned') || intentLower.includes('cart')) {
    return [
      `Don't forget about the items in your cart! Complete your purchase today.`,
      `Your selected items are still waiting for you! Checkout now before they sell out.`,
      `Quick reminder: You left some great items in your cart. Ready to complete your order?`
    ];
  } else if (intentLower.includes('thank') || intentLower.includes('appreciation') || intentLower.includes('loyal')) {
    return [
      `Thank you for being our valued customer! We appreciate your continued support.`,
      `We just wanted to say thanks for choosing us! Here's a special reward just for you.`,
      `Your loyalty means the world to us. Thank you for being an amazing customer!`
    ];
  } else {
    return [
      `We thought you might be interested in our latest updates!`,
      `Hello from our team! We have some news we think you'll like.`,
      `We've got something special to share with our favorite customers like you!`
    ];
  }
};