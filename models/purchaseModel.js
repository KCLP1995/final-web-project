// models/purchase.js
const db = require('../config/database');

class Purchase {
  // Fetch all purchases for a specific customer
  static async getByCustomerId(customerId) {
    try {
      const [rows] = await db.query('SELECT * FROM purchases WHERE customerId = ?', [customerId]);
      return rows;
    } catch (error) {
      throw new Error('Error fetching purchases: ' + error.message);
    }
  }

  // Create a new purchase record
  static async create(data) {
    try {
      const result = await db.query(
        "INSERT INTO purchases (productId, customerId, quantity, totalPrice, status) VALUES (?, ?, ?, ?, ?)",
        [data.productId, data.customerId, data.quantity, data.totalPrice, data.status]
      );
      return result;
    } catch (error) {
      throw new Error('Error creating purchase: ' + error.message);
    }
  }

  // Fetch a single purchase by its ID
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM purchases WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error('Error fetching purchase by ID: ' + error.message);
    }
  }
}

module.exports = Purchase;
