const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Middleware for overriding methods
const methodOverride = require('method-override');
router.use(methodOverride('_method'));

router.get('/',productController.getAllProducts);
router.get('/create',productController.renderCreateForm);
router.post('/',productController.createProduct);
router.get('/:id', productController.getProductById); // Show product details
router.get('/:id/edit', productController.renderEditForm); // Show edit form
router.put('/:id', productController.updateProduct); // Update product
router.delete('/:id', productController.deleteProduct); // Delete product


module.exports = router;