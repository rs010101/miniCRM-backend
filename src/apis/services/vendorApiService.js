/**
 * Simulates sending a message through a vendor API with realistic success/failure rates
 */
export const sendMessage = async (customer, message) => {
  // Simulate network delay (500-2000ms)
  const delay = Math.floor(Math.random() * 1500) + 500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Simulate 90% success rate
  const isSuccess = Math.random() < 0.9;

  if (!isSuccess) {
    const errorTypes = [
      'NETWORK_ERROR',
      'INVALID_NUMBER',
      'RECIPIENT_OPTED_OUT',
      'SERVICE_UNAVAILABLE'
    ];
    const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    throw new Error(`Message delivery failed: ${randomError}`);
  }

  // Generate a unique message ID
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    success: true,
    messageId,
    status: 'SENT',
    timestamp: new Date(),
    recipient: customer.email || customer.phone,
    metadata: {
      deliveryAttempt: 1,
      channel: 'email',
      provider: 'DummyVendor'
    }
  };
};

/**
 * Simulates checking message delivery status
 */
export const checkDeliveryStatus = async (messageId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulate 95% delivery success for sent messages
  const isDelivered = Math.random() < 0.95;

  return {
    messageId,
    status: isDelivered ? 'DELIVERED' : 'FAILED',
    timestamp: new Date(),
    attempts: 1,
    metadata: {
      deliveredAt: isDelivered ? new Date() : null,
      failureReason: !isDelivered ? 'RECIPIENT_UNAVAILABLE' : null
    }
  };
};