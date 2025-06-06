import { response } from "express";
import { addMinutes } from 'date-fns';
import { DateTime } from "luxon";
import { PrismaClient } from "@prisma/client";
import { findAvailableSlots, toMinutes } from "../helpers/appointmentHelpers.js";

const prisma = new PrismaClient();

export const getAppointments = async (req, res) => {
    try {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const appointments = await prisma.appointment.findMany({
            where: {
                date: {
                    gt: now
                },
                status: {
                    in: ["pending", "paid"]
                }
            }
        });
        res.json({
            ok: true,
            appointments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
};

export const getAppointmentsByService = async (req, res) => {
    try {
        const { type } = req.body;
        if (!type) {
            return res.status(400).json({
                ok: false,
                msg: 'El tipo de servicio es requerido'
            });
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const appointments = await prisma.appointment.findMany({
            where: {
                type: type,
                date: {
                    gt: now
                }
            }
        });

        res.json({
            ok: true,
            appointments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
};


export const createAppointment = async (req, res = response) => {
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

export const getUserAppointments = async (req, res = response) => {
    const userId = req.params.id;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }

        const appointments = await prisma.appointment.findMany({
            where: {
                clientId: userId,
                status: 'paid'
            }
        });

        const filteredAppointments = appointments.filter(app => {
            return !app.extraName && !app.extraContact && !app.extraData;
        });

        res.json({
            ok: true,
            appointments: filteredAppointments
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
};

export const updateAppointment = async (req, res = response) => {
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

export const deleteAppointment = async (req, res = response) => {
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

export const getAppointmentsNoPaidPagination = async (req, res = response) => {
    try {
        // ?page=1&limit=10
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const appointments = await prisma.appointment.findMany({
            where: {
                status: 'no-paid'
            },
            skip,
            take: limit,
        });

        const totalAppointments = await prisma.appointment.count({
            where: {
                status: 'no-paid'
            }
        });

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
}


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
                status: { in: ["paid", "pending"] },
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


export const createAppointmentByAdmin = async (req, res = response) => {
    const {
        userId,
        date,
        sessionLength,
        sessionZones,
        contact,
        type,
        status,
        extraName,
        extraContact,
        extraData,
    } = req.body;

    try {

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no encontrado",
            });
        }

        const appointment = await prisma.appointment.create({
            data: {
                client: { connect: { id: user.id } },
                date,
                sessionLength,
                sessionZones,
                contact,
                type,
                status,
                extraName,
                extraContact,
                extraData,
            },
        });

        res.json({
            ok: true,
            appointment,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "No se ha podido completar la petición",
        });
    }
};

export const getReservedAppointments = async (req, res) => {
    try {
        const { date, duration } = req.query;
        const baseDate = new Date(`${date}T03:00:00.000Z`);
        const newDate = baseDate.toISOString()

        if (!date || !duration) {

            return res.status(400).json({ msg: "Faltan parámetros (date y duration son requeridos)" });
        }

        const sessionLength = parseInt(duration);

        const dateConfig = await prisma.date.findFirst({
            where: { date: newDate },
            select: { date: true, startTime: true, endTime: true }
        });


        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);

        const appointments = await prisma.appointment.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: {
                    in: ["pending", "paid"]
                }
            },
            select: {
                date: true,
                sessionLength: true
            }
        });

        const occupied = new Set();

        for (const appointment of appointments) {
            let start = new Date(appointment.date);
            let end = addMinutes(start, appointment.sessionLength || sessionLength);

            while (start < end) {
                occupied.add(start.getHours() * 60 + start.getMinutes());
                start = addMinutes(start, 5);
            }
        }

        let openingMinutes = 12;
        let closingMinutes = 20;


        if (dateConfig && dateConfig.startTime && dateConfig.endTime) {
            const toMinutes = (isoString) => {
                const dateObj = new Date(isoString);
                return dateObj.getUTCHours() * 60 + dateObj.getUTCMinutes();
            };
            openingMinutes = toMinutes(dateConfig.startTime);
            closingMinutes = toMinutes(dateConfig.endTime);
        }

        const reservedTimes = [];

        for (let t = openingMinutes; t + sessionLength <= closingMinutes; t += 5) {
            let conflict = false;

            for (let i = 0; i < sessionLength; i += 5) {
                if (occupied.has(t + i)) {
                    conflict = true;
                    break;
                }
            }

            if (conflict) {
                for (let i = 0; i < sessionLength; i += 5) {
                    reservedTimes.push(t + i);
                }
            }
        }

        return res.json({
            reservedTimes,
            startTime: dateConfig.startTime,
            endTime: dateConfig.endTime
        });

    } catch (error) {
        console.error("Error obteniendo horarios ocupados:", error);
        return res.status(500).json({ msg: "Error interno del servidor" });
    }
};
