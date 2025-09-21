const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Registro de usuario con nombre, correo y contraseña
function register(req, res) {
  const { nombre, correo, contraseña } = req.body;

  // Encriptamos la contraseña antes de guardarla
  const hashedPassword = bcrypt.hashSync(contraseña, 10);

  // Insertamos el nuevo usuario en la base de datos
  db.query(
    'INSERT INTO usuario (nombre, correo, contraseña) VALUES (?, ?, ?)',
    [nombre, correo, hashedPassword],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Usuario registrado exitosamente' });
    }
  );
}

// Login de usuario usando correo y contraseña
function login(req, res) {
  const { correo, contraseña } = req.body;

  // Buscamos el usuario por correo
  db.query(
    'SELECT * FROM usuario WHERE correo = ?',
    [correo],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(400).json({ message: 'Usuario no encontrado' });

      const user = results[0];

      // Comparamos la contraseña ingresada con la encriptada en la base de datos
      const validPassword = bcrypt.compareSync(contraseña, user.contraseña);
      if (!validPassword) return res.status(400).json({ message: 'Contraseña incorrecta' });

      // Generamos el token JWT con los datos del usuario
      const token = jwt.sign(
        { id: user.id, nombre: user.nombre, correo: user.correo },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token }); // Enviamos el token al frontend
    }
  );
}

// Middleware para verificar el token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  // Verificamos el token con la clave secreta
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user; // Guardamos los datos del usuario en la request
    next(); // Continuamos con la siguiente función
  });
}

module.exports = { register, login, verifyToken };
