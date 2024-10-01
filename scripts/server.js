const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();
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

  // Simular contar tokens (ejemplo básico)
  const text = req.body.text;
  const tokens = text.split(' ').filter(token => token.length > 0).length; // Evitar tokens vacíos

  try {
    // Enviar log al middleware
    await axios.post(`${middlewareUrl}/log`, { url: process.env.SERVER_URL, log });

    // Devolver el conteo de tokens
    res.json({ tokens });
  } catch (error) {
    console.error('Error al enviar el log al middleware:', error.message);
    res.status(500).json({ message: 'Error al enviar el log al middleware.' });
  }
});


const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Servidor frontend escuchando en el puerto ${port}`);
});
