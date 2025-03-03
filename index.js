import express from 'express';
import cors from 'cors';
import fs from 'fs'; 
import https from 'https';
import cookieParser from 'cookie-parser';
import config from "./config.js";
import appointmentRouter from './routes/appointments.js';
import authRouter from './routes/auth.js';
import settingsRouter from './routes/settings.js';
import mpRouter from './routes/mercadoPago.js';
import whatsappRouter from './routes/whatsapp.js';

// Crear el servidor de express
const app = express();

// Cors
app.use(cors({
    origin: config.FRONTEND_BASE_URL,
    credentials: true
}));

// Middleware para parsear cookies
app.use(cookieParser());

// Lecutra y parseo del body
app.use(express.json());

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/mercadopago', mpRouter);
app.use('/api/whatsapp', whatsappRouter);

// Leer los archivos del certificado y la clave privada
const options = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem')
};

// // Escuchar peticiones
// app.listen(process.env.PORT, async () => {
//     console.log(`Servidor corriendo en puerto ${config.PORT}`);
//     await import("./cronJob/cronJob.js");
// });

// Crear el servidor HTTPS
https.createServer(options, app).listen(config.PORT, async () => {
    console.log(`Servidor HTTPS corriendo en puerto ${config.PORT}`);
    await import("./cronJob/cronJob.js");
});