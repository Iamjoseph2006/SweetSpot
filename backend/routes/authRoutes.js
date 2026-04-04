const express = require('express');
const router = express.Router();
const { register, login, profile, checkEmail } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/check-email', checkEmail);
router.get('/profile', requireAuth, profile);

module.exports = router;
