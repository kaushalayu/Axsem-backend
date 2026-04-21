const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Partner = require('../models/Partner');

const JWT_SECRET = process.env.JWT_SECRET || 'Axsem';
const JWT_EXPIRY = '30d';

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.partner = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Admin auth middleware
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// GET - All partners (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { partnerId: { $regex: search, $options: 'i' } }
      ];
    }
    
    const partners = await Partner.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Partner.countDocuments(query);
    
    res.json({
      success: true,
      data: partners,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Partner stats (Admin)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      Partner.countDocuments(),
      Partner.countDocuments({ status: 'pending' }),
      Partner.countDocuments({ status: 'approved' }),
      Partner.countDocuments({ status: 'rejected' })
    ]);
    
    const partnersWithCommissions = await Partner.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, totalEarnings: { $sum: '$stats.totalEarnings' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
        totalEarnings: partnersWithCommissions[0]?.totalEarnings || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Single partner (Admin)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id).select('-password');
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    res.json({ success: true, data: partner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Register new partner
router.post('/register', async (req, res) => {
  try {
    const { companyName, contactPerson, email, mobile, password, businessType, city, state, website, gstin, aadharPan, partnershipAreas, experience, message, documents } = req.body;
    
    const existingPartner = await Partner.findOne({ email });
    if (existingPartner) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    const partner = new Partner({
      companyName,
      contactPerson,
      email,
      mobile,
      password,
      businessType,
      city,
      state,
      website,
      gstin,
      aadharPan,
      partnershipAreas,
      experience,
      message,
      documents,
      status: 'pending'
    });
    
    await partner.save();
    
    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully. Awaiting admin approval.',
      data: {
        partnerId: partner.partnerId,
        email: partner.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Partner login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const partner = await Partner.findOne({ email });
    if (!partner) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    if (partner.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    if (partner.status !== 'approved') {
      return res.status(403).json({ 
        success: false, 
        message: `Account is ${partner.status}. Please contact support.` 
      });
    }
    
    const token = jwt.sign(
      { id: partner._id, email: partner.email, partnerId: partner.partnerId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    
    partner.lastLogin = new Date();
    partner.loginCount += 1;
    await partner.save();
    
    res.json({
      success: true,
      token,
      data: {
        id: partner._id,
        partnerId: partner.partnerId,
        companyName: partner.companyName,
        contactPerson: partner.contactPerson,
        email: partner.email,
        mobile: partner.mobile,
        businessType: partner.businessType,
        city: partner.city,
        state: partner.state,
        status: partner.status,
        stats: partner.stats,
        bankDetails: partner.bankDetails
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Verify partner token
router.post('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const partner = await Partner.findById(decoded.id).select('-password');
    
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    
    res.json({ success: true, data: partner });
  } catch (error) {
    console.log('Verify error:', error.message);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// PUT - Update partner profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { companyName, contactPerson, mobile, city, state, website, partnershipAreas, experience, message } = req.body;
    
    const partner = await Partner.findById(req.partner.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    
    if (companyName) partner.companyName = companyName;
    if (contactPerson) partner.contactPerson = contactPerson;
    if (mobile) partner.mobile = mobile;
    if (city) partner.city = city;
    if (state) partner.state = state;
    if (website !== undefined) partner.website = website;
    if (partnershipAreas) partner.partnershipAreas = partnershipAreas;
    if (experience !== undefined) partner.experience = experience;
    if (message !== undefined) partner.message = message;
    
    await partner.save();
    
    res.json({ success: true, message: 'Profile updated', data: partner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Update bank details
router.put('/bank-details', authMiddleware, async (req, res) => {
  try {
    const { accountHolder, accountNumber, bankName, ifsc, branch } = req.body;
    
    const partner = await Partner.findById(req.partner.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    
    partner.bankDetails = { accountHolder, accountNumber, bankName, ifsc, branch };
    await partner.save();
    
    res.json({ success: true, message: 'Bank details updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Change password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const partner = await Partner.findById(req.partner.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    
    if (partner.password !== currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    
    partner.password = newPassword;
    await partner.save();
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Update profile photo
router.put('/profile-photo', authMiddleware, async (req, res) => {
  try {
    const { profilePhoto } = req.body;
    
    const partner = await Partner.findById(req.partner.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    
    partner.profilePhoto = profilePhoto;
    await partner.save();
    
    res.json({ success: true, message: 'Profile photo updated', data: { profilePhoto } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Upload documents
router.put('/documents', authMiddleware, async (req, res) => {
  try {
    const { documents } = req.body;
    
    const partner = await Partner.findById(req.partner.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    
    partner.documents = documents;
    await partner.save();
    
    res.json({ success: true, message: 'Documents updated', data: partner.documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Partner's clients
router.get('/clients', authMiddleware, async (req, res) => {
  try {
    const partner = await Partner.findById(req.partner.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    
    res.json({ success: true, data: partner.clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Add client
router.post('/clients', authMiddleware, async (req, res) => {
  try {
    const { clientName, companyName, email, mobile, product, notes } = req.body;
    
    const partner = await Partner.findById(req.partner.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    
    const clientId = `CL-${Date.now()}`;
    const client = {
      clientId,
      clientName,
      companyName,
      email,
      mobile,
      product,
      notes,
      status: 'active',
      registeredAt: new Date()
    };
    
    partner.clients.push(client);
    partner.stats.totalClients += 1;
    partner.stats.activeClients += 1;
    await partner.save();
    
    res.status(201).json({ success: true, message: 'Client added', data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Update client
router.put('/clients/:clientId', authMiddleware, async (req, res) => {
  try {
    const { clientId } = req.params;
    const updates = req.body;
    
    const partner = await Partner.findById(req.partner.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    
    const clientIndex = partner.clients.findIndex(c => c.clientId === clientId);
    if (clientIndex === -1) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    partner.clients[clientIndex] = { ...partner.clients[clientIndex], ...updates };
    await partner.save();
    
    res.json({ success: true, message: 'Client updated', data: partner.clients[clientIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Partner's commissions
router.get('/commissions', authMiddleware, async (req, res) => {
  try {
    const partner = await Partner.findById(req.partner.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    
    res.json({ 
      success: true, 
      data: {
        commissions: partner.commissions,
        stats: partner.stats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Update partner status (Admin)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    
    partner.status = status;
    await partner.save();
    
    res.json({ success: true, message: `Partner ${status}`, data: partner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Set partner password (Admin - for initial access)
router.put('/:id/password', adminAuth, async (req, res) => {
  try {
    const { password } = req.body;
    
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    
    partner.password = password;
    await partner.save();
    
    res.json({ success: true, message: 'Password set successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Add commission (Admin)
router.put('/:id/commission', adminAuth, async (req, res) => {
  try {
    const { clientId, clientName, amount, type, notes } = req.body;
    
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    
    const commission = {
      transactionId: `TXN-${Date.now()}`,
      clientId,
      clientName,
      amount,
      type: type || 'referral',
      status: 'pending',
      createdAt: new Date(),
      notes
    };
    
    partner.commissions.push(commission);
    partner.stats.totalEarnings += amount;
    partner.stats.pendingPayout += amount;
    await partner.save();
    
    res.json({ success: true, message: 'Commission added', data: commission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Mark commission as paid (Admin)
router.put('/:id/commission/:txnId/paid', adminAuth, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    
    const commission = partner.commissions.find(c => c.transactionId === req.params.txnId);
    if (!commission) {
      return res.status(404).json({ success: false, message: 'Commission not found' });
    }
    
    commission.status = 'paid';
    commission.paidAt = new Date();
    commission.commissionPaid = true;
    partner.stats.pendingPayout -= commission.amount;
    await partner.save();
    
    res.json({ success: true, message: 'Commission marked as paid', data: commission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

  // DELETE - Partner (Admin)
  router.delete('/:id', adminAuth, async (req, res) => {
    try {
      const partner = await Partner.findById(req.params.id);
      if (!partner) {
        return res.status(404).json({ success: false, message: 'Partner not found' });
      }
      
      await Partner.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Partner deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // POST - Forgot Password (Send OTP)
  router.post('/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }
      
      const partner = await Partner.findOne({ email });
      if (!partner) {
        return res.status(404).json({ success: false, message: 'No partner found with this email' });
      }
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      // Store OTP (in real app, send via email)
      partner.resetOtp = otp;
      partner.resetOtpExpiry = otpExpiry;
      await partner.save();
      
      // In production, send email with OTP
      // For now, return OTP in response for testing
      console.log(`Partner OTP for ${email}: ${otp}`);
      
      res.json({ 
        success: true, 
        message: 'OTP sent successfully',
        data: { email: partner.email } // Don't expose OTP in production
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // POST - Verify OTP
  router.post('/verify-otp', async (req, res) => {
    try {
      const { email, otp } = req.body;
      
      if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
      }
      
      const partner = await Partner.findOne({ email });
      if (!partner) {
        return res.status(404).json({ success: false, message: 'Partner not found' });
      }
      
      if (!partner.resetOtp || partner.resetOtp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
      }
      
      if (!partner.resetOtpExpiry || new Date() > partner.resetOtpExpiry) {
        return res.status(400).json({ success: false, message: 'OTP has expired' });
      }
      
      res.json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // POST - Reset Password
  router.post('/reset-password', async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      
      if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: 'Email, OTP and new password are required' });
      }
      
      const partner = await Partner.findOne({ email });
      if (!partner) {
        return res.status(404).json({ success: false, message: 'Partner not found' });
      }
      
      if (!partner.resetOtp || partner.resetOtp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
      }
      
      if (!partner.resetOtpExpiry || new Date() > partner.resetOtpExpiry) {
        return res.status(400).json({ success: false, message: 'OTP has expired' });
      }
      
      // Update password and clear OTP
      partner.password = newPassword;
      partner.resetOtp = null;
      partner.resetOtpExpiry = null;
      await partner.save();
      
      res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

module.exports = router;
