import express from "express";
const mpRouter = express.Router();
import { MercadoPagoConfig,Preference } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
})

mpRouter.post('/create_preference',async (req,res) => {
    try {
        const { price, schedule, duration, zonesAmmount } = req.body;
        const body = {
            items: [{
                title: `Reserva - ${zonesAmmount} zonas`,
                    description: `Duración: ${duration} minutos, Fecha: ${schedule}`,
                    quantity: 1, 
                    unit_price: Number(price), 
                    currency_id: "ARS",
            }],
            back_urls: {
                success: 'http://localhost:5173 ',
                failure: 'https://www.youtube.com/@quieroserprogramador3781',
                pending: 'https://www.youtube.com/@quieroserprogramador3781',
            },
            auto_return : 'approved',
            //Aca en la notification url utlizamos la url que nos provee Ngrok
            //Cuando hagamos el deploy colocamos la url en la que esta alojado nuestro backend
            notification_url: 'https://c8c3-181-111-46-5.ngrok-free.app/api/mercadopago/webhook'
        }
    const preference = new Preference(client)
    const result = await preference.create({ body })
    console.log(result.id)
    res.json({
        id:result.id,
    })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error al procesar la solicitud" })
    }
}) 
mpRouter.post('/webhook',async (req, res) => {
    const payment = req.query
    console.log(payment)
    const paymentId = req.query.id;

    try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${client.accessToken}`
            }
        });
        if (response.ok) {
            const data = await response.json()
            console.log(data)
        }
        res.sendStatus(200)
    }
    catch (error) {
        console.error('Error:', error);
        res.sendStatus(500)
    }
})

export default mpRouter;