import express from "express";
import { check } from "express-validator";
import { fieldValidator } from "../middlewares/field-validator.js";
import { JSWValidator } from "../middlewares/jwt-validator.js";
import { isAdmin } from "../middlewares/is-admin.js";
import { checkUserAccess } from "../middlewares/check-user-access.js";
import { registerUser, loginUser, logoutUser, getAllUsers, getUserById, updateUserById, deleteUserById, renewToken } from "../controllers/auth.js";
const authRouter = express.Router();


authRouter.post('/register', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email ingresado no es un email válido').isEmail(),
        check('password', 'La contraseña debe tener al menos 7 caracteres').isLength({min: 7}),
        fieldValidator
    ], 
    registerUser
);

authRouter.post('/login', 
    [
        check('email', 'El email ingresado no es un email válido').isEmail(),
        check('password', 'La contraseña debe tener al menos 7 caracteres').isLength({min: 7}),
        fieldValidator
    ], 
    loginUser
);

authRouter.post('/logout', logoutUser);

authRouter.get('/users', 
    [
        JSWValidator, isAdmin
    ], 
    getAllUsers
);

authRouter.get('/users/:id',
    [
        JSWValidator, checkUserAccess
    ], 
    getUserById
);

authRouter.put('/users/:id',
    [
        JSWValidator, isAdmin
    ],
    updateUserById
);

authRouter.delete('/users/:id', 
    [
        JSWValidator, isAdmin
    ], 
    deleteUserById
);

authRouter.get('/renew', JSWValidator, renewToken);

export default authRouter;