const express = require('express');
const router = express.Router();
const { register, login, verifyToken } = require('../middleware/auth');

// Ruta para registrar usuario
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta protegida que requiere token prueba
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: `Hola ${req.user.nombre}, accediste a una ruta protegida!` });
});

module.exports = router;
