import cron from "node-cron";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// Programa la tarea para ejecutarse cada minuto
cron.schedule('* * * * *', async () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    try {
        await prisma.appointment.updateMany({
            where: {
                status: "pending",
                createdAt: { lt: tenMinutesAgo }
            },
            data: {
                status: "no-paid"
            }
        });
    } catch (error) {
        console.error("Error al actualizar turnos pendientes:", error);
    }
});