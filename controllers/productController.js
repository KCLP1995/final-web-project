const Product = require('../models/productModel'); // Assuming you're using a model for DB operations

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.render('product/list', { products, title: 'All Products' });
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
};

// Render the form to create a new product
exports.renderCreateForm = (req, res) => {
  res.render('product/create', { title: 'Create New Product' });
};

// Create a new product
exports.createProduct = async (req, res) => {
  const { name, price, description } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    await Product.create({ name, price, description, image });
    req.flash('success', 'Product created successfully!');
    res.redirect('/products');
  } catch (error) {
    req.flash('error', 'Error creating product');
    res.redirect('/products/create');
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.getById(productId);
    res.render('product/details', { product, title: 'Product Details' });
  } catch (error) {
    res.status(500).send('Error fetching product details');
  }
};

// Render the edit form
exports.renderEditForm = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.getById(productId);
    res.render('product/edit', { product, title: 'Edit Product' });
  } catch (error) {
    res.status(500).send('Error fetching product for edit');
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, price, description } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    await Product.update(productId, { name, price, description, image });
    req.flash('success', 'Product updated successfully!');
    res.redirect(`/products/${productId}`);
  } catch (error) {
    req.flash('error', 'Error updating product');
    res.redirect(`/products/${productId}/edit`);
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    await Product.delete(productId);
    req.flash('success', 'Product deleted successfully!');
    res.redirect('/products');
  } catch (error) {
    req.flash('error', 'Error deleting product');
    res.redirect('/products');
  }
};
