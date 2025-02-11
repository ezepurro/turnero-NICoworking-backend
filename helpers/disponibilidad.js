const { response } = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


export const obtenerDisponibilidad = async (req, res = response) => {
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
    horaActual = new Date(turno.horaFin);
    }

    let finJornada = new Date(`${fecha}T${horarioTrabajo.fin}:00`);
    let minutosDisponibles = (finJornada - horaActual) / 60000;
    if (minutosDisponibles >= duracion) {
    huecos.push({
        horaInicio: horaActual.toTimeString().slice(0, 5),
        horaFin: finJornada.toTimeString().slice(0, 5),
        duracion: minutosDisponibles
    });
    }

    res.json(huecos);
};
