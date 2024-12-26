const express = require('express');
const router = express.Router();
const connection = require('../server');  // Ensure this points to your MySQL connection

// Route to show all products
router.get('/', (req, res) => {
  const query = 'SELECT * FROM products';
  connection.query(query, (err, results) => {
    if (err) {
      req.flash('error', 'Error retrieving products');
      return res.redirect('/');
    }
    res.render('index/index', { 
      title: 'Products', 
      products: results, 
      messages: req.flash() 
    });
  });
});

module.exports = router;
