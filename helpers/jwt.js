import jwt from "jsonwebtoken";
import config from "../config.js";


export const generateJWT = ( uid, name, isAdmin ) => {
    return new Promise( (resolve, reject) => {
        const payload = { uid, name, isAdmin };
        jwt.sign( payload, config.SECRET_JWT_SEED, {
            expiresIn: '1h'
        }, (error, token) => {
            if( error ) {
                console.log(error);
                reject('No se pudo generar el token');
            }

            resolve(token);
        });
    });
}
