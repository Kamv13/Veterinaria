const express = require('express');
const router = express.Router();
const { registrarVenta,obtenerVentas, obtenerProductos , obtenerDetalleVenta, obtenerClientes} = require('../middleware/ventas');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para gestionar ventas
router.post('/venta',authMiddleware, registrarVenta);
router.get('/productos',authMiddleware, obtenerProductos);
router.get('/ventas',authMiddleware, obtenerVentas);
router.get('/detalle-by-venta/:id',authMiddleware, obtenerDetalleVenta);
router.get('/clientes',authMiddleware, obtenerClientes);

module.exports = router;
