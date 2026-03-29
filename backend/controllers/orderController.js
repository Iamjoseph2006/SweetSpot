const db = require('../config/db');

const createOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { user_id } = req.body;

    if (!user_id) {
      connection.release();
      return res.status(400).json({ error: 'user_id es obligatorio' });
    }

    await connection.beginTransaction();

    const [cartItems] = await connection.query(
      `SELECT c.product_id, c.quantity, p.price
       FROM cart c
       INNER JOIN products p ON p.id = c.product_id
       WHERE c.user_id = ?`,
      [user_id]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total, status, created_at) VALUES (?, ?, ?, NOW())',
      [user_id, total, 'created']
    );

    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      await connection.query(
        'INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    await connection.query('DELETE FROM cart WHERE user_id = ?', [user_id]);

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

module.exports = {
  createOrder,
};
