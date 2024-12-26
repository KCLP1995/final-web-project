const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../config/multer'); // For handling image uploads

// Middleware for overriding methods (PATCH/PUT/DELETE using forms)
const methodOverride = require('method-override');
router.use(methodOverride('_method')); // This allows us to use PUT and DELETE via forms

// Route to get all products (List page)
router.get('/', productController.getAllProducts);

// Route to display the form for creating a new product
router.get('/create', productController.renderCreateForm);

// Route to handle creating a new product
router.post('/', upload.single('image'), productController.createProduct);

// Route to get a product by its ID (Product Details page)
router.get('/:id', productController.getProductById);

// Route to show the form to edit an existing product
router.get('/:id/edit', productController.renderEditForm);

// Route to handle updating a product
router.put('/:id', upload.single('image'), productController.updateProduct);

// Route to handle deleting a product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
