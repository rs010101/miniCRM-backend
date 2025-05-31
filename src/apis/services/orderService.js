import Order from '../../models/Order.js';
import Customer from '../../models/Customer.js';
import { getCache, setCache, deleteCache, CACHE_KEYS } from '../../utils/redisClient.js';

// Cache key generators
const ORDER_CACHE_KEYS = {
  ORDERS_BY_USER: (userId) => `${CACHE_KEYS.ORDER}user:${userId}`,
  ORDER_BY_ID: (orderId) => `${CACHE_KEYS.ORDER}${orderId}`,
  CUSTOMER_ORDERS: (customerId) => `${CACHE_KEYS.ORDER}customer:${customerId}`,
};

/**
 * Get all orders for a user
 */
export const getOrders = async (userId) => {
  try {
    // Try to get from cache first
    const cacheKey = ORDER_CACHE_KEYS.ORDERS_BY_USER(userId);
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, get from database
    const orders = await Order.find({ userId }).populate('customerId');
    
    // Store in cache for future requests (1 hour expiry)
    await setCache(cacheKey, orders, 3600);
    
    return orders;
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

/**
 * Add a new order
 */
export const addOrder = async (userId, orderData) => {
  try {
    // Calculate total if not provided
    if (!orderData.total && orderData.items && orderData.items.length > 0) {
      orderData.total = orderData.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
      );
    }
    
    const order = new Order({
      userId,
      ...orderData
    });
    
    await order.save();
    
    // Update customer's total spend
    if (orderData.customerId && orderData.total) {
      await Customer.findByIdAndUpdate(
        orderData.customerId,
        { 
          $inc: { total_spend: orderData.total, visit_count: 1 },
          $set: { last_active: new Date() }
        }
      );
      
      // Invalidate customer-related caches
      await deleteCache(`${CACHE_KEYS.CUSTOMER}${orderData.customerId}`);
      await deleteCache(ORDER_CACHE_KEYS.CUSTOMER_ORDERS(orderData.customerId));
    }
    
    // Invalidate user's orders cache
    await deleteCache(ORDER_CACHE_KEYS.ORDERS_BY_USER(userId));
    
    return order;
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

/**
 * Update an existing order
 */
export const updateOrder = async (orderId, orderData) => {
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      orderData,
      { new: true }
    );
    return order;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

/**
 * Delete an order
 */
export const deleteOrder = async (orderId) => {
  try {
    await Order.findByIdAndDelete(orderId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate('customerId');
    return order;
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

/**
 * Get orders for a specific customer
 */
export const getCustomerOrders = async (customerId) => {
  try {
    const orders = await Order.find({ customerId });
    return orders;
  } catch (error) {
    console.error('Error getting customer orders:', error);
    throw error;
  }
};

/**
 * Bulk import orders
 */
export const bulkImportOrders = async (userId, ordersData) => {
  try {
    const orders = ordersData.map(order => ({
      userId,
      ...order
    }));
    
    const result = await Order.insertMany(orders);
    return result;
  } catch (error) {
    console.error('Error bulk importing orders:', error);
    throw error;
  }
};