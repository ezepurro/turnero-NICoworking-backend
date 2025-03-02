import { response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkUserAccess = async (req, res = response, next) => {
    const userId = req.uid; 
    const requestedUserId = req.params.id; 

    if (!userId) {
        return res.status(400).json({
            ok: false,
            msg: 'Uid no proporcionado'
        });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }

        if (user.isAdmin || userId === requestedUserId) {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'Acceso denegado, no tienes permisos para acceder a esta información'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al verificar el acceso del usuario'
        });
    }
};