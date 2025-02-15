import express from "express";
const mpRouter = express.Router();
import { MercadoPagoConfig,Preference } from "mercadopago";
const client = new MercadoPagoConfig({
    accesToken: "",
})

mpRouter.post('/create_preference',async (req,res) => {
    try {
        const body = {
            items: [{
                zonesAmmount: req.body.zonesAmmount,
                duration: req.body.duration,
                schedule: req.body.schedule,
                unit_price: Number(req.body.price),
                currency_id : 'ARS'
            }],
            back_urls: {
                succes: 'https://www.youtube.com/@quieroserprogramador3781',
                failure: 'https://www.youtube.com/@quieroserprogramador3781',
                pending: 'https://www.youtube.com/@quieroserprogramador3781',
            },
            auto_return : 'approved',
        }
    const preference = new Preference(client)
    const result = await preference.create({ body })
    res.json({
        id:result.id,
    })
    }
    catch (error) {
        console.log(error)
    }
}) 
export default mpRouter