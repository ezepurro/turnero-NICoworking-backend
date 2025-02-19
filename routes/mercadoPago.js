import express from "express";
import { MercadoPagoConfig, Preference } from "mercadopago";

const mpRouter = express.Router();

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

mpRouter.post('/create_preference', async ( req, res ) => {
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
                success: 'https://www.youtube.com/@quieroserprogramador3781',
                failure: 'https://www.youtube.com/@quieroserprogramador3781',
                pending: 'https://www.youtube.com/@quieroserprogramador3781',
            },
            auto_return : 'approved',
        }

        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({
            id:result.id,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
}) 

export default mpRouter;