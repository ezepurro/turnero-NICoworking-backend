const { response } = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const registerUser = async ( req, res = response ) => {

    const { name, email, password } = req.body;

    try {
        // Verifico si existe un usuario con el mismo email en la db
        // Si no existe, instancio el modelo User creado
        // user = new User( req.body );
        // Encripto la contraseña

        // Y lo guardo en la db
        await prisma.user.create( req.body );
        
        // Genero el JWT

        // Retorno el estado y el token
        res.status(201).json({
            ok: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar el registro'
        });
    }
}

const loginUser = ( req, res = response ) => {
    res.json({
        ok: true,
        msg: 'loginUser'
    });
}

module.exports = {
    loginUser,
    registerUser
}