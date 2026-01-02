const express = require('express');
const router = express.Router();
const { updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/update', protect, updateUserProfile);

module.exports = router;
