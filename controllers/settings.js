import { response } from "express";
import { PrismaClient } from "@prisma/client";
import config from "../config.js";

const prisma = new PrismaClient();

export const getDates = async ( req, res = response ) => {
    try {
        const dates = await prisma.date.findFirst()
        res.json({
            ok: true,
            dates
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
}

export const addDate = async (req, res = response) => {
    const { newDateAvailable } = req.body;

    try {
        const existingDate = await prisma.date.findUnique({
            where: { date: newDateAvailable.date },
        });

        if (existingDate) {
            return res.status(404).json({
                ok: false,
                msg: 'Esta fecha ya está habilitada'
            });
        }

        const date = await prisma.date.create({
            data: {
                date: new Date(newDateAvailable.date),
                startTime: new Date(newDateAvailable.startTime),
                endTime: new Date(newDateAvailable.endTime)
            }
        });

        res.json({
            ok: true,
            date
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
};


export const changeDateTime = async (req, res) => {
    try {
        const { dateId, newStartTime, newEndTime } = req.body;

        if (!newStartTime && !newEndTime) {
            return res.json({
                msg: 'No existen modificaciones en el tiempo'
            });
        }

        const foundedDate = await prisma.date.findUnique({
            where: { id: dateId }
        });

        if (!foundedDate) {
            return res.status(404).json({
                ok: false,
                msg: 'No se ha encontrado la fecha a modificar'
            });
        }

        const updatedDate = await prisma.date.update({
            where: { id: dateId },
            data: {
                ...(newStartTime && { startTime: new Date(newStartTime) }),
                ...(newEndTime && { endTime: new Date(newEndTime) }),
            }
        });

        res.json({
            ok: true,
            msg: 'Fecha modificada con éxito',
            updatedDate
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
};



export const removeDate = async (req, res) => {
    const { dateId } = req.query;

    try {
        if (!dateId) {
            return res.status(400).json({
                ok: false,
                msg: "Se requiere el parámetro 'dateId' "
            });
        }

        const date = await prisma.date.delete({
            where: { id: dateId }
        });

        if (!date) {
            return res.status(404).json({
                ok: false,
                msg: "No se encontro la fecha deseada"
            });
        }

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



