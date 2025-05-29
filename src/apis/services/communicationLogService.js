import CommunicationLog from '../../models/CommunicationLog.js';

/**
 * Get all communication logs for a user
 */
export const getCommunicationLogs = async (userId) => {
  try {
    const logs = await CommunicationLog.find({ userId })
      .populate('campaignId')
      .populate('customerId');
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
    const logs = await CommunicationLog.find({ userId, campaignId })
      .populate('customerId');
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
    const logs = await CommunicationLog.find({ userId, customerId })
      .populate('campaignId');
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