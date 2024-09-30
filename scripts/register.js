const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function registerServer(newServerUrl) {
  try {
    const response = await axios.post(`http://${process.env.MIDDLEWARE_IP}:${process.env.MIDDLEWARE_PORT}/register`, {
      url: newServerUrl
    });
    console.log('Servidor registrado exitosamente:', response.data);
  } catch (error) {
    console.error('Error al registrar el servidor:', error.message);
  }
}

const serverUrl = `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}`;
registerServer(serverUrl); // Al iniciar, el servidor se registra automáticamente
