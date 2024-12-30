// controllers/purchaseController.js
const Purchase = require('../models/purchaseModel');

const purchaseController = {
  // Fetch all purchases made by the user
  async getPurchases(req, res) {
    try {
      const customerId = req.user.id; // Assuming user is logged in and the ID is stored in req.user
      const purchases = await Purchase.getByCustomerId(customerId);
      res.render('purchase/list', { title: 'Your Purchases', purchases });
    } catch (error) {
      req.flash('error', `Error fetching purchases: ${error.message}`);
      res.redirect('/');
    }
  },

  // Handle the creation of a new purchase
  async createPurchase(req, res) {
    try {
      const { productId, quantity, totalPrice } = req.body;

      // Assuming user is logged in and we get their ID from req.user
      const customerId = req.user.id;

      const purchaseData = {
        productId,
        customerId,
        quantity,
        totalPrice,
        status: 'pending', // You can update this as per your system's requirements
      };

      await Purchase.create(purchaseData);
      req.flash('success', 'Purchase successful!');
      res.redirect('/purchases');
    } catch (error) {
      req.flash('error', `Error creating purchase: ${error.message}`);
      res.redirect('/purchases');
    }
  },

  // View details of a specific purchase
  async getPurchaseDetails(req, res) {
    try {
      const purchaseId = req.params.id;
      const purchase = await Purchase.getById(purchaseId);
      res.render('purchase/detail', { title: 'Purchase Details', purchase });
    } catch (error) {
      req.flash('error', `Error fetching purchase details: ${error.message}`);
      res.redirect('/purchases');
    }
  },
};

module.exports = purchaseController;
