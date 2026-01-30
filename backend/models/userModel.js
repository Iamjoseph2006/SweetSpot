const db = require('../config/db');

const User = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
  },
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },
  create: async (name, email, password, role_id) => {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
      [name, email, password, role_id]
    );
    return result.insertId;
  }
};

module.exports = User;
