const { registerUser, loginUser } = require('../services/authService');

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

module.exports = { register, login };
