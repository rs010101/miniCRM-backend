import * as communicationLogService from '../services/communicationLogService.js';

export const handleDeliveryReceipt = async (req, res) => {
  try {
    const { messageId, status, metadata = {} } = req.body;

    if (!messageId || !status) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: messageId and status are required'
      });
    }

    // Validate status
    const validStatuses = ['sent', 'delivered', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Update communication log
    const updatedLog = await communicationLogService.updateDeliveryStatus(
      messageId,
      status,
      metadata
    );

    if (!updatedLog) {
      return res.status(404).json({
        success: false,
        error: 'Communication log not found'
      });
    }

    res.json({
      success: true,
      message: 'Delivery status updated successfully',
      log: updatedLog
    });

  } catch (error) {
    console.error('Error handling delivery receipt:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
};