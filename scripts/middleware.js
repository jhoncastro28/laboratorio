const express = require('express');
const app = express();
app.use(express.json());

// Lista de servidores
let servers = [
  { url: process.env.SERVER_1, connections: 0, logs: [] },
  { url: process.env.SERVER_2, connections: 0, logs: [] }
];

// Ruta para registrar un nuevo servidor
app.post('/register', (req, res) => {
  const { url } = req.body;

  // Verificar si el servidor ya está registrado
  const serverExists = servers.find(server => server.url === url);
  if (serverExists) {
    return res.status(400).json({ message: 'El servidor ya está registrado' });
  }

  // Registrar nuevo servidor
  servers.push({ url, connections: 0, logs: [] });
  console.log(`Nuevo servidor registrado: ${url}`);
  res.status(200).json({ message: 'Servidor registrado exitosamente' });
});

// Ruta para monitorear servidores
app.get('/monitor', (req, res) => {
  res.json(servers.map(server => ({
    url: server.url,
    connections: server.connections,
    logs: server.logs
  })));
});

// Ruta para añadir logs a cada servidor
app.post('/log', (req, res) => {
  const { url, log } = req.body;
  const server = servers.find(s => s.url === url);
  if (server) {
    server.logs.push(log);
    res.status(200).json({ message: 'Log añadido' });
  } else {
    res.status(404).json({ message: 'Servidor no encontrado' });
  }
});

const port = process.env.MIDDLEWARE_PORT || 6000;
app.listen(port, () => {
  console.log(`Middleware escuchando en el puerto ${port}`);
});
