const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Project = require('../models/Project');

const uploadDir = path.join(__dirname, '../uploads/projects');
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

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleUpload = (req, res, next) => {
  if (req.is('multipart/form-data')) {
    return upload.array('gallery', 10)(req, res, next);
  }
  return express.json()(req, res, next);
};

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let project = null;
    
    // Try finding by custom id field first
    project = await Project.findOne({ id: id });
    
    // If not found, try by MongoDB _id
    if (!project && id.length === 24) {
      try {
        project = await Project.findOne({ _id: id });
      } catch (e) {
        // Invalid ObjectId, ignore
      }
    }
    
    // If still not found, try by title (case insensitive)
    if (!project) {
      project = await Project.findOne({ 
        title: { $regex: new RegExp('^' + id.replace(/-/g, ' '), 'i') }
      });
    }
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', upload.array('gallery', 10), async (req, res) => {
  try {
    const projectData = { ...req.body };
    if (req.files && req.files.length > 0) {
      projectData.gallery = req.files.map(file => `/uploads/projects/${file.filename}`);
    }
    const project = new Project(projectData);
    const saved = await project.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', handleUpload, async (req, res) => {
  try {
    const { id } = req.params;
    let projectData = { ...req.body };
    
    const parseJSON = (val) => {
      if (typeof val === 'string' && val.startsWith('[')) {
        try { return JSON.parse(val); } catch { return val; }
      }
      return val;
    };
    
    Object.keys(projectData).forEach(key => {
      projectData[key] = parseJSON(projectData[key]);
    });
    
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/projects/${file.filename}`);
      let existingProject = null;
      if (isValidObjectId(id)) {
        existingProject = await Project.findOne({ _id: id });
      }
      if (!existingProject) {
        existingProject = await Project.findOne({ id: id });
      }
      if (existingProject) {
        const existingGallery = Array.isArray(existingProject.gallery) ? existingProject.gallery : [];
        projectData.gallery = [...existingGallery, ...newImages];
      } else {
        projectData.gallery = newImages;
      }
    }
    
    let updated = null;
    if (isValidObjectId(id)) {
      updated = await Project.findOneAndUpdate({ _id: id }, projectData, { new: true });
    }
    if (!updated) {
      updated = await Project.findOneAndUpdate({ id: id }, projectData, { new: true });
    }
    if (!updated) {
      return res.status(404).json({ message: 'Project not found', requestedId: id });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let project = null;
    
    if (isValidObjectId(id)) {
      project = await Project.findOne({ _id: id });
    }
    if (!project) {
      project = await Project.findOne({ id: id });
    }
    
    if (project && project.gallery && project.gallery.length > 0) {
      for (const imageUrl of project.gallery) {
        const imagePath = path.join(__dirname, '..', imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }
    
    let deleted = null;
    if (isValidObjectId(id)) {
      deleted = await Project.findOneAndDelete({ _id: id });
    }
    if (!deleted) {
      deleted = await Project.findOneAndDelete({ id: id });
    }
    if (!deleted) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
