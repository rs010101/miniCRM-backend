import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
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
  date: { type: Date, default: Date.now },
  items: [{
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;