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

const createAppointment = async ( req, res = response ) => {
    const { userId, date, time, sessionLength, sessionZones, contact } = req.body;
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
                contact
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

module.exports = {
    getAppointments,
    getUserAppointments,
    createAppointment
}