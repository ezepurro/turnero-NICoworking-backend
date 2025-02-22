const cron = require("node-cron");
const moment = require("moment");
const { PrismaClient } = require("@prisma/client");
const sendWhatsAppMessage = require("./whatsappService");

const prisma = new PrismaClient();

// Programa la tarea para ejecutarse todos los días a las 9 AM
cron.schedule("0 9 * * *", async () => {
    console.log("Ejecutando tarea de recordatorio...");

    const tomorrow = moment().add(1, "day").startOf("day").toDate();

    try {
        // Obtiene las citas programadas para mañana
        const appointments = await prisma.appointment.findMany({
            where: { date: tomorrow },
            include: { client: true }, // Para obtener los datos del cliente
        });

        for (const appointment of appointments) {
            const messageData = {
                name: appointment.client.name, 
                type: appointment.type,
                date: moment(appointment.date).format("DD/MM/YYYY"),
                time: moment(appointment.date).format("HH:mm"),
            };

            await sendWhatsAppMessage(appointment.contact, messageData);
        }

        console.log("Recordatorios enviados.");
    } catch (error) {
        console.error("Error en la tarea programada:", error);
    } finally {
        await prisma.$disconnect();
    }
});
