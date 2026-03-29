const express = require('express');
const {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  inactivateProduct,
  activateProduct,
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.patch('/:id/inactivate', inactivateProduct);
router.patch('/:id/activate', activateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
