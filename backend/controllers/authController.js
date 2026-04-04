const { registerUser, loginUser } = require('../services/authService');
const User = require('../models/userModel');

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: 'Usuario registrado', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const data = await loginUser(req.body);
    res.json({ message: 'Login exitoso', ...data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const checkEmail = async (req, res) => {
  try {
    const email = String(req.query.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ error: 'email es obligatorio' });
    }

    const user = await User.findByEmail(email);
    return res.json({ exists: Boolean(user) });
  } catch {
    return res.status(500).json({ error: 'No se pudo validar el correo' });
  }
};

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.json({
      message: 'Acceso autorizado al endpoint protegido',
      user: {
        id: user.id,
        role_id: user.role_id,
        name: user.name,
        email: user.email,
        full_name: user.full_name || user.nombre,
        correo: user.correo || user.email,
      },
    });
  } catch {
    return res.status(500).json({ error: 'No se pudo cargar el perfil' });
  }
};

module.exports = { register, login, profile, checkEmail };
