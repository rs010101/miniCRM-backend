import User from '../../models/User.js';

/**
 * Get user data by ID
 */
export const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

/**
 * Update user data
 */
export const updateUser = async (userId, userData) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      userData,
      { new: true }
    );
    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Get user profile data (excluding sensitive information)
 */
export const getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      created_at: user.created_at
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Get user data (customers and orders)
 */
export const getUserData = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      customers: user.customers || [],
      orders: user.orders || []
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

/**
 * Save user data (customers and orders)
 */
export const saveUserData = async (userId, data) => {
  try {
    const updateData = {};
    
    if (data.customers) {
      updateData.customers = data.customers;
    }
    
    if (data.orders) {
      updateData.orders = data.orders;
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};