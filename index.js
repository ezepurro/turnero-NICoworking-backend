const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Crear el servidor de express
const app = express();

// Cors
app.use(cors());

// Lecutra y parseo del body
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/settings', require('./routes/settings'));


// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});