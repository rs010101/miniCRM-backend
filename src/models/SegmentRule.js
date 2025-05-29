import mongoose from 'mongoose';

const segmentRuleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: String,
  logicType: {
    type: String,
    enum: ['AND', 'OR'],
    default: 'AND'
  },
  rules: [{
    field: String,
    operator: String,
    value: mongoose.Schema.Types.Mixed,
    type: { type: String }
  }]
}, { timestamps: true });

const SegmentRule = mongoose.model('SegmentRule', segmentRuleSchema);
export default SegmentRule;