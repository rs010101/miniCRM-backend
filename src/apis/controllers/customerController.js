import * as customerService from '../services/customerService.js';

/**
 * Get all customers for a user
 */
export const getCustomers = async (req, res) => {
  try {
    const userId = req.user._id;
    const customers = await customerService.getCustomers(userId);
    res.json(customers);
  } catch (error) {
    console.error('Error in getCustomers controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Add a new customer
 */
export const addCustomer = async (req, res) => {
  try {
    const userId = req.user._id;
    const customerData = req.body;
    const customer = await customerService.addCustomer(userId, customerData);
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error in addCustomer controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update an existing customer
 */
export const updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customerData = req.body;
    const customer = await customerService.updateCustomer(customerId, customerData);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    console.error('Error in updateCustomer controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete a customer
 */
export const deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const result = await customerService.deleteCustomer(customerId);
    res.json(result);
  } catch (error) {
    console.error('Error in deleteCustomer controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get a single customer by ID
 */
export const getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await customerService.getCustomerById(customerId);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    console.error('Error in getCustomerById controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Bulk import customers
 */
export const bulkImportCustomers = async (req, res) => {
  try {
    const userId = req.user._id;
    const customersData = req.body;
    
    if (!Array.isArray(customersData)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of customers.' });
    }
    
    const result = await customerService.bulkImportCustomers(userId, customersData);
    res.status(201).json({
      message: `Successfully imported ${result.length} customers`,
      count: result.length
    });
  } catch (error) {
    console.error('Error in bulkImportCustomers controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};