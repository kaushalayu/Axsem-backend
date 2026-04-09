const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Team = require('../models/Team');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const uploadDir = path.join(__dirname, '../uploads/team');
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
    const team = await Team.find().sort({ createdAt: -1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid team member ID' });
    }
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const teamData = { ...req.body };
    if (req.file) {
      teamData.image = `/uploads/team/${req.file.filename}`;
    }
    const member = new Team(teamData);
    const saved = await member.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid team member ID' });
    }
    const teamData = { ...req.body };
    if (req.file) {
      teamData.image = `/uploads/team/${req.file.filename}`;
    }
    const member = await Team.findByIdAndUpdate(req.params.id, teamData, { new: true });
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid team member ID' });
    }
    const member = await Team.findById(req.params.id);
    if (member && member.image) {
      const imagePath = path.join(__dirname, '..', member.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    const deleted = await Team.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
