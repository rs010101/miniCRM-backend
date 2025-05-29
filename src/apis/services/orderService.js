import Order from '../../models/Order.js';
import Customer from '../../models/Customer.js';

/**
 * Get all orders for a user
 */
export const getOrders = async (userId) => {
  try {
    const orders = await Order.find({ userId }).populate('customerId');
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
    }
    
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