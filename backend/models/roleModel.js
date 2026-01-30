const db = require('../config/db');

const Role = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM roles');
    return rows;
  },
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
    return rows[0];
  },
  create: async (name) => {
    const [result] = await db.query('INSERT INTO roles (name) VALUES (?)', [name]);
    return result.insertId;
  }
};

module.exports = Role;
