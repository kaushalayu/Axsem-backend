const express = require('express');
const router = express.Router();
const Page = require('../models/Page');

// GET all pages (published only for public)
router.get('/', async (req, res) => {
  try {
    const pages = await Page.find({ status: 'published' })
      .select('slug title template seo')
      .sort({ title: 1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all pages (including draft) - for admin
router.get('/all', async (req, res) => {
  try {
    const pages = await Page.find()
      .sort({ status: 1, title: 1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ 
      slug: req.params.slug,
      status: 'published'
    });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Create new page
router.post('/', async (req, res) => {
  try {
    const page = new Page(req.body);
    const savedPage = await page.save();
    res.status(201).json(savedPage);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Slug already exists' });
    }
    res.status(400).json({ message: err.message });
  }
});

// PUT - Update page
router.put('/:id', async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Slug already exists' });
    }
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Remove page
router.delete('/:id', async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json({ message: 'Page deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Duplicate page
router.post('/duplicate/:id', async (req, res) => {
  try {
    const original = await Page.findById(req.params.id);
    if (!original) return res.status(404).json({ message: 'Page not found' });
    
    const duplicate = new Page({
      ...original.toObject(),
      _id: undefined,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      status: 'draft',
      createdAt: undefined,
      updatedAt: undefined
    });
    
    const savedPage = await duplicate.save();
    res.status(201).json(savedPage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;