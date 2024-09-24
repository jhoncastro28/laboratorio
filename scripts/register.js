const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

let middlewareUrl = `http://${process.env.MIDDLEWARE_IP}:${process.env.MIDDLEWARE_PORT}`;

// Registrar nuevas instancias
app.post('/registerInstance', async (req, res) => {
  const newInstance = req.body.url;
  try {
    await axios.post(`${middlewareUrl}/addInstance`, { url: newInstance });
    res.status(200).json({ message: 'Instancia registrada' });
  } catch (error) {
    console.error('Error registrando la instancia:', error.message);
    res.status(500).json({ message: 'Error al registrar instancia' });
  }
});

const port = process.env.REGISTER_PORT || 7000;
app.listen(port, () => {
  console.log(`Servidor de registro escuchando en el puerto ${port}`);
});
