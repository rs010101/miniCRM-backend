import * as orderService from '../services/orderService.js';

/**
 * Get all orders for a user
 */
export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await orderService.getOrders(userId);
    res.json(orders);
  } catch (error) {
    console.error('Error in getOrders controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Add a new order
 */
export const addOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderData = req.body;
    const order = await orderService.addOrder(userId, orderData);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error in addOrder controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update an existing order
 */
export const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderData = req.body;
    const order = await orderService.updateOrder(orderId, orderData);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error in updateOrder controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete an order
 */
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const result = await orderService.deleteOrder(orderId);
    res.json(result);
  } catch (error) {
    console.error('Error in deleteOrder controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error in getOrderById controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get orders for a specific customer
 */
export const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const orders = await orderService.getCustomerOrders(customerId);
    res.json(orders);
  } catch (error) {
    console.error('Error in getCustomerOrders controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Bulk import orders
 */
export const bulkImportOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const ordersData = req.body;
    
    if (!Array.isArray(ordersData)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of orders.' });
    }
    
    const result = await orderService.bulkImportOrders(userId, ordersData);
    res.status(201).json({
      message: `Successfully imported ${result.length} orders`,
      count: result.length
    });
  } catch (error) {
    console.error('Error in bulkImportOrders controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};