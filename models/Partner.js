const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  partnerId: {
    type: String,
    unique: true,
    required: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
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
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  resetOtp: {
    type: String,
    default: null
  },
  resetOtpExpiry: {
    type: Date,
    default: null
  },
  businessType: {
    type: String,
    required: true,
    enum: ['individual', 'proprietorship', 'partnership', 'private_ltd', 'llp', 'corporate']
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  gstin: {
    type: String,
    trim: true,
    uppercase: true
  },
  aadharPan: {
    type: String,
    trim: true,
    uppercase: true
  },
  partnershipAreas: [{
    type: String,
    enum: ['web_development', 'mobile_apps', 'digital_marketing', 'seo', 'it_services', 'consulting', 'design', 'hosting']
  }],
  experience: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  documents: [{
    name: String,
    url: String,
    type: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  mobileVerified: {
    type: Boolean,
    default: false
  },
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    bankName: String,
    ifsc: String,
    branch: String
  },
  clients: [{
    clientId: String,
    clientName: String,
    companyName: String,
    email: String,
    mobile: String,
    product: String,
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    commission: Number,
    commissionPaid: { type: Boolean, default: false },
    registeredAt: { type: Date, default: Date.now },
    notes: String
  }],
  commissions: [{
    transactionId: String,
    clientId: String,
    clientName: String,
    amount: Number,
    type: { type: String, enum: ['referral', 'bonus', 'payout'] },
    status: { type: String, enum: ['pending', 'approved', 'paid'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    paidAt: Date,
    notes: String
  }],
  stats: {
    totalClients: { type: Number, default: 0 },
    activeClients: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    pendingPayout: { type: Number, default: 0 }
  },
  lastLogin: Date,
  loginCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

partnerSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Partner').countDocuments();
    this.partnerId = `PART-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Partner', partnerSchema);
