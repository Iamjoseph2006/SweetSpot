const express = require('express');
const { addToCart, getCartByUser, deleteCartItem } = require('../controllers/cartController');

const router = express.Router();

router.post('/', addToCart);
router.get('/:userId', getCartByUser);
router.delete('/:id', deleteCartItem);

module.exports = router;
