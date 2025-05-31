import * as segmentRuleService from '../services/segmentRuleService.js';

/**
 * Get all segment rules for a user
 */
export const getSegmentRules = async (req, res) => {
  try {
    const userId = req.user._id;
    const segmentRules = await segmentRuleService.getSegmentRules(userId);
    res.json(segmentRules);
  } catch (error) {
    console.error('Error in getSegmentRules controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get a single segment rule by ID
 */
export const getSegmentRuleById = async (req, res) => {
  try {
    const ruleId = req.params.id;
    const segmentRule = await segmentRuleService.getSegmentRuleById(ruleId);
    
    if (!segmentRule) {
      return res.status(404).json({ message: 'Segment rule not found' });
    }
    
    res.json(segmentRule);
  } catch (error) {
    console.error('Error in getSegmentRuleById controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Create a new segment rule
 */
export const createSegmentRule = async (req, res) => {
  try {
    const userId = req.user._id;
    const ruleData = req.body;
    const segmentRule = await segmentRuleService.createSegmentRule(userId, ruleData);
    res.status(201).json(segmentRule);
  } catch (error) {
    console.error('Error in createSegmentRule controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update an existing segment rule
 */
export const updateSegmentRule = async (req, res) => {
  try {
    const ruleId = req.params.id;
    const ruleData = req.body;
    const segmentRule = await segmentRuleService.updateSegmentRule(ruleId, ruleData);
    
    if (!segmentRule) {
      return res.status(404).json({ message: 'Segment rule not found' });
    }
    
    res.json(segmentRule);
  } catch (error) {
    console.error('Error in updateSegmentRule controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete a segment rule
 */
export const deleteSegmentRule = async (req, res) => {
  try {
    const ruleId = req.params.id;
    const result = await segmentRuleService.deleteSegmentRule(ruleId);
    res.json(result);
  } catch (error) {
    console.error('Error in deleteSegmentRule controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get customers that match a segment rule
 */
export const getCustomersForSegment = async (req, res) => {
  try {
    const userId = req.user._id;
    const segmentRuleId = req.params.id;
    const customers = await segmentRuleService.getCustomersForSegment(userId, segmentRuleId);
    res.json(customers);
  } catch (error) {
    console.error('Error in getCustomersForSegment controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};