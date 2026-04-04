const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, service: 'sweetspot-backend' });
});

app.get('/', (req, res) => {
  res.send('API SweetSpot funcionando 🚀');
});

module.exports = app;
