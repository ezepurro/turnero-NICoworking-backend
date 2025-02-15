import express from "express";
const authRouter = express.Router();
import { check } from "express-validator";

import { fieldValidator } from "../middlewares/field-validator.js";
import { JSWValidator } from "../middlewares/jwt-validator.js";
import { registerUser, loginUser, getAllUsers, getUserById, updateUserById, deleteUserById, renewToken } from "../controllers/auth.js";



authRouter.post('/register', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener al menos 7 caracteres').isLength({min: 7}),
        fieldValidator
    ], 
    registerUser
);

authRouter.post('/login', 
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener al menos 7 caracteres').isLength({min: 7}),
        fieldValidator
    ], 
    loginUser
);

authRouter.get('/users', getAllUsers);

authRouter.get('/users/:id', getUserById);

authRouter.put('/users/:id', updateUserById);

authRouter.delete('/users/:id', deleteUserById);

authRouter.get('/renew', JSWValidator, renewToken);

export default authRouter;