import express from "express";
const mpRouter = express.Router();
import { MercadoPagoConfig,Preference } from "mercadopago";
const client = new MercadoPagoConfig({
    accessToken: "APP_USR-7654258103486190-021800-616d2c76c8b61ef54e881915561e4826-2273376235",
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
                success: 'https://www.youtube.com/@quieroserprogramador3781',
                failure: 'https://www.youtube.com/@quieroserprogramador3781',
                pending: 'https://www.youtube.com/@quieroserprogramador3781',
            },
            auto_return : 'approved',
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
export default mpRouter