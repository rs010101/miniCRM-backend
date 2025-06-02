import Campaign from '../../models/Campaign.js';
import CommunicationLog from '../../models/CommunicationLog.js';
import Customer from '../../models/Customer.js';
import { sendMessage } from './vendorApi.js';
import { messageQueue } from './messageQueueService.js';
import { getCache, setCache, deleteCache, CACHE_KEYS } from '../../utils/redisClient.js';

// Cache key generators for communication logs
const COMM_LOG_CACHE_KEYS = {
  LOGS_BY_USER: (userId) => `${CACHE_KEYS.USER}${userId}:logs`,
  LOGS_BY_CAMPAIGN: (campaignId) => `${CACHE_KEYS.CAMPAIGN}${campaignId}:logs`,
  LOGS_BY_CUSTOMER: (customerId) => `${CACHE_KEYS.CUSTOMER}${customerId}:logs`,
};

/**
 * Get all communication logs for a user
 */
export const getCommunicationLogs = async (userId) => {
  try {
    // Try to get from cache first
    const cacheKey = COMM_LOG_CACHE_KEYS.LOGS_BY_USER(userId);
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const logs = await CommunicationLog.find({ userId })
      .populate('campaignId')
      .populate('customerId');
    
    // Cache for 15 minutes since communication logs update frequently
    await setCache(cacheKey, logs, 900);
    
    return logs;
  } catch (error) {
    console.error('Error getting communication logs:', error);
    throw error;
  }
};

/**
 * Get communication logs for a specific campaign
 */
export const getCampaignLogs = async (userId, campaignId) => {
  try {
    // Try to get from cache first
    const cacheKey = COMM_LOG_CACHE_KEYS.LOGS_BY_CAMPAIGN(campaignId);
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const logs = await CommunicationLog.find({ userId, campaignId })
      .populate('customerId');
    
    // Cache for 15 minutes
    await setCache(cacheKey, logs, 900);
    
    return logs;
  } catch (error) {
    console.error('Error getting campaign logs:', error);
    throw error;
  }
};

/**
 * Get communication logs for a specific customer
 */
export const getCustomerLogs = async (userId, customerId) => {
  try {
    // Try to get from cache first
    const cacheKey = COMM_LOG_CACHE_KEYS.LOGS_BY_CUSTOMER(customerId);
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const logs = await CommunicationLog.find({ userId, customerId })
      .populate('campaignId');
    
    // Cache for 15 minutes
    await setCache(cacheKey, logs, 900);
    
    return logs;
  } catch (error) {
    console.error('Error getting customer logs:', error);
    throw error;
  }
};

/**
 * Create a new communication log
 */
export const createCommunicationLog = async (logData) => {
  try {
    const log = new CommunicationLog(logData);
    await log.save();
    
    // Invalidate related caches
    await deleteCache(COMM_LOG_CACHE_KEYS.LOGS_BY_USER(logData.userId));
    if (logData.campaignId) {
      await deleteCache(COMM_LOG_CACHE_KEYS.LOGS_BY_CAMPAIGN(logData.campaignId));
    }
    if (logData.customerId) {
      await deleteCache(COMM_LOG_CACHE_KEYS.LOGS_BY_CUSTOMER(logData.customerId));
    }
    
    return log;
  } catch (error) {
    console.error('Error creating communication log:', error);
    throw error;
  }
};

/**
 * Update communication log status
 */
export const updateLogStatus = async (logId, status, metadata = {}) => {
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
    console.error('Error updating log status:', error);
    throw error;
  }
};

/**
 * Delete a communication log
 */
export const deleteLog = async (logId) => {
  try {
    await CommunicationLog.findByIdAndDelete(logId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting log:', error);
    throw error;
  }
};

/**
 * Get communication log statistics
 */
export const getLogStats = async (userId, filters = {}) => {
  try {
    const query = { userId, ...filters };
    const logs = await CommunicationLog.find(query);
    
    const stats = {
      total: logs.length,
      pending: logs.filter(log => log.status === 'pending').length,
      sent: logs.filter(log => log.status === 'sent').length,
      delivered: logs.filter(log => log.status === 'delivered').length,
      read: logs.filter(log => log.status === 'read').length,
      failed: logs.filter(log => log.status === 'failed').length
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting log stats:', error);
    throw error;
  }
};

/**
 * Create a campaign with associated communication logs
 */
export const createCampaignWithLogs = async (userId, campaignData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create campaign
    const campaign = new Campaign({
      userId,
      ...campaignData,
      status: 'processing'
    });
    await campaign.save({ session });

    // Get customers from segment
    const customers = await Customer.find({
      segmentRuleId: campaignData.segmentRuleId
    })
    .populate('name')  // Make sure we have customer names
    .session(session);

    // Create communication logs and send messages for each customer
    const logs = await Promise.all(customers.map(async customer => {
      // Personalize message
      const personalizedMessage = campaignData.message.replace(
        '{name}', 
        customer.name || 'valued customer'
      );

      // Create log entry
      const log = new CommunicationLog({
        campaignId: campaign._id,
        customerId: customer._id,
        userId,
        message: personalizedMessage,
        status: 'delivered',
        delivered_at: new Date()
      });
      
      try {
        // Send message via vendor API
        const result = await sendMessage(customer.name, personalizedMessage);
        
        // Update log with success
        log.status = 'sent';
        log.sent_at = result.timestamp;
        log.metadata = { messageId: result.messageId };
      } catch (error) {
        // Update log with failure
        log.status = 'failed';
        log.failed_at = new Date();
        log.error = error.message;
      }

      await log.save({ session });
      return log;
    }));

    // Update campaign status
    campaign.status = 'completed';
    await campaign.save({ session });

    await session.commitTransaction();
    
    return {
      campaign,
      logs,
      summary: {
        total: logs.length,
        sent: logs.filter(log => log.status === 'sent').length,
        failed: logs.filter(log => log.status === 'failed').length
      }
    };

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Update delivery status of a message
 */
export const updateDeliveryStatus = async (messageId, status, metadata = {}) => {
  try {
    // Find the log first to get campaignId
    const log = await CommunicationLog.findOne({ messageId });
    
    if (!log) {
      throw new Error(`No communication log found for messageId: ${messageId}`);
    }

    // Queue the update
    await messageQueue.enqueue({
      messageId,
      campaignId: log.campaignId,
      status,
      metadata
    });

    return { 
      success: true, 
      message: 'Update queued for processing',
      messageId,
      status
    };
  } catch (error) {
    console.error('Error queueing delivery status update:', error);
    throw error;
  }
};

// Helper function to update campaign statistics
async function updateCampaignStats(campaignId) {
  try {
    const stats = await CommunicationLog.aggregate([
      { $match: { campaignId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = stats.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {});

    await Campaign.findByIdAndUpdate(campaignId, {
      $set: {
        stats: statusCounts,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error updating campaign stats:', error);
  }
}