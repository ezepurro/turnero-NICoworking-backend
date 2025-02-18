import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import appointmentRouter from './routes/appointments.js';
import authRouter from './routes/auth.js';
import settingsRouter from './routes/settings.js';
import mpRouter from './routes/mercadoPago.js';

// Crear el servidor de express
const app = express();


app.use(cors());

// Lecutra y parseo del body
app.use(express.json());


// Rutas

app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/mercadopago', mpRouter);

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});