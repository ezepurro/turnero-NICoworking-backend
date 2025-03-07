import { response } from "express";
import jwt from "jsonwebtoken";
import config from "../config.js";


export const JSWValidator = ( req, res = response, next ) => {
    
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la validación'
        });
    }

    try {
        const { uid, name, isAdmin } = jwt.verify(token.replace('Bearer ', ''), config.SECRET_JWT_SEED);
        req.uid = uid;
        req.name = name;
        req.isAdmin = isAdmin;
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    next();
}
