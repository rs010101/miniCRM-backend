import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL;

export const sendMessage = async (customer, message) => {
  // Simulate network delay (500-2000ms)
  const delay = Math.floor(Math.random() * 1500) + 500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Simulate 90% success rate
  const isSuccess = Math.random() < 0.9;
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  if (!isSuccess) {
    const error = new Error('Message delivery failed');
    // Send failure receipt
    await sendDeliveryReceipt(messageId, 'failed', {
      error: error.message,
      failedAt: new Date()
    });
    throw error;
  }

  // Send initial success receipt
  await sendDeliveryReceipt(messageId, 'sent', {
    sentAt: new Date()
  });

  // Simulate delayed delivery status (95% success)
  setTimeout(async () => {
    const isDelivered = Math.random() < 0.95;
    await sendDeliveryReceipt(messageId, isDelivered ? 'delivered' : 'failed', {
      ...(isDelivered 
        ? { deliveredAt: new Date() }
        : { error: 'Delivery timeout', failedAt: new Date() }
      )
    });
  }, 2000);

  return {
    success: true,
    messageId,
    status: 'sent',
    timestamp: new Date()
  };
};

const sendDeliveryReceipt = async (messageId, status, metadata = {}) => {
  try {
    await axios.post(`${BACKEND_URL}/api/delivery-receipts/webhook`, {
      messageId,
      status,
      metadata,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Failed to send delivery receipt:', error);
  }
};

export const checkDeliveryStatus = async (messageId) => {
  // This can now be simplified since status updates are handled via webhooks
  const response = await axios.get(`${BACKEND_URL}/api/communication-logs/${messageId}`);
  return response.data;
};