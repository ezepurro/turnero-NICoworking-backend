import cron from "node-cron";
import config from "../config.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Programa la tarea para ejecutarse cada día a las 12AM
cron.schedule('0 0 * * *', async () => {
    try {
        const calendarSettings = await prisma.calendarSettings.findUnique({
            where: { id: config.CALENDARID },
        });

        if (!calendarSettings) {
            console.log('No se encontró la configuración del calendario');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); 
    
        const updatedWaxDays = calendarSettings.waxDays.filter(date => {
            const waxDate = new Date(date);
            waxDate.setHours(0, 0, 0, 0);
            return waxDate >= today;
        });

        await prisma.calendarSettings.update({
            where: { id: config.CALENDARID },
            data: { waxDays: updatedWaxDays },
        });

        console.log('Fechas pasadas eliminadas con éxito');
    } catch (error) {
        console.error('Error al limpiar waxDays:', error);
    }
});