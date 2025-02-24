import express from 'express';
import cors from 'cors';
import config from "./config.js";
import appointmentRouter from './routes/appointments.js';
import authRouter from './routes/auth.js';
import settingsRouter from './routes/settings.js';
import mpRouter from './routes/mercadoPago.js';

// Crear el servidor de express
const app = express();

// Cors
app.use(cors());

// Lecutra y parseo del body
app.use(express.json());

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/mercadopago', mpRouter);

// Escuchar peticiones
app.listen(process.env.PORT, async () => {
    console.log(`Servidor corriendo en puerto ${config.PORT}`);
    await import("./cronJob/cronJob.js");
});