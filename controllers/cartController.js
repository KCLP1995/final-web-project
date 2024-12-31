const Cart = require('../models/cartModel');
const Product = require('../models/productModel'); // Assuming a product model exists
const stripe = require('stripe')('your_stripe_secret_key'); // Stripe for payment

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    await Cart.addToCart(userId, productId, quantity);
    res.status(200).send("Item added to cart!");
  } catch (error) {
    res.status(500).send("Could not add item to cart: " + error.message);
  }
};

// Get cart items for a user
exports.getCartItems = async (req, res) => {
  try {
    const { userId } = req.body;
    const cartItems = await Cart.getCartItems(userId);
    let total = 0;
    for (let item of cartItems) {
      const product = await Product.getProductById(item.product_id);
      item.price = product.price;
      total += item.price * item.quantity;
    }
    res.status(200).json({ cartItems, total });
  } catch (error) {
    res.status(500).send("Error fetching cart items: " + error.message);
  }
};

// Update cart quantity
exports.updateCart = async (req, res) => {
  try {
    const { userId, productId, newQuantity } = req.body;
    await Cart.updateCart(userId, productId, newQuantity);
    res.status(200).send("Cart updated successfully");
  } catch (error) {
    res.status(500).send("Error updating cart: " + error.message);
  }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    await Cart.removeFromCart(userId, productId);
    res.status(200).send("Product removed from cart");
  } catch (error) {
    res.status(500).send("Error removing product from cart: " + error.message);
  }
};

// Checkout and process payment
exports.checkout = async (req, res) => {
  const { userId, paymentMethodId } = req.body;

  try {
    const cartItems = await Cart.getCartItems(userId);
    let total = 0;
    for (let item of cartItems) {
      const product = await Product.getProductById(item.product_id);
      total += product.price * item.quantity;
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100, // amount in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    // Store order in database
    const orderResult = await db.query('INSERT INTO orders (user_id, total_amount) VALUES (?, ?)', [userId, total]);

    // Clear cart after successful checkout
    await Cart.clearCart(userId);

    res.status(200).send("Payment successful, order processed");
  } catch (error) {
    res.status(500).send("Error processing payment: " + error.message);
  }
};
