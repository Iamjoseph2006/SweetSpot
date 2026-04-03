const db = require('../config/db');

const ORDER_STATUS_MAP = {
  created: 'created',
  creado: 'created',
  preparing: 'preparing',
  'en preparación': 'preparing',
  'en preparacion': 'preparing',
  sent: 'sent',
  enviado: 'sent',
  delivered: 'delivered',
  entregado: 'delivered',
};
const ALLOWED_STATUS = ['created', 'preparing', 'sent', 'delivered'];
let orderColumnsChecked = false;

const normalizeStatus = (status) => {
  if (!status || typeof status !== 'string') return 'created';
  const normalized = status.trim().toLowerCase();
  return ORDER_STATUS_MAP[normalized] ?? 'created';
};

const ensureOrderColumns = async () => {
  if (orderColumnsChecked) return;

  const [deliveryLocation] = await db.query("SHOW COLUMNS FROM orders LIKE 'delivery_location'");
  if (!deliveryLocation.length) {
    await db.query('ALTER TABLE orders ADD COLUMN delivery_location VARCHAR(255) NULL');
  }

  const [deliveryPreference] = await db.query("SHOW COLUMNS FROM orders LIKE 'delivery_preference'");
  if (!deliveryPreference.length) {
    await db.query('ALTER TABLE orders ADD COLUMN delivery_preference TEXT NULL');
  }

  orderColumnsChecked = true;
};

const createOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await ensureOrderColumns();
    const userId = req.user.role_id === 1 ? req.body.user_id : req.user.id;
    const deliveryLocation = typeof req.body.delivery_location === 'string' ? req.body.delivery_location.trim() : '';
    const deliveryPreference = typeof req.body.delivery_preference === 'string' ? req.body.delivery_preference.trim() : '';

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
      `INSERT INTO orders (user_id, total, status, created_at, delivery_location, delivery_preference)
       VALUES (?, ?, ?, NOW(), ?, ?)`,
      [userId, total, 'created', deliveryLocation || null, deliveryPreference || null]
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
    await ensureOrderColumns();
    const isAdmin = req.user.role_id === 1;
    const [rows] = await db.query(
      `SELECT
         o.id AS order_id,
         o.user_id,
         o.total,
         o.status,
         o.created_at,
         o.delivery_location,
         o.delivery_preference,
         u.name AS user_name,
         u.full_name AS user_full_name,
         u.nombre AS user_nombre,
         u.email AS user_email,
         u.correo AS user_correo
       FROM orders o
       INNER JOIN users u ON u.id = o.user_id
       ${isAdmin ? '' : 'WHERE o.user_id = ?'}
       ORDER BY o.created_at DESC`,
      isAdmin ? [] : [req.user.id]
    );

    const normalizedRows = rows.map((row) => ({
      id: row.order_id,
      user_id: row.user_id,
      total: row.total,
      status: normalizeStatus(row.status),
      created_at: row.created_at,
      delivery_location: row.delivery_location ?? null,
      delivery_preference: row.delivery_preference ?? null,
      name: row.user_name ?? row.user_full_name ?? row.user_nombre ?? null,
      email: row.user_email ?? row.user_correo ?? null,
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
    const orderId = Number(id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ error: 'id de pedido inválido' });
    }

    if (!status || !status.trim()) {
      return res.status(400).json({ error: 'status es obligatorio' });
    }

    const normalizedStatus = normalizeStatus(status);
    if (!ALLOWED_STATUS.includes(normalizedStatus)) {
      return res.status(400).json({ error: 'Estado de pedido inválido' });
    }

    const [existingRows] = await db.query('SELECT id, status FROM orders WHERE id = ? LIMIT 1', [orderId]);
    if (!existingRows.length) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const currentStatus = normalizeStatus(existingRows[0].status);
    if (currentStatus === normalizedStatus) {
      return res.json({
        message: 'El pedido ya tenía ese estado',
        order: { id: orderId, status: currentStatus },
      });
    }

    await db.query('UPDATE orders SET status = ? WHERE id = ?', [normalizedStatus, orderId]);

    const [updatedRows] = await db.query('SELECT id, status FROM orders WHERE id = ? LIMIT 1', [orderId]);

    return res.json({
      message: 'Estado del pedido actualizado',
      order: {
        id: updatedRows[0].id,
        status: normalizeStatus(updatedRows[0].status),
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'No se pudo actualizar el pedido' });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
