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
