const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  designation: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  joiningDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'left'],
    default: 'active'
  },
  location: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    default: 'Axsem Softwares Private Limited'
  }
}, {
  timestamps: true
});

employeeSchema.pre('save', async function(next) {
  if (this.isNew && !this.employeeId) {
    const count = await mongoose.model('Employee').countDocuments();
    this.employeeId = `AXS-EMP-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);