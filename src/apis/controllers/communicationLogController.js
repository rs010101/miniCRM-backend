import * as communicationLogService from '../services/communicationLogService.js';

/**
 * Get all communication logs for a user
 */
export const getCommunicationLogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const logs = await communicationLogService.getCommunicationLogs(userId);
    res.json(logs);
  } catch (error) {
    console.error('Error in getCommunicationLogs controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get communication logs for a specific campaign
 */
export const getCampaignLogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const campaignId = req.params.campaignId;
    const logs = await communicationLogService.getCampaignLogs(userId, campaignId);
    res.json(logs);
  } catch (error) {
    console.error('Error in getCampaignLogs controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get communication logs for a specific customer
 */
export const getCustomerLogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const customerId = req.params.customerId;
    const logs = await communicationLogService.getCustomerLogs(userId, customerId);
    res.json(logs);
  } catch (error) {
    console.error('Error in getCustomerLogs controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Create a new communication log
 */
export const createCommunicationLog = async (req, res) => {
  try {
    const userId = req.user._id;
    const logData = { ...req.body, userId };
    const log = await communicationLogService.createCommunicationLog(logData);
    res.status(201).json(log);
  } catch (error) {
    console.error('Error in createCommunicationLog controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update communication log status (for delivery receipt API)
 */
export const updateLogStatus = async (req, res) => {
  try {
    const logId = req.params.id;
    const { status, metadata } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const log = await communicationLogService.updateLogStatus(logId, status, metadata);
    
    if (!log) {
      return res.status(404).json({ message: 'Communication log not found' });
    }
    
    res.json(log);
  } catch (error) {
    console.error('Error in updateLogStatus controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete a communication log
 */
export const deleteLog = async (req, res) => {
  try {
    const logId = req.params.id;
    const result = await communicationLogService.deleteLog(logId);
    res.json(result);
  } catch (error) {
    console.error('Error in deleteLog controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get communication log statistics
 */
export const getLogStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const filters = req.query;
    const stats = await communicationLogService.getLogStats(userId, filters);
    res.json(stats);
  } catch (error) {
    console.error('Error in getLogStats controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};