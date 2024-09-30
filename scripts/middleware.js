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
  const axiosInstance = axios.create({
    timeout: 5000
  });

  const text = req.body.text;

  // Encontrar el servidor con menos conexiones
  let targetServer = servers.reduce((prev, curr) => {
    return prev.connections <= curr.connections ? prev : curr;
  });

  // Intentar con todos los servidores
  for (let i = 0; i < servers.length; i++) {
    try {
      const response = await axiosInstance.post(`${servers[i].url}/countTokens`, { text });
      servers[i].connections += 1;
      return res.status(200).json(response.data);
    } catch (error) {
      console.error(`Error conectando con el servidor ${servers[i].url}:`, error.message);
    }
  }

  res.status(500).json({ message: 'Ningún servidor disponible' });
});


// Para registrar un nuevo servidor
app.post('/register', (req, res) => {
  const { url } = req.body;

  const serverExists = servers.find(server => server.url === url);
  if (serverExists) {
    return res.status(400).json({ message: 'El servidor ya está registrado' });
  }

  servers.push({ url, connections: 0 });
  console.log(`Nuevo servidor registrado: ${url}`);
  res.status(200).json({ message: 'Servidor registrado exitosamente' });
});

const port = process.env.MIDDLEWARE_PORT || 8000;
app.listen(port, () => {
  console.log(`Middleware escuchando en el puerto ${port}`);
});
