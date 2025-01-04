const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { fieldValidator } = require('../middlewares/field-validator');
const { JSWValidator } = require('../middlewares/jwt-validator');
const { registerUser, loginUser, getAllUsers, getUserById, updateUserById, deleteUserById, renewToken } = require('../controllers/auth');



router.post('/register', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener al menos 7 caracteres').isLength({min: 7}),
        fieldValidator
    ], 
    registerUser
);

router.post('/login', 
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener al menos 7 caracteres').isLength({min: 7}),
        fieldValidator
    ], 
    loginUser
);

router.get('/users', getAllUsers);

router.get('/users/:id', getUserById);

router.put('/users/:id', updateUserById);

router.delete('/users/:id', deleteUserById);

router.get('/renew', JSWValidator, renewToken);

module.exports = router;