const db = require('../config/db');

let activeColumnChecked = false;

const ensureActiveColumn = async () => {
  if (activeColumnChecked) return;

  const [columns] = await db.query("SHOW COLUMNS FROM products LIKE 'active'");
  if (!columns.length) {
    await db.query('ALTER TABLE products ADD COLUMN active TINYINT(1) NOT NULL DEFAULT 1');
  }

  activeColumnChecked = true;
};

const getProducts = async (req, res) => {
  try {
    await ensureActiveColumn();
    const [rows] = await db.query('SELECT id, name, description, price, image, active FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener los productos' });
  }
};

const createProduct = async (req, res) => {
  try {
    await ensureActiveColumn();
    const { name, description, price, image } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'name y price son obligatorios' });
    }

    const [result] = await db.query(
      'INSERT INTO products (name, description, price, image, active) VALUES (?, ?, ?, ?, 1)',
      [name, description || '', Number(price), image || '']
    );

    res.status(201).json({
      id: result.insertId,
      name,
      description: description || '',
      price: Number(price),
      image: image || '',
      active: 1,
    });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear el producto' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar el producto' });
  }
};

const updateProduct = async (req, res) => {
  try {
    await ensureActiveColumn();
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'name y price son obligatorios' });
    }

    const [result] = await db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?',
      [name, description || '', Number(price), image || '', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({
      id: Number(id),
      name,
      description: description || '',
      price: Number(price),
      image: image || '',
    });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar el producto' });
  }
};

const setProductActive = async (req, res, active) => {
  try {
    await ensureActiveColumn();
    const { id } = req.params;
    const [result] = await db.query('UPDATE products SET active = ? WHERE id = ?', [active ? 1 : 0, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    return res.json({ message: active ? 'Producto activado' : 'Producto inactivado' });
  } catch (error) {
    return res.status(500).json({ error: 'No se pudo actualizar el estado del producto' });
  }
};

const inactivateProduct = async (req, res) => setProductActive(req, res, false);
const activateProduct = async (req, res) => setProductActive(req, res, true);

module.exports = {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  inactivateProduct,
  activateProduct,
};
