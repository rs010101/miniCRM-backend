import * as userService from '../services/userService.js';

/**
 * Get user profile data
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const userProfile = await userService.getUserProfile(userId);
    res.json(userProfile);
  } catch (error) {
    console.error('Error in getUserProfile controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update user data
 */
export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const userData = req.body;
    const user = await userService.updateUser(userId, userData);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      created_at: user.created_at
    });
  } catch (error) {
    console.error('Error in updateUser controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get user data (customers and orders)
 */
export const getUserData = async (req, res) => {
  try {
    const userId = req.user._id;
    const userData = await userService.getUserData(userId);
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Error in getUserData controller:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve user data', 
      error: error.message 
    });
  }
};

/**
 * Save user data (customers and orders)
 */
export const saveUserData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        message: 'No data provided' 
      });
    }
    
    await userService.saveUserData(userId, data);
    
    res.json({
      success: true,
      message: 'Data saved successfully'
    });
  } catch (error) {
    console.error('Error in saveUserData controller:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save user data', 
      error: error.message 
    });
  }
};