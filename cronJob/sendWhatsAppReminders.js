import cron from "node-cron";
import moment from "moment";
import { PrismaClient } from "@prisma/client";
import { formatPhoneNumber } from "../helpers/formatPhoneNumber.js";
import sendWhatsAppMessage from "../services/whatsappService.js";

const prisma = new PrismaClient();

// Programa la tarea para ejecutarse cada día a las 9AM
cron.schedule("0 9 * * *", async () => {
    try {
        const startOfTomorrow = moment().add(1, "day").startOf("day").toDate();
        const endOfTomorrow = moment().add(1, "day").endOf("day").toDate();

        const appointments = await prisma.appointment.findMany({
            where: { date: { gte: startOfTomorrow, lt: endOfTomorrow } },
            include: { client: true },
        });

        for (const appointment of appointments) {
            const messageData = {
                name: appointment.client.name,
                type: appointment.type,
                date: moment(appointment.date).format("DD/MM/YYYY"),
                time: moment(appointment.date).format("HH:mm"),
            };
            await sendWhatsAppMessage("recordatorio_turno", formatPhoneNumber(appointment.contact), messageData);
        }

        console.log("Recordatorios enviados");
    } catch (error) {
        console.error("Error en la tarea programada:", error);
    }
});
