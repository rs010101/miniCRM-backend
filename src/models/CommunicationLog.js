import mongoose from 'mongoose';

const communicationLogSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed'],
    default: 'pending'
  },
  sent_at: Date,
  delivered_at: Date,
  failed_at: Date,
  error: String,
  metadata: {
    type: Map,
    of: String
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date }
});

// Add pre-save middleware to update timestamps
communicationLogSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

const CommunicationLog = mongoose.model('CommunicationLog', communicationLogSchema);
export default CommunicationLog;