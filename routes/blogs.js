const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

const uploadDir = path.join(__dirname, '../uploads/blogs');
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
    return upload.single('image')(req, res, next);
  }
  return express.json()(req, res, next);
};

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
    if (!blog) return res.status(404).json({ message: 'Not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', handleUpload, async (req, res) => {
  try {
    const blogData = { ...req.body };
    if (req.file) {
      blogData.image = `/uploads/blogs/${req.file.filename}`;
    }
    const blog = new Blog(blogData);
    const saved = await blog.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', handleUpload, async (req, res) => {
  try {
    const { id } = req.params;
    let blogData = { ...req.body };
    
    const parseJSON = (val) => {
      if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
        try { return JSON.parse(val); } catch { return val; }
      }
      return val;
    };
    
    Object.keys(blogData).forEach(key => {
      blogData[key] = parseJSON(blogData[key]);
    });
    
    if (req.file) {
      blogData.image = `/uploads/blogs/${req.file.filename}`;
    }
    
    let blog = null;
    if (isValidObjectId(id)) {
      blog = await Blog.findByIdAndUpdate(id, blogData, { new: true });
    }
    if (!blog) {
      blog = await Blog.findOneAndUpdate({ slug: id }, blogData, { new: true });
    }
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let blog = null;
    
    if (isValidObjectId(id)) {
      blog = await Blog.findById(id);
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: id });
    }
    
    if (blog && blog.image) {
      const imagePath = path.join(__dirname, '..', blog.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    let deleted = null;
    if (isValidObjectId(id)) {
      deleted = await Blog.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await Blog.findOneAndDelete({ slug: id });
    }
    if (!deleted) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
