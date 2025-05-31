import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Se ejecuta todos los días a las 00:00
cron.schedule('0 0 * * *', async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const allDates = await prisma.date.findMany();

        const expiredIds = allDates
            .filter(({ date }) => {
                const parsedDate = new Date(date);
                parsedDate.setHours(0, 0, 0, 0);
                return parsedDate < today;
            })
            .map(d => d.id);

        if (expiredIds.length > 0) {
            await prisma.date.deleteMany({
                where: {
                    id: { in: expiredIds }
                }
            });
        }

        console.log(`Fechas pasadas eliminadas con éxito. Total: ${expiredIds.length}`);
    } catch (error) {
        console.error('Error al limpiar las fechas pasadas', error);
    }
});
