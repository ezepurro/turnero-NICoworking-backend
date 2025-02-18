import { response } from "express";
import { PrismaClient } from "@prisma/client";
import 'dotenv/config';

const prisma = new PrismaClient();

export const getCalendarSettings = async ( req, res = response ) => {
    try {
        const calendarSettings = await prisma.calendarSettings.findFirst();
        res.json({
            ok: true,
            calendarSettings
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
}

export const addDatesToCalendarSettings = async ( req, res = response ) => {
    const { newDates } = req.body;
    const id = process.env.CALENDARID;
    try {
        if (!id) {
            return res.status(500).json({
                ok: false,
                msg: "No se ha configurado el ID de calendario en las variables de entorno"
            });
        }

        // Obtengo las configuraciones del calendario
        const calendar = await prisma.calendarSettings.findUnique({
            where: { id },
        });
        if (!calendar) {
            return res.status(404).json({
                ok: false,
                msg: 'No se han encontrado las configuraciones del calendario'
            });
        }

        // Agrego las nuevas fechas
        const updatedDates = [...calendar.waxDays, ...newDates];

        const updatedCalendar = await prisma.calendarSettings.update({
            where: { id },
            data: {
                waxDays: updatedDates,
            },
        });

        res.json({
            ok: true,
            settings: updatedCalendar
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
}


export const removeDateFromCalendarSettings = async (req, res) => {
    const { date } = req.query;
    const calendarId = process.env.CALENDARID;

    try {
        if (!date) {
            return res.status(400).json({
                ok: false,
                msg: "Se requiere el parámetro 'date'"
            });
        }

        if (!calendarId) {
            return res.status(500).json({
                ok: false,
                msg: "No se ha configurado el ID de calendario en las variables de entorno"
            });
        }

        const decodedDate = decodeURIComponent(date);
        const parsedDate = new Date(decodedDate);

        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                ok: false,
                msg: "Formato de fecha inválido."
            });
        }

        // Buscar el calendario en la base de datos
        const calendar = await prisma.calendarSettings.findUnique({
            where: { id: calendarId }
        });

        if (!calendar) {
            return res.status(404).json({
                ok: false,
                msg: "No se encontraron configuraciones del calendario"
            });
        }

        const targetTimestamp = parsedDate.getTime();
        const updatedWaxDays = calendar.waxDays.filter(d => new Date(d).getTime() !== targetTimestamp);

        // Si la fecha no estaba en el array, devolver un error
        if (updatedWaxDays.length === calendar.waxDays.length) {
            return res.status(404).json({
                ok: false,
                msg: "Fecha no encontrada en waxDays"
            });
        }

        // Actualizar el documento con el nuevo array de fechas
        await prisma.calendarSettings.update({
            where: { id: calendarId },
            data: { waxDays: updatedWaxDays }
        });

        res.status(200).json({
            ok: true,
            msg: "Fecha deshabilitada correctamente"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "No se ha deshabilitar la fecha"
        });
    }
};



