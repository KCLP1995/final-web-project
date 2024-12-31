// models/cartModel.js
const db = require('../config/database');

async function getCartByUserId(userId) {
    const [rows] = await db.execute('SELECT * FROM cart WHERE user_id = ?', [userId]);
    return rows; // Return the cart items
}

async function addProductToCart(userId, productId, quantity) {
    const [result] = await db.execute('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, quantity]);
    return result.insertId;
}

module.exports = { getCartByUserId, addProductToCart };
