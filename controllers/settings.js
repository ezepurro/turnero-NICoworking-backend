const { response } = require('express');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

const getCalendarSettings = async ( req, res = response ) => {
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

const addDatesToCalendarSettings = async ( req, res = response ) => {
    const { newDates } = req.body;
    const id = process.env.CALENDARID;
    try {
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

module.exports = {
    getCalendarSettings,
    addDatesToCalendarSettings
}