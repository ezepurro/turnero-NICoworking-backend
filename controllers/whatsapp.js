import sendWhatsAppMessage from "../services/whatsappService.js";
import { formatPhoneNumber } from "../helpers/formatPhoneNumber.js";

export const reScheduleMessage = async (req, res) => {
    try {
        const { phoneNumber, messageData } = req.body;
        await sendWhatsAppMessage("reagendacion_turno", formatPhoneNumber(phoneNumber), messageData);
        res.json({ok: true, message: "Mensaje de whatsapp enviado"});
    } catch (error) {
        console.error("Error al reprogramar mensaje de whatsapp:", error);
        res.status(500).json({ok: false, message: "Error al reprogramar mensaje de whatsapp"});
    }
}

