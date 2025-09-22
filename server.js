require('dotenv').config(); 
const express = require('express');
const db = require('./config/db'); 
const cors = require('cors');

const app = express();
app.use(express.json()); 
app.use(cors());


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/ventaRoutes'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
