const db = require('../config/database'); // Import database configuration

const User = {
    create: async ({ username, email, password }) => {
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, password]
        );
        return { id: result.insertId, username, email };
    },
    findByUsername: async (username) => {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    },
    findByEmail: async (email) => {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }
};

module.exports = User;
