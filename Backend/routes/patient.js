const express = require('express');
const app = express();
const { registerPatient } = require('../controllers/patient');
const multer = require("multer");
const { storage } = require('../utils/cloudinary');
const verifyToken = require('../middleware/auth')
const router = express.Router();

const uploads = multer({ storage });
router.post(
  '/register',verifyToken,
  uploads.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
  ]),
  registerPatient
);
module.exports = router;
