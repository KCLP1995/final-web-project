const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const methodOverride = require('method-override');

// Middleware for overriding methods (used for PUT and DELETE)
router.use(methodOverride('_method'));

// Route to view all purchases made by the user (viewing purchases should be under `/purchase`)
router.get('/', purchaseController.getPurchases);  // Correct route: /purchase

// Route to create a new purchase
router.post('/', purchaseController.createPurchase); // Correct route: /purchase

// Route to view details of a specific purchase
router.get('/:id', purchaseController.getPurchaseDetails); // Correct route: /purchase/:id

module.exports = router;
