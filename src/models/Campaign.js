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
  name: String,
  intent: String,
  message: String,
  created_at: { type: Date, default: Date.now }
});

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;