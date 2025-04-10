const express = require('express');
const app = express();
const { registerDoctor } = require('../controllers/doctor');
const multer = require("multer");
const { storage } = require('../utils/cloudinary');
const verifyToken = require('../middleware/auth');

const router = express.Router();

const doctorPhotoUpload = multer({ storage });
router.post(
  '/register',verifyToken,
  (req, res, next) => {
    doctorPhotoUpload.single('profilePhoto')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          console.error('Multer error:', err);
          return res.status(400).json({ error: 'File upload error', details: err.message });
        } else {
          console.error('Other error:', err);
          return res.status(400).json({ error: 'Invalid file type', details: err.message });
        }
      }
      next();
    });
  },
  registerDoctor
);
module.exports = router;
