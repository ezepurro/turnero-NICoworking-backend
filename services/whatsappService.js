import axios from "axios";
import config from "../config.js";

const WHATSAPP_API_URL = `https://graph.facebook.com/v21.0/${config.WHATSAPP_NUMBER}/messages`;
const ACCESS_TOKEN = config.WHATSAPP_ACCESS_TOKEN;

const sendWhatsAppMessage = async (template_name, phoneNumber, messageData) => {
    try {
        const response = await axios.post(
            WHATSAPP_API_URL,
            {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "template",
                template: {
                    name: template_name,
                    language: { code: "es_AR" },
                    components: [
                        {
                            type: "body",
                            parameters: [
                                { type: "text", text: messageData.name },  // {{1}} Nombre del cliente
                                { type: "text", text: messageData.type.toLocaleLowerCase() },  // {{2}} Tipo de servicio
                                { type: "text", text: messageData.date },  // {{3}} Fecha del turno
                                { type: "text", text: messageData.time }   // {{4}} Hora del turno
                            ]
                        }
                    ]
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        console.error(`Error al enviar mensaje a ${phoneNumber}:`, error.response ? error.response.data : error);
    }
};

export default sendWhatsAppMessage;
