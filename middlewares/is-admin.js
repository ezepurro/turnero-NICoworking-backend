import { response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const isAdmin = async (req, res = response, next) => {
    
    const userId = req.uid; 

    if (!userId) {
        return res.status(400).json({
            ok: false,
            msg: 'Uid no proporcionado'
        });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user || !user.isAdmin) {
            return res.status(403).json({
                ok: false,
                msg: 'Acceso denegado, solo administradores pueden acceder a esta ruta'
            });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al verificar el rol de administrador'
        });
    }
};
