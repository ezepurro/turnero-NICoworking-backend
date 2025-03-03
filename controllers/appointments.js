import { response } from "express";
import { addMinutes } from 'date-fns'
import { PrismaClient } from "@prisma/client";
import { findAvailableSlots, toMinutes } from "../helpers/appointmentHelpers.js";

const prisma = new PrismaClient();

export const getAppointments = async ( req, res = response ) => {
    try {
        const appointments = await prisma.appointment.findMany();
        res.json({
            ok: true,
            appointments
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
}

export const createAppointment = async ( req, res = response ) => {
    const { userId, date, time, sessionLength, sessionZones, contact, type, status } = req.body;
    try {
        // Verifico que existe el usuario
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }

        // Almaceno en la db
        const appointment = await prisma.appointment.create({
            data: {
                clientId: userId,
                date,
                time,
                sessionLength,
                sessionZones,
                contact,
                type,
                status
            }
        });
        res.json({
            ok: true,
            appointment
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
}

export const getUserAppointments = async ( req, res = response ) => {
    const userId = req.params.id;
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }
        const appointments = await prisma.appointment.findMany({ where: { clientId: userId } });
        res.json({
            ok: true,
            appointments
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
}

export const updateAppointment = async ( req, res = response ) => {
    const id = req.params.id;
    const { userId, date, sessionLength, sessionZones, contact, type, status } = req.body;
    try {
        // Verifico que existe el usuario
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }

        // Verifico que existe la cita
        const appointment = await prisma.appointment.findUnique({ where: { id } });
        if (!appointment) {
            return res.status(404).json({
                ok: false,
                msg: 'Cita no encontrada',
            });
        }

        // Actualizo en la db
        const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: {
                clientId: userId,
                date,
                sessionLength,
                sessionZones,
                contact,
                type,
                status
            }
        });
        res.json({
            ok: true,
            updatedAppointment
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
}

export const deleteAppointment = async ( req, res = response ) => {
    const id = req.params.id;
    try {
        // Verifico que existe la cita
        const appointment = await prisma.appointment.findUnique({ where: { id } });
        if (!appointment) {
            return res.status(404).json({
                ok: false,
                msg: 'Cita no encontrada',
            });
        }

        // Elimino de la db
        await prisma.appointment.delete({ where: { id } });
        res.json({
            ok: true,
            msg: 'Cita eliminada'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
}


// Trae solo las fechas futuras
export const getWaxAppointments = async (req, res = response) => {
    try {
        const currentDate = new Date(); 
        const waxAppointments = await prisma.appointment.findMany({
            where: {
                type: 'Depilación',
                date: {
                    gt: currentDate 
                }
            }
        });
        res.json({
            ok: true,
            waxAppointments
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
};


export const getAppointmentsPagination = async (req, res = response) => {
    try {
        // ?page=1&limit=10
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;  

        const skip = (page - 1) * limit;  

        const appointments = await prisma.appointment.findMany({
            skip,
            take: limit,
        });

        const totalAppointments = await prisma.appointment.count();

        res.json({
            ok: true,
            appointments,
            totalPages: Math.ceil(totalAppointments / limit),
            currentPage: page,
            totalAppointments
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
};


export const checkAppointmentAvailability = async (req, res) => {
    try {
        const { date, type } = req.query;

        if (!date) {
            return res.status(400).json({ available: false, message: "Fecha no proporcionada" });
        }

        if (!type) {
            return res.status(400).json({ available: false, message: "Servicio no especificado" });
        }

        const appointmentDate = new Date(date);

        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                type,
                AND: [
                    { date: { gte: new Date(appointmentDate.setSeconds(0, 0)) } },
                    { date: { lt: new Date(appointmentDate.setSeconds(59, 999)) } }
                ]
            }
        });

        if (existingAppointment) {
            return res.json({ available: false });
        }

        res.json({ available: true });

    } catch (error) {
        console.error("Error verificando disponibilidad:", error);
        res.status(500).json({ available: false, message: "Error en el servidor" });
    }
};


export const getAvailableSlots = () => {
    async (req, res) => {
        try {
            const { date, sessionZones } = req.query;
    
            if (!date || !sessionZones) {
                return res.status(400).json({ error: 'Faltan parámetros' });
            }
    
            const selectedDate = new Date(date);
            const dateOnly = selectedDate.toISOString().split('T')[0];
            const durationPerZone = 5; 
            const sessionLength = parseInt(sessionZones) * durationPerZone;
    
            // Obtener turnos reservados en ese día
            const appointments = await prisma.appointment.findMany({
                where: {
                    date: {
                        gte: new Date(dateOnly + "T00:00:00.000Z"), 
                        lt: new Date(dateOnly + "T23:59:59.999Z")
                    }
                }
            });
    
            // Convertimos los turnos reservados a minutos desde medianoche
            const bookedSlots = appointments.map(app => ({
                start: toMinutes(app.date),
                end: toMinutes(app.date) + (app.sessionLength || 0)
            }));
    
            // Horario de atención (9:00 AM - 8:00 PM)
            const openingTime = 9 * 60; 
            const closingTime = 20 * 60;
    
            // Encontrar espacios disponibles
            const availableSlots = findAvailableSlots(openingTime, closingTime, bookedSlots, sessionLength);
    
            return res.json({ availableSlots });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    };
    
}


export const getReservedAppointments = async (req, res) => {
    try {
        const { date, duration } = req.query;
        if (!date || !duration) {
            return res.status(400).json({ msg: "Faltan parámetros (date y duration son requeridos)" });
        }

        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);

        const appointments = await prisma.appointment.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                }
            },
            select: {
                date: true,
                sessionLength: true,
            }
        });

        let reservedTimes = [];
        for (const appointment of appointments) {
            let startTime = new Date(appointment.date);
            let endTime = addMinutes(startTime, appointment.sessionLength || parseInt(duration));


            while (startTime < endTime) {
                reservedTimes.push(new Date(startTime)); 
                startTime = addMinutes(startTime, 5);
            }
        }

        return res.json({ reservedTimes });
    } catch (error) {
        console.error("Error obteniendo horarios ocupados:", error);
        return res.status(500).json({ msg: "Error interno del servidor" });
    }
};