require('dotenv').config();
const express = require('express');
const db = require('./config/db');

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Server and DB connection are working!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
