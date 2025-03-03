import { response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateJWT } from "../helpers/jwt.js";

const prisma = new PrismaClient();

export const registerUser = async (req, res = response) => {
    const { name, email, password, contact } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ ok: false, msg: 'Ya existe un usuario con ese email' });
        }

        const salt = bcrypt.genSaltSync();
        const encryptedPassword = bcrypt.hashSync(password, salt);
        const user = await prisma.user.create({ data: { name, email, password: encryptedPassword, contact } });

        const token = await generateJWT(user.id, user.name, user.isAdmin);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,  
            sameSite: 'None', 
            maxAge: 60 * 60 * 1000 
        });

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'No se ha podido completar el registro' });
    }
};

export const loginUser = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ ok: false, msg: 'Usuario no encontrado' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ ok: false, msg: 'Contraseña incorrecta' });
        }

        const token = await generateJWT(user.id, user.name, user.isAdmin);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true, 
            sameSite: 'None', 
            maxAge: 60 * 60 * 1000
        });

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'No se ha podido completar el inicio de sesión' });
    }
};


export const logoutUser = (req, res = response) => {
    res.cookie('token', '', {
        httpOnly: true, 
        secure: true, 
        sameSite: 'None', 
        expires: new Date(0) 
    });
    res.json({ ok: true, msg: 'Sesión cerrada' });
};


export const getAllUsers = async ( req, res = response ) => {
    try {
        const users = await prisma.user.findMany();
        res.json({
            ok: true,
            users
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se puede obtener los usuarios de la db'
        });
    }
}

export const getUserById = async ( req, res = response ) => {
    const userId = req.params.id;
    try {
        const user = await prisma.user.findUnique({ where: { id: userId }, include: { appointments: true } });
        if ( !user ) {
            return res.status(404).json({
                ok: false,
                msg: 'No se ha encontrado el usuario'
            });
        } 
        res.status(200).json({
            ok: true,
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se puede obtener el usuario de la db'
        });
    }
}

export const updateUserById = async ( req, res = response ) => {
    const userId = req.params.id;
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if ( !user ) {
            return res.status(404).json({
                ok: false,
                msg: 'No se ha encontrado el usuario'
            });
        } 
        const updatedUser = await prisma.user.update({ where: { id: userId }, data: req.body });
        res.status(200).json({
            ok: true,
            updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido actualizar el usuario'
        });
    }
}

export const deleteUserById = async ( req, res = response ) => {
    const userId = req.params.id;
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if ( !user ) {
            return res.status(404).json({
                ok: false,
                msg: 'No se ha encontrado el usuario'
            });
        } 
        await prisma.user.delete({ where: { id: userId } });
        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido eliminar el usuario'
        });
    }
}


export const renewToken = async (req, res = response) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.uid } });

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }

        const token = await generateJWT(user.id, user.name, user.isAdmin);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 60 * 60 * 1000 // * 24
        });
        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo renovar el token'
        });
    }
};
