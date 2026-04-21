const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const CompanyInfo = require('../models/CompanyInfo');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Axsem/logo',
    allowed_formats: ['jpg', 'jpeg', 'png', 'svg', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
  }
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    let info = await CompanyInfo.findOne();
    if (!info) {
      info = await CompanyInfo.create({});
    }
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', upload.single('logo'), async (req, res) => {
  try {
    const companyData = { ...req.body };
    if (req.file) {
      companyData.logo = req.file.path;
    }
    
    let info = await CompanyInfo.findOne();
    if (!info) {
      info = new CompanyInfo(companyData);
    } else {
      Object.assign(info, companyData);
    }
    const saved = await info.save();
    res.json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
