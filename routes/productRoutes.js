const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const methodOverrid = require('method-override');
router.use(methodOverrid('_method'));


router.get('/',productController.getAllProducts);
router.get('/create',productController.renderCreateForm);
router.post('/',productController.createProduct);
module.exports = router;