import express from "express";
import { MercadoPagoConfig, Preference } from "mercadopago";

const mpRouter = express.Router();

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

mpRouter.post('/create_preference', async (req, res) => {
    try {
        const { price, schedule, zonesAmmount } = req.body;
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
                success: 'http://localhost:5173',
                failure: 'https://www.youtube.com/@quieroserprogramador3781',
                pending: 'https://www.youtube.com/@quieroserprogramador3781',
            },
            auto_return: 'approved',
            notification_url: 'https://c8c3-181-111-46-5.ngrok-free.app/api/mercadopago/webhook'
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({ id: result.id });
    }
    catch (error) {
        res.status(500).json({ error: "Error al procesar la solicitud" });
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
            console.log(data);
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('Error:', error);
        res.sendStatus(500);
    }
});

export default mpRouter;
