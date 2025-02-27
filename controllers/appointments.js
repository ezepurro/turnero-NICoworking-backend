import { response } from "express";
import { PrismaClient } from "@prisma/client";

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

// Para traer todas las fechas (incluidas las pasadas)
// export const getWaxAppointments = async ( req, res = response ) => {
//     try {
//         const waxAppointments = await prisma.appointment.findMany({ where: { type: 'Depilación' } });
//         res.json({
//             ok: true,
//             waxAppointments
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             ok: false,
//             msg: 'No se ha podido completar la petición'
//         });
//     }
// }

// Para traer solo las fechas futuras
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

        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                date: new Date(date),
                type
            },
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