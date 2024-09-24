const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

// Lista de servidores
let servers = [
  { url: process.env.SERVER_1, connections: 0 },
  { url: process.env.SERVER_2, connections: 0 }
];

// Limpiar conexiones cada minuto
setInterval(() => {
  servers.forEach(server => {
    server.connections = 0;
  });
  console.log('Estadísticas de conexiones reseteadas');
}, 60000);

// Balanceo "Least Connected"
app.post('/countTokens', async (req, res) => {
  const text = req.body.text;

  let targetServer = servers.reduce((prev, curr) => {
    return prev.connections <= curr.connections ? prev : curr;
  });

  try {
    const response = await axios.post(`${targetServer.url}/countTokens`, { text });
    targetServer.connections += 1;
    res.status(200).json(response.data);
  } catch (error) {
    console.error(`Error conectando con el servidor ${targetServer.url}:`, error.message);
    
    // Si falla, intenta con el siguiente servidor
    const otherServer = servers.find(s => s !== targetServer);
    if (otherServer) {
      try {
        const response = await axios.post(`${otherServer.url}/countTokens`, { text });
        otherServer.connections += 1;
        res.status(200).json(response.data);
      } catch (err) {
        console.error('Ningún servidor respondió:', err.message);
        res.status(500).json({ message: 'Ningún servidor disponible' });
      }
    } else {
      res.status(500).json({ message: 'Error conectando con los servidores' });
    }
  }
});

const port = process.env.MIDDLEWARE_PORT || 8000;
app.listen(port, () => {
  console.log(`Middleware escuchando en el puerto ${port}`);
});
