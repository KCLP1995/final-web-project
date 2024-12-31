const express = require('express');
const router = express.Router();

// Route to view the cart
router.get('/', (req, res) => {
    // Ensure cart exists in session or initialize it as an empty array
    const cart = req.session.cart || [];
    
    // Render the cart page and pass the cart data to the view
    res.render('cart/cart', { 
        title: 'Your Cart', 
        cart: cart,  // Pass cart to the view
        messages: req.flash()  // Optionally pass flash messages
    });
});

// Route to add an item to the cart
router.post('/add-to-cart', (req, res) => {
    // Assuming you have an 'item' object in the request body
    const cart = req.session.cart || [];
    const item = req.body.item;  // Modify according to your item structure

    // Add the item to the cart
    cart.push(item);
    req.session.cart = cart;

    // Set a flash message for success
    req.flash('success', 'Item added to cart successfully!');

    // Redirect back to the cart page
    res.redirect('/cart');
});

// Route to clear the cart
router.post('/clear-cart', (req, res) => {
    req.session.cart = []; // Clear the cart
    req.flash('success', 'Your cart has been cleared.');

    // Redirect to the cart page
    res.redirect('/cart');
});

module.exports = router;
