const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const router = express.Router();

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

const isCloudinaryConfigured = cloudinaryConfig.cloud_name && 
                                cloudinaryConfig.cloud_name !== 'your_cloud_name' &&
                                cloudinaryConfig.api_key && 
                                cloudinaryConfig.api_key !== 'your_api_key';

if (isCloudinaryConfigured) {
  cloudinary.config(cloudinaryConfig);
  console.log('✅ Cloudinary configured successfully');
} else {
  console.warn('⚠️ Cloudinary not configured. Using local storage fallback.');
}

// Image storage
let imageStorage;
if (isCloudinaryConfigured) {
  imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Axsem',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      transformation: [{ width: 2000, height: 2000, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
    }
  });
} else {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  imageStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  });
}

// Video storage (local only - videos are large for free Cloudinary)
const videoDir = path.join(__dirname, '../uploads/testimonials');
if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, videoDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`)
});

const uploadImage = multer({ 
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    if (allowed.test(file.originalname.toLowerCase()) && allowed.test(file.mimetype)) return cb(null, true);
    cb(new Error('Only images are allowed'));
  }
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowed = /mp4|webm|mov|avi|mkv/;
    const mimeAllowed = /video/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && mimeAllowed.test(file.mimetype)) return cb(null, true);
    cb(new Error('Only video files are allowed'));
  }
});

router.post('/', uploadImage.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: req.file.path, filename: req.file.filename });
});

router.post('/video', uploadVideo.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No video uploaded' });
  const videoUrl = `${req.protocol}://${req.get('host')}/uploads/testimonials/${req.file.filename}`;
  res.json({ url: videoUrl, filename: req.file.filename });
});

router.delete('/:publicId', (req, res) => {
  const publicId = req.params.publicId;
  cloudinary.uploader.destroy(publicId, (result) => {
    if (result.result === 'ok') res.json({ message: 'File deleted' });
    else res.status(404).json({ message: 'File not found' });
  });
});

module.exports = router;
