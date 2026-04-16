const express = require('express');
const router = express.Router();
const FooterLink = require('../models/FooterLink');

// GET all footer links
router.get('/', async (req, res) => {
  try {
    const links = await FooterLink.find({ isActive: true })
      .sort({ category: 1, order: 1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all footer links (including inactive) - for admin
router.get('/all', async (req, res) => {
  try {
    const links = await FooterLink.find()
      .sort({ category: 1, order: 1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET by category
router.get('/category/:category', async (req, res) => {
  try {
    const links = await FooterLink.find({ 
      category: req.params.category,
      isActive: true 
    }).sort({ order: 1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const link = await FooterLink.findById(req.params.id);
    if (!link) return res.status(404).json({ message: 'Link not found' });
    res.json(link);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Create new link
router.post('/', async (req, res) => {
  try {
    const maxOrder = await FooterLink.findOne({ category: req.body.category })
      .sort({ order: -1 });
    const newOrder = maxOrder ? maxOrder.order + 1 : 0;

    const link = new FooterLink({
      category: req.body.category,
      title: req.body.title,
      url: req.body.url,
      icon: req.body.icon || null,
      order: req.body.order !== undefined ? req.body.order : newOrder,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      openInNewTab: req.body.openInNewTab || false
    });

    const savedLink = await link.save();
    res.status(201).json(savedLink);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - Update link
router.put('/:id', async (req, res) => {
  try {
    const link = await FooterLink.findById(req.params.id);
    if (!link) return res.status(404).json({ message: 'Link not found' });

    link.category = req.body.category || link.category;
    link.title = req.body.title || link.title;
    link.url = req.body.url || link.url;
    link.icon = req.body.icon !== undefined ? req.body.icon : link.icon;
    link.order = req.body.order !== undefined ? req.body.order : link.order;
    link.isActive = req.body.isActive !== undefined ? req.body.isActive : link.isActive;
    link.openInNewTab = req.body.openInNewTab !== undefined ? req.body.openInNewTab : link.openInNewTab;

    const updatedLink = await link.save();
    res.json(updatedLink);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH - Reorder links
router.patch('/reorder', async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Items array is required' });
    }

    const bulkOps = items.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order, category: item.category } }
      }
    }));

    await FooterLink.bulkWrite(bulkOps);
    
    const updatedLinks = await FooterLink.find()
      .sort({ category: 1, order: 1 });
    
    res.json(updatedLinks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Remove link
router.delete('/:id', async (req, res) => {
  try {
    const link = await FooterLink.findById(req.params.id);
    if (!link) return res.status(404).json({ message: 'Link not found' });

    await FooterLink.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Link deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
