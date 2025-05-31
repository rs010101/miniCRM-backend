import Customer from '../../models/Customer.js';
import { getCache, setCache, deleteCache } from '../../utils/redisClient.js';

const CACHE_KEYS = {
  CUSTOMERS_BY_USER: (userId) => `customers:user:${userId}`,
  CUSTOMER_BY_ID: (customerId) => `customer:${customerId}`,
};

/**
 * Get all customers for a user
 */
export const getCustomers = async (userId) => {
  try {
    // Try to get from cache first
    const cacheKey = CACHE_KEYS.CUSTOMERS_BY_USER(userId);
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, get from database
    const customers = await Customer.find({ userId });
    
    // Store in cache for future requests
    await setCache(cacheKey, customers);
    
    return customers;
  } catch (error) {
    console.error('Error getting customers:', error);
    throw error;
  }
};

/**
 * Add a new customer
 */
export const addCustomer = async (userId, customerData) => {
  try {
    const customer = new Customer({
      userId,
      ...customerData
    });
    await customer.save();
    
    // Invalidate the user's customers cache
    await deleteCache(CACHE_KEYS.CUSTOMERS_BY_USER(userId));
    
    return customer;
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

/**
 * Update an existing customer
 */
export const updateCustomer = async (customerId, customerData) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      customerData,
      { new: true }
    );
    
    if (customer) {
      // Update cache for individual customer
      await setCache(CACHE_KEYS.CUSTOMER_BY_ID(customerId), customer);
      // Invalidate user's customers list cache
      await deleteCache(CACHE_KEYS.CUSTOMERS_BY_USER(customer.userId));
    }
    
    return customer;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

/**
 * Delete a customer
 */
export const deleteCustomer = async (customerId) => {
  try {
    await Customer.findByIdAndDelete(customerId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

/**
 * Get a single customer by ID
 */
export const getCustomerById = async (customerId) => {
  try {
    // Try to get from cache first
    const cacheKey = CACHE_KEYS.CUSTOMER_BY_ID(customerId);
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, get from database
    const customer = await Customer.findById(customerId);
    
    // Store in cache for future requests
    await setCache(cacheKey, customer);
    
    return customer;
  } catch (error) {
    console.error('Error getting customer:', error);
    throw error;
  }
};

/**
 * Bulk import customers
 */
export const bulkImportCustomers = async (userId, customersData) => {
  try {
    const customers = customersData.map(customer => ({
      userId,
      ...customer
    }));
    
    const result = await Customer.insertMany(customers);
    return result;
  } catch (error) {
    console.error('Error bulk importing customers:', error);
    throw error;
  }
};