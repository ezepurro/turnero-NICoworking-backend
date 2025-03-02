import { response } from "express";
import jwt from "jsonwebtoken";
import config from "../config.js";


export const JSWValidator = ( req, res = response, next ) => {

    const token = req.cookies.token;

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la validación'
        });
    }

    try {
        const { uid, name } = jwt.verify( token, config.SECRET_JWT_SEED );
        req.uid = uid;
        req.name = name;
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    next();
}