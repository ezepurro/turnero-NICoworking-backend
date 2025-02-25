import cron from "node-cron";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// Programa la tarea para ejecutarse cada minuto
cron.schedule('* * * * *', async () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    try {
        const deletedAppointments = await prisma.appointment.deleteMany({
            where: {
                status: "pending",
                createdAt: { lt: tenMinutesAgo }
            }
        });
    } catch (error) {
        console.error("Error al eliminar turnos pendientes:", error);
    }
});