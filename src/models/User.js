import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  picture: String,
  created_at: { type: Date, default: Date.now },
  customers: {
    type: Array,
    default: []
  },
  orders: {
    type: Array,
    default: []
  }
});

const User = mongoose.model('User', userSchema);
export default User;