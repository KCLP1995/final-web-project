const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../config/multer');

// Middleware for overriding methods
const methodOverride = require('method-override');
router.use(methodOverride('_method'));

// List all products
router.get('/', productController.getAllProducts);

// Show create product form
router.get('/create', productController.renderCreateForm);

// Create a new product (POST)
router.post('/', upload.single('image'), productController.createProduct);

// Show product details
router.get('/:id', productController.getProductById);

// Show edit product form
router.get('/:id/edit', productController.renderEditForm);

// Update product (PUT)
router.put('/:id', upload.single('image'), productController.updateProduct);

// Delete product (DELETE)
router.delete('/:id', productController.deleteProduct);

module.exports = router;
