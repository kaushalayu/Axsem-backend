const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SupportTicket = require('../models/SupportTicket');

const JWT_SECRET = process.env.JWT_SECRET || 'Axsem';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

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
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { category, subject, description, priority, attachments } = req.body;
    
    const ticket = new SupportTicket({
      userType: req.user.userType || 'partner',
      userId: req.user.id,
      category,
      subject,
      description,
      priority,
      attachments
    });
    
    await ticket.save();
    
    res.status(201).json({ success: true, message: 'Ticket created', data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (req.user.role === 'admin') {
      if (status) query.status = status;
      if (priority) query.priority = priority;
    } else {
      query.userId = req.user.id;
    }
    
    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await SupportTicket.countDocuments(query);
    
    res.json({
      success: true,
      data: tickets,
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

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const total = await SupportTicket.countDocuments();
    const open = await SupportTicket.countDocuments({ status: 'open' });
    const inProgress = await SupportTicket.countDocuments({ status: 'in_progress' });
    const resolved = await SupportTicket.countDocuments({ status: 'resolved' });
    const closed = await SupportTicket.countDocuments({ status: 'closed' });
    
    const urgentTickets = await SupportTicket.find({ priority: 'urgent' }).lean();
    const urgent = urgentTickets.filter(t => t.status !== 'closed').length;
    
    res.json({
      success: true,
      data: { total, open, inProgress, resolved, closed, urgent }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    if (req.user.role !== 'admin' && ticket.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { subject, description, priority } = req.body;
    
    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    if (req.user.role !== 'admin' && ticket.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    if (subject) ticket.subject = subject;
    if (description) ticket.description = description;
    if (priority && req.user.role === 'admin') ticket.priority = priority;
    
    await ticket.save();
    
    res.json({ success: true, message: 'Ticket updated', data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/respond', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    
    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    if (req.user.role !== 'admin' && ticket.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    ticket.responses.push({
      respondedBy: req.user.id,
      userType: req.user.role === 'admin' ? 'admin' : (req.user.userType || 'partner'),
      message
    });
    
    await ticket.save();
    
    res.json({ success: true, message: 'Response added', data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    ticket.status = status;
    if (status === 'resolved') ticket.resolvedAt = new Date();
    if (status === 'closed') ticket.closedAt = new Date();
    
    await ticket.save();
    
    res.json({ success: true, message: 'Status updated', data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/assign', adminAuth, async (req, res) => {
  try {
    const { assignedTo } = req.body;
    
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { assignedTo, status: 'in_progress' },
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    res.json({ success: true, message: 'Ticket assigned', data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await SupportTicket.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Ticket deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;