const db = require('../config/db');

const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, description, price, image FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener los productos' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'name y price son obligatorios' });
    }

    const [result] = await db.query(
      'INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)',
      [name, description || '', Number(price), image || '']
    );

    res.status(201).json({
      id: result.insertId,
      name,
      description: description || '',
      price: Number(price),
      image: image || '',
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

module.exports = {
  getProducts,
  createProduct,
  deleteProduct,
};
