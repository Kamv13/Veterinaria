require('dotenv').config(); 
const express = require('express');
const db = require('./config/db'); 

const app = express();
app.use(express.json()); 


app.use('/api/auth', require('./routes/authRoutes'));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
