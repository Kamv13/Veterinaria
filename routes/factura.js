const express = require("express");
const router = express.Router();
const db = require("../config/db");


const datosVeterinaria = {
  nombre: "Clinica Veterinaria San Martin",
  direccion: "Av. Central#123, Tegucigalpa",
  telefono: "9999-8888"
};

// Crear factura
router.post("/", async (req, res) => {
  try {
    const { cliente, productos } = req.body;

    if (!cliente || !cliente.nombre || !cliente.telefono) {
      return res.status(400).json({ error: "Datos del cliente incompletos" });
    }

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: "Debe enviar productos" });
    }

    let total = 0;
    productos.forEach(p => {
      total += p.precio * (p.cantidad || 1);
    });

    res.json({
      veterinaria: datosVeterinaria,
      cliente,
      productos,
      total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar la factura" });
  }
});

module.exports = router;
