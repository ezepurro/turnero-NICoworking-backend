const express = require('express');
require('dotenv').config();

// Crear el servidor de express
const app = express();

// Lecutra y parseo del body
app.use(express.json());

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});