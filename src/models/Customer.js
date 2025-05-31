import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: String,
  email: String,
  phone: String,
  location: String,
  // Additional fields to track customer activity
  total_spend: { type: Number, default: 0 },
  visit_count: { type: Number, default: 0 },
  last_active: { type: Date, default: Date.now },
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;