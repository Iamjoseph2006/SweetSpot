const db = require('../config/db');

const createOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const userId = req.user.role_id === 1 ? req.body.user_id : req.user.id;

    if (!userId) {
      connection.release();
      return res.status(400).json({ error: 'user_id es obligatorio' });
    }

    await connection.beginTransaction();

    const [cartItems] = await connection.query(
      `SELECT c.product_id, c.quantity, p.price
       FROM cart c
       INNER JOIN products p ON p.id = c.product_id
       WHERE c.user_id = ?`,
      [userId]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total, status, created_at) VALUES (?, ?, ?, NOW())',
      [userId, total, 'created']
    );

    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      await connection.query(
        'INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: 'Pedido creado correctamente',
      order_id: orderId,
      total,
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    res.status(500).json({ error: 'No se pudo crear el pedido' });
  }
};

const getOrders = async (req, res) => {
  try {
    const isAdmin = req.user.role_id === 1;
    const [rows] = await db.query(
      `SELECT o.id, o.user_id, o.total, o.status, o.created_at, u.*
       FROM orders o
       INNER JOIN users u ON u.id = o.user_id
       ${isAdmin ? '' : 'WHERE o.user_id = ?'}
       ORDER BY o.created_at DESC`,
      isAdmin ? [] : [req.user.id]
    );

    const normalizedRows = rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      total: row.total,
      status: row.status,
      created_at: row.created_at,
      name: row.name ?? row.full_name ?? row.nombre ?? null,
      email: row.email ?? row.correo ?? null,
    }));

    res.json(normalizedRows);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener los pedidos' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !status.trim()) {
      return res.status(400).json({ error: 'status es obligatorio' });
    }

    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status.trim(), id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    return res.json({ message: 'Estado del pedido actualizado' });
  } catch (error) {
    return res.status(500).json({ error: 'No se pudo actualizar el pedido' });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
