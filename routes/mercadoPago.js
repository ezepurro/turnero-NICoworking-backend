import express from "express";
import config from "../config.js";
import { MercadoPagoConfig, Preference } from "mercadopago";
import {  PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
const mpRouter = express.Router();

const client = new MercadoPagoConfig({
    accessToken: config.MP_ACCESS_TOKEN,
});

mpRouter.post('/create_preference', async (req, res) => {
    try {
        const { price, schedule, zonesAmmount, appointmentId } = req.body;
        const title = (zonesAmmount === 'Full-Body') ? 'Reserva de turno - Full-Body' : `Reserva de turno - ${zonesAmmount} zonas`;
        const body = {
            items: [{
                title: title,
                description: `Fecha: ${schedule}`,
                quantity: 1, 
                unit_price: Number(price), 
                currency_id: "ARS",
            }],
            back_urls: {
                success: `${config.FRONTEND_BASE_URL}/appointments`,
                failure: `${config.FRONTEND_BASE_URL}/`,
                pending: `${config.FRONTEND_BASE_URL}/`,
            },
            auto_return: 'approved',
            notification_url: config.NGROK_WEBHOOK_URL,
            external_reference: appointmentId

        };

        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({ id: result.id });
    }
    catch (error) {
        console.error("Error en Mercado Pago:", error);
        res.status(500).json({ error: error.message || "Error al procesar la solicitud" });
    }
});

mpRouter.post('/webhook', async (req, res) => {
    const payment = req.query;
    console.log(payment);
    const paymentId = req.query.id;

    try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${client.accessToken}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            if (data.status == 'approved') {
                const appointmentId = data.external_reference;
                console.log(data.external_reference);
                if (appointmentId) {
                    await prisma.appointment.update({
                        where: { id: appointmentId },
                        data: {
                            status: 'paid'
                        }
                    });
                }
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('Error:', error);
        res.sendStatus(500);
    }
});

export default mpRouter;
