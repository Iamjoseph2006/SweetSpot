const db = require('../config/db');

const addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
      return res.status(400).json({ error: 'user_id, product_id y quantity son obligatorios' });
    }

    const [result] = await db.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [user_id, product_id, quantity]
    );

    res.status(201).json({ id: result.insertId, user_id, product_id, quantity });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo agregar al carrito' });
  }
};

const getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.query(
      `SELECT c.id, c.user_id, c.product_id, c.quantity, p.name, p.price, p.image
       FROM cart c
       INNER JOIN products p ON p.id = c.product_id
       WHERE c.user_id = ?
       ORDER BY c.id DESC`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo obtener el carrito' });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM cart WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    res.json({ message: 'Item eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar el item del carrito' });
  }
};

module.exports = {
  addToCart,
  getCartByUser,
  deleteCartItem,
};
