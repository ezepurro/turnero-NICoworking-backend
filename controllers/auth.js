const { response } = require('express');
const { PrismaClient } = require('@prisma/client');
const { generateJWT } = require('../helpers/jwt');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const registerUser = async ( req, res = response ) => {

    const { name, email, password, contact } = req.body;

    try {
        // Verifico si existe un usuario con el mismo email en la db
        const existingUser = await prisma.user.findUnique({ where: { email: email } });
        if ( existingUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese email'
            });
        }

        // Encripto la contraseña
        const salt = bcrypt.genSaltSync();
        const encryptedPassword = bcrypt.hashSync( password, salt );

        // Y lo guardo en la db
        const user = await prisma.user.create({ data: { name, email, password: encryptedPassword, contact } });

        // Genero el JWT
        const token = await generateJWT( user.id, user.name );

        // Retorno el estado y el token
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar el registro'
        });
    }
}

const loginUser = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {
        // Verifico si existe un usuario con el mail registrado
        const user = await prisma.user.findUnique({ where: { email: email } });
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'No se ha encontrado usuario con ese email registrado'
            })
        }

        // Confirmo si coinciden las contraseñas
        const validPassword = bcrypt.compareSync( password, user.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        // Genero el JWT
        const token = await generateJWT( user.id, user.name );

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar el inicio de sesión'
        });
    }
}

const getAllUsers = async ( req, res = response ) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se puede obtener los usuarios de la db'
        });
    }
}

const getUserById = ( req, res = response ) => {
    res.json({
        ok: true,
        msg: 'getUserById'
    });
}

const updateUserById = ( req, res = response ) => {
    res.json({
        ok: true,
        msg: 'updateUserById'
    });
}

const deleteUserById = ( req, res = response ) => {
    res.json({
        ok: true,
        msg: 'deleteUserById'
    });
}


const renewToken = async (req, res = response) => {
    const { uid, name } = req;
    const token = await generateJWT( uid, name );
    res.json({
        ok: true,
        token
    });
}

module.exports = {
    deleteUserById,
    getAllUsers,
    getUserById,
    loginUser,
    registerUser,
    renewToken,
    updateUserById
}