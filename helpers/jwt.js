import jwt from "jsonwebtoken";
import config from "../config.js";


export const generateJWT = ( uid, name ) => {
    return new Promise( (resolve, reject) => {
        const payload = { uid, name };
        jwt.sign( payload, config.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (error, token) => {
            if( error ) {
                console.log(error);
                reject('No se pudo generar el token');
            }

            resolve(token);
        });
    });
}
