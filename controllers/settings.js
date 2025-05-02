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

export const addDate = async ( req, res = response ) => {
    const { newDateAvailable} = req.body;
    try {

        const date = await prisma.date.findUnique({
            where: { date },
        });
        if (date) {
            return res.status(404).json({
                ok: false,
                msg: 'Esta fecha ya esta habilitada'
            });
        } else {
            date = await prisma.date.create({
                date: newDateAvailable.date,
                starTime: newDateAvailable.date,
                endTime: newDateAvailable.endTime
            })
        }
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
}


export const removeDate = async (req, res) => {
    const { dateToRemove } = req.query;

    try {
        if (!dateToRemove) {
            return res.status(400).json({
                ok: false,
                msg: "Se requiere el parámetro 'date'"
            });
        }
        const decodedDate = decodeURIComponent(dateToRemove);
        const parsedDate = new Date(decodedDate);

        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                ok: false,
                msg: "Formato de fecha inválido."
            });
        }

        // Buscar el calendario en la base de datos
        const date = await prisma.date.delete({
            where: { date: dateToRemove.date }
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



