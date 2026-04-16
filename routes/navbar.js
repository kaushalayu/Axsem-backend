const express = require('express');
const router = express.Router();
const NavbarLink = require('../models/NavbarLink');

// GET all navbar links
router.get('/', async (req, res) => {
  try {
    const links = await NavbarLink.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all navbar links (including inactive) - for admin
router.get('/all', async (req, res) => {
  try {
    const links = await NavbarLink.find()
      .sort({ category: 1, order: 1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET by category
router.get('/category/:category', async (req, res) => {
  try {
    const links = await NavbarLink.find({ 
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
    const link = await NavbarLink.findById(req.params.id);
    if (!link) return res.status(404).json({ message: 'Link not found' });
    res.json(link);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Create new link
router.post('/', async (req, res) => {
  try {
    const maxOrder = await NavbarLink.findOne({ category: req.body.category })
      .sort({ order: -1 });
    const newOrder = maxOrder ? maxOrder.order + 1 : 0;

    const link = new NavbarLink({
      category: req.body.category,
      title: req.body.title,
      url: req.body.url,
      icon: req.body.icon || null,
      order: req.body.order !== undefined ? req.body.order : newOrder,
      parentId: req.body.parentId || null,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      openInNewTab: req.body.openInNewTab || false,
      megaMenuData: req.body.megaMenuData || null,
      isPackage: req.body.isPackage || false,
      isHighlighted: req.body.isHighlighted || false
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
    const link = await NavbarLink.findById(req.params.id);
    if (!link) return res.status(404).json({ message: 'Link not found' });

    link.category = req.body.category || link.category;
    link.title = req.body.title || link.title;
    link.url = req.body.url || link.url;
    link.icon = req.body.icon !== undefined ? req.body.icon : link.icon;
    link.order = req.body.order !== undefined ? req.body.order : link.order;
    link.parentId = req.body.parentId !== undefined ? req.body.parentId : link.parentId;
    link.isActive = req.body.isActive !== undefined ? req.body.isActive : link.isActive;
    link.openInNewTab = req.body.openInNewTab !== undefined ? req.body.openInNewTab : link.openInNewTab;
    link.megaMenuData = req.body.megaMenuData !== undefined ? req.body.megaMenuData : link.megaMenuData;
    link.isPackage = req.body.isPackage !== undefined ? req.body.isPackage : link.isPackage;
    link.isHighlighted = req.body.isHighlighted !== undefined ? req.body.isHighlighted : link.isHighlighted;

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

    await NavbarLink.bulkWrite(bulkOps);
    
    const updatedLinks = await NavbarLink.find()
      .sort({ category: 1, order: 1 });
    
    res.json(updatedLinks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Remove link
router.delete('/:id', async (req, res) => {
  try {
    const link = await NavbarLink.findById(req.params.id);
    if (!link) return res.status(404).json({ message: 'Link not found' });

    // Also delete any child links
    await NavbarLink.deleteMany({ parentId: req.params.id });
    await NavbarLink.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Link deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Bulk create links (for initial setup)
router.post('/bulk', async (req, res) => {
  try {
    const { links } = req.body;
    
    if (!links || !Array.isArray(links)) {
      return res.status(400).json({ message: 'Links array is required' });
    }

    // Delete existing links
    await NavbarLink.deleteMany({});
    
    // Insert new links
    const insertedLinks = await NavbarLink.insertMany(links);
    
    res.status(201).json(insertedLinks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
