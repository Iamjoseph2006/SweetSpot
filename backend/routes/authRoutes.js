const express = require('express');
const router = express.Router();
const { register, login, profile } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', requireAuth, profile);

module.exports = router;