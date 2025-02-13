const { response } = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAppointments = async ( req, res = response ) => {
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

const createAppointment = async (req, res = response) => {
    const { userId, date, sessionLength, sessionZones, contact, type } = req.body;

    try {
        // Verifico que existe el usuario
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }

        // Convertir la fecha a un objeto Date en JavaScript
        const horaInicio = new Date(date);
        const horaFin = new Date(horaInicio.getTime() + sessionLength * 60000); // Sumar minutos

        // Almaceno en la DB
        const appointment = await prisma.appointment.create({
            data: {
                clientId: userId,
                date: horaInicio,
                horaInicio,
                horaFin,
                sessionLength,
                sessionZones,
                contact,
                type
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
};


const getUserAppointments = async ( req, res = response ) => {
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

const updateAppointment = async ( req, res = response ) => {
    const id = req.params.id;
    const { userId, date, time, sessionLength, sessionZones, contact, type } = req.body;
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
                type
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

const deleteAppointment = async ( req, res = response ) => {
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

const getEmptySpaces = async (req, res) => {
    const { fecha, duracion } = req.query; 

    const turnos = await prisma.appointment.findMany({
        where: { date: new Date(fecha) },
        orderBy: { horaInicio: "asc" }
    });

    const horarioTrabajo = { inicio: "09:00", fin: "18:00" };
    let huecos = [];
    let horaActual = new Date(`${fecha}T${horarioTrabajo.inicio}:00`);

    for (let turno of turnos) {
        let inicioTurno = new Date(turno.horaInicio);
        let finTurno = new Date(turno.horaFin);

        // Si hay espacio entre el último turno registrado y el nuevo turno
        if (inicioTurno > horaActual) {
            let minutosDisponibles = (inicioTurno - horaActual) / 60000;
            if (minutosDisponibles >= duracion) {
                huecos.push({
                    horaInicio: horaActual.toTimeString().slice(0, 5),
                    horaFin: inicioTurno.toTimeString().slice(0, 5),
                    duracion: minutosDisponibles
                });
            }
        }

        // Actualizar la hora actual al final del turno
        horaActual = finTurno;
    }

    // Verificar si queda tiempo al final del día
    let finJornada = new Date(`${fecha}T${horarioTrabajo.fin}:00`);
    let minutosDisponibles = (finJornada - horaActual) / 60000;
    if (minutosDisponibles >= duracion) {
        huecos.push({
            horaInicio: horaActual.toTimeString().slice(0, 5),
            horaFin: finJornada.toTimeString().slice(0, 5),
            duracion: minutosDisponibles
        });
    }

    res.json({ huecos });
};


const getWaxAppointments = async ( req, res = response ) => {
    try {
        const waxAppointments = await prisma.appointment.findMany({ where: { type: 'Depilación' } });
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
}

module.exports = {
    getEmptySpaces,
    getAppointments,
    getWaxAppointments,
    getUserAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
}