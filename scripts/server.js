const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const middlewareUrl = `http://${process.env.MIDDLEWARE_IP}:${process.env.MIDDLEWARE_PORT}`;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Contar los tokens
app.post('/countTokens', async (req, res) => {
    const text = req.body.text;
    
    try {
        const response = await axios.post(`${middlewareUrl}/countTokens`, { text });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error conectando con el middleware:', error.message);
        res.status(500).json({ message: 'Error conectando con el middleware' });
    }
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Servidor frontend escuchando en el puerto ${port}`);
});
