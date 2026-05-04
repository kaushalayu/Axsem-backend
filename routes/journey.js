const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Journey = require('../models/Journey');

const uploadDir = path.join(__dirname, '../uploads/journey');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const milestones = await Journey.find().sort({ order: 1, createdAt: 1 });
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = `/uploads/journey/${req.file.filename}`;
    }
    if (data.stat && typeof data.stat === 'string') {
        data.stat = JSON.parse(data.stat);
    }
    if (data.tags && typeof data.tags === 'string') {
        data.tags = data.tags.split(',').map(t => t.trim());
    }
    const milestone = new Journey(data);
    const saved = await milestone.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = `/uploads/journey/${req.file.filename}`;
    }
    if (data.stat && typeof data.stat === 'string') {
        data.stat = JSON.parse(data.stat);
    }
    if (data.tags && typeof data.tags === 'string') {
        data.tags = data.tags.split(',').map(t => t.trim());
    }
    const updated = await Journey.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Journey.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
