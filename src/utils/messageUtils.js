import { sendMessage, checkDeliveryStatus } from '../services/vendorApi.js';

export const personalizeMessage = (template, customer) => {
  let message = template;
  
  // Replace common placeholders
  const replacements = {
    '{name}': customer.name || 'valued customer',
    '{first_name}': customer.name?.split(' ')[0] || 'valued customer',
    '{last_name}': customer.name?.split(' ').slice(1).join(' ') || '',
    '{email}': customer.email || ''
  };

  Object.entries(replacements).forEach(([placeholder, value]) => {
    message = message.replace(new RegExp(placeholder, 'g'), value);
  });

  return message;
};

/**
 * Sends a personalized message to a customer with delivery tracking
 */
export const sendPersonalizedMessage = async (customer, template) => {
  try {
    const message = personalizeMessage(template, customer);
    const sendResult = await sendMessage(customer, message);

    return {
      success: true,
      messageId: sendResult.messageId,
      status: 'sent',
      sentAt: sendResult.timestamp
    };
  } catch (error) {
    return {
      success: false,
      status: 'failed',
      error: error.message,
      timestamp: new Date()
    };
  }
};

// Example usage in campaign service
const sendCampaignMessages = async (campaign, customers) => {
  const results = {
    total: customers.length,
    sent: 0,
    failed: 0,
    logs: []
  };

  for (const customer of customers) {
    const result = await sendPersonalizedMessage(customer, campaign.message);
    
    results[result.success ? 'sent' : 'failed']++;
    results.logs.push(result);
  }

  return results;
};