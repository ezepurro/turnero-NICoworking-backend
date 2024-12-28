const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { registerUser, loginUser } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validator');


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

module.exports = router;