const db = require('../config/db');

const normalizeUserRow = (row) => {
  if (!row) {
    return row;
  }

  const name = row.name ?? row.full_name ?? row.nombre ?? null;
  const email = row.email ?? row.correo ?? null;

  return {
    ...row,
    name,
    email,
  };
};

const User = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM users');
    return rows.map(normalizeUserRow);
  },
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return normalizeUserRow(rows[0]);
  },
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return normalizeUserRow(rows[0]);
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
