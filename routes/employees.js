const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const JWT_SECRET = process.env.JWT_SECRET || 'Axsem';

const authMiddleware = (req, res, next) => {
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

const verifyMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// GET - Search employee by ID or email (public for verification)
router.get('/verify', async (req, res) => {
  try {
    const { employeeId, email } = req.query;
    
    if (!employeeId && !email) {
      return res.status(400).json({ success: false, message: 'Provide employeeId or email' });
    }

    const query = {};
    if (employeeId) query.employeeId = employeeId.toUpperCase();
    if (email) query.email = email.toLowerCase();

    const employee = await Employee.findOne(query);

    if (!employee) {
      return res.json({ success: true, found: false, message: 'No matching employee found' });
    }

    res.json({
      success: true,
      found: true,
      employee: {
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        designation: employee.designation,
        department: employee.department,
        joiningDate: employee.joiningDate,
        status: employee.status,
        location: employee.location,
        company: employee.company
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET - All employees (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, department, search } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST - Add employee (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT - Update employee
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE - Delete employee
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET - Stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const total = await Employee.countDocuments();
    const active = await Employee.countDocuments({ status: 'active' });
    const inactive = await Employee.countDocuments({ status: 'inactive' });
    const departments = await Employee.distinct('department');
    
    res.json({
      success: true,
      data: { total, active, inactive, departments: departments.length }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;