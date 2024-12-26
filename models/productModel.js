const db = require("../config/database");

class Product {
  /**
   * Fetch all products from the database
   * @returns {Promise<Array>} List of all products
   */
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM products');
      return rows;
    } catch (error) {
      throw new Error('Error fetching products: ' + error.message);
    }
  }

  /**
   * Create a new product
   * @param {Object} data - Product data (name, price, description, image)
   * @returns {Promise<Object>} Result of the insert operation
   */
  static async create(data) {
    try {
      const result = await db.query(
        "INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)",
        [data.name, data.price, data.description, data.image]
      );
      return result;
    } catch (error) {
      throw new Error('Error creating product: ' + error.message);
    }
  }

  /**
   * Get a single product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object|null>} The product if found, otherwise null
   */
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error('Error fetching product by ID: ' + error.message);
    }
  }

  /**
   * Update an existing product
   * @param {number} id - Product ID
   * @param {Object} data - Updated product data
   * @returns {Promise<Object>} Result of the update operation
   */
  static async update(id, data) {
    try {
      const result = await db.query(
        'UPDATE products SET name = ?, price = ?, description = ?, image = ? WHERE id = ?',
        [data.name, data.price, data.description, data.image, id]
      );
      return result;
    } catch (error) {
      throw new Error('Error updating product: ' + error.message);
    }
  }

  /**
   * Delete a product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Result of the delete operation
   */
  static async delete(id) {
    try {
      const result = await db.query('DELETE FROM products WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw new Error('Error deleting product: ' + error.message);
    }
  }
}

module.exports = Product;
