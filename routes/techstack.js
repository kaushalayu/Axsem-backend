const express = require('express');
const router = express.Router();
const TechStack = require('../models/TechStack');

router.post('/', async (req, res) => {
  try {
    const tech = new TechStack(req.body);
    await tech.save();
    res.status(201).json({ success: true, data: tech });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const techs = await TechStack.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: techs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tech = await TechStack.findById(req.params.id);
    res.json({ success: true, data: tech });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tech = await TechStack.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: tech });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await TechStack.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;