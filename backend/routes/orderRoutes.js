const express = require('express');
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', requireAuth, createOrder);
router.get('/', requireAuth, getOrders);
router.put('/:id/status', requireAuth, requireAdmin, updateOrderStatus);

module.exports = router;
