const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

adminSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, SALT_ROUNDS);
  }
  next();
});

adminSchema.methods.comparePassword = async function(plaintext) {
  return bcrypt.compare(plaintext, this.passwordHash);
};

module.exports = mongoose.model('Admin', adminSchema);
