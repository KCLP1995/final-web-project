const db = require("../config/database");

class User {
    // Find a user by email
    static async findOne({ email }) {
        try {
            const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            return rows.length ? rows[0] : null;
        } catch (err) {
            throw err;
        }
    }

    // Create a new user
    static async create({ username, email, password }) {
        try {
            const [result] = await db.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
                [username, email, password]
            );
            return result.insertId; // Return the ID of the new user
        } catch (err) {
            throw err;
        }
    }
}

module.exports = User;
