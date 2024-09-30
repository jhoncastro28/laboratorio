const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const middlewareUrl = `http://${process.env.MIDDLEWARE_IP}:${process.env.MIDDLEWARE_PORT}`;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

app.post('/countTokens', async (req, res) => {
    const log = {
      timestamp: new Date().toISOString(),
      method: 'POST',
      url: req.originalUrl,
      payload: req.body
    };
  
    // Enviar log al middleware
    await axios.post(`${middlewareUrl}/log`, { url: process.env.SERVER_URL, log });
  });
  
const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Servidor frontend escuchando en el puerto ${port}`);
});