const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const registerUser = async ({ name, email, password, role_id }) => {
  const existingUser = await User.findByEmail(email);
  if (existingUser) throw new Error('Usuario ya existe');

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await User.create(name, email, hashedPassword, role_id);

  return { id: userId, name, email, role_id };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findByEmail(email);
  if (!user) throw new Error('Usuario no encontrado');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Contraseña incorrecta');

  const token = jwt.sign(
    { id: user.id, role_id: user.role_id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, user };
};

module.exports = { registerUser, loginUser };