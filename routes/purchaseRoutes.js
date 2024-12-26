// routes/purchaseRoutes.js
const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const methodOverride = require('method-override');

// Middleware for overriding methods (used for PUT and DELETE)
router.use(methodOverride('_method'));

// Route to view all purchases made by the user
router.get('/purchases', purchaseController.getPurchases);

// Route to create a new purchase
router.post('/purchase', purchaseController.createPurchase);

// Route to view details of a specific purchase
router.get('/purchase/:id', purchaseController.getPurchaseDetails);

module.exports = router;
