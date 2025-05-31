import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  segmentRuleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SegmentRule',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  intent: String,
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'processing',
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date }
});

// Add pre-save middleware to update the updated_at field
campaignSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;