import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  picture: String,
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
