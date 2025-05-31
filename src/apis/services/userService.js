import User from '../../models/User.js';
import { getCache, setCache, deleteCache, CACHE_KEYS } from '../../utils/redisClient.js';

// Cache key generators for user-related data
const USER_CACHE_KEYS = {
  USER_BY_ID: (userId) => `${CACHE_KEYS.USER}${userId}`,
  USER_PROFILE: (userId) => `${CACHE_KEYS.USER}${userId}:profile`,
};

/**
 * Get user data by ID
 */
export const getUserById = async (userId) => {
  try {
    // Try to get from cache first
    const cacheKey = USER_CACHE_KEYS.USER_BY_ID(userId);
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, get from database
    const user = await User.findById(userId);
    
    if (user) {
      // Store in cache for future requests (24 hours expiry)
      await setCache(cacheKey, user, 86400);
    }
    
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
    
    if (user) {
      // Update user caches
      await setCache(USER_CACHE_KEYS.USER_BY_ID(userId), user, 86400);
      await deleteCache(USER_CACHE_KEYS.USER_PROFILE(userId));
    }
    
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
    // Try to get from cache first
    const cacheKey = USER_CACHE_KEYS.USER_PROFILE(userId);
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const profile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      created_at: user.created_at
    };
    
    // Store in cache for future requests (24 hours expiry)
    await setCache(cacheKey, profile, 86400);
    
    return profile;
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