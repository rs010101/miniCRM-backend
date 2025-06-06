import SegmentRule from '../../models/SegmentRule.js';
import Customer from '../../models/Customer.js';
import { getCache, setCache, deleteCache, deleteCachePattern, CACHE_KEYS } from '../../utils/redisClient.js';

// Cache key generators
const SEGMENT_CACHE_KEYS = {
  SEGMENTS_BY_USER: (userId) => `${CACHE_KEYS.SEGMENT}user:${userId}`,
  SEGMENT_BY_ID: (segmentId) => `${CACHE_KEYS.SEGMENT}${segmentId}`,
  SEGMENT_CUSTOMERS: (segmentId) => `${CACHE_KEYS.SEGMENT}${segmentId}:customers`,
};

/**
 * Get all segment rules for a user
 */
export const getSegmentRules = async (userId) => {
  try {
    // Try to get from cache first
    const cacheKey = SEGMENT_CACHE_KEYS.SEGMENTS_BY_USER(userId);
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, get from database
    const segmentRules = await SegmentRule.find({ userId });
    
    // Store in cache for future requests (1 hour expiry)
    await setCache(cacheKey, segmentRules, 3600);
    
    return segmentRules;
  } catch (error) {
    console.error('Error getting segment rules:', error);
    throw error;
  }
};

/**
 * Get a single segment rule by ID
 */
export const getSegmentRuleById = async (ruleId) => {
  try {
    // Try to get from cache first
    const cacheKey = SEGMENT_CACHE_KEYS.SEGMENT_BY_ID(ruleId);
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, get from database
    const segmentRule = await SegmentRule.findById(ruleId);
    
    if (segmentRule) {
      // Store in cache for future requests (1 hour expiry)
      await setCache(cacheKey, segmentRule, 3600);
    }
    
    return segmentRule;
  } catch (error) {
    console.error('Error getting segment rule:', error);
    throw error;
  }
};

/**
 * Create a new segment rule
 */
export const createSegmentRule = async (userId, ruleData) => {
  try {
    const segmentRule = new SegmentRule({
      userId,
      name: ruleData.name,
      logicType: ruleData.logicType,
      rules: ruleData.conditions || ruleData.rules // Support both conditions and rules fields
    });
    
    await segmentRule.save();
    
    // Invalidate user's segments cache
    await deleteCache(SEGMENT_CACHE_KEYS.SEGMENTS_BY_USER(userId));
    
    return segmentRule;
  } catch (error) {
    console.error('Error creating segment rule:', error);
    throw error;
  }
};

/**
 * Update an existing segment rule
 */
export const updateSegmentRule = async (ruleId, ruleData) => {
  try {
    const segmentRule = await SegmentRule.findByIdAndUpdate(
      ruleId,
      ruleData,
      { new: true }
    );
    return segmentRule;
  } catch (error) {
    console.error('Error updating segment rule:', error);
    throw error;
  }
};

/**
 * Delete a segment rule
 */
export const deleteSegmentRule = async (ruleId) => {
  try {
    await SegmentRule.findByIdAndDelete(ruleId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting segment rule:', error);
    throw error;
  }
};

/**
 * Helper function to compare values based on operator
 */
const compareValues = (operator, value1, value2, type) => {
  // Convert values based on type if needed
  if (type === 'number') {
    value1 = Number(value1);
    value2 = Number(value2);
  } else if (type === 'date') {
    value1 = new Date(value1);
    value2 = new Date(value2);
  }

  switch (operator) {
    case 'equals':
      return value1 === value2;
    case 'not_equals':
      return value1 !== value2;
    case 'greater_than':
      return value1 > value2;
    case 'less_than':
      return value1 < value2;
    case 'contains':
      return String(value1).toLowerCase().includes(String(value2).toLowerCase());
    case 'not_contains':
      return !String(value1).toLowerCase().includes(String(value2).toLowerCase());
    case 'starts_with':
      return String(value1).toLowerCase().startsWith(String(value2).toLowerCase());
    case 'ends_with':
      return String(value1).toLowerCase().endsWith(String(value2).toLowerCase());
    default:
      return false;
  }
};

/**
 * Get customers that match a segment rule
 */
export const getCustomersForSegment = async (userId, segmentRuleId) => {
  try {
    const segmentRule = await SegmentRule.findById(segmentRuleId);
    if (!segmentRule) {
      throw new Error('Segment rule not found');
    }
    
    const customers = await Customer.find({ userId });
    
    // Filter customers based on segment rules and logic type
    const matchingCustomers = customers.filter(customer => {
      if (segmentRule.logicType === 'OR') {
        // OR logic - at least one rule must match
        return segmentRule.rules.some(rule => {
          const customerValue = customer[rule.field];
          return compareValues(rule.operator, customerValue, rule.value, rule.type);
        });
      } else {
        // AND logic (default) - all rules must match
        return segmentRule.rules.every(rule => {
          const customerValue = customer[rule.field];
          return compareValues(rule.operator, customerValue, rule.value, rule.type);
        });
      }
    });
    
    return matchingCustomers;
  } catch (error) {
    console.error('Error getting customers for segment:', error);
    throw error;
  }
};