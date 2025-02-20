import express from "express";
const mpRouter = express.Router();
import { MercadoPagoConfig,Preference } from "mercadopago";
const client = new MercadoPagoConfig({
    accessToken: "APP_USR-5555575217321704-021919-56ce7ed2e8ed41843ba517cb872f5193-2280252918",
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
            notification_url: 'https://2ac0-181-111-46-5.ngrok-free.app/api/mercadopago/webhook'
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
    console.log({payment})
})


export default mpRouter