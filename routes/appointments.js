const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { fieldValidator } = require('../middlewares/field-validator');
const { getAppointments, createAppointment, getUserAppointments, updateAppointment, deleteAppointment, getWaxAppointments } = require('../controllers/appointments');


router.get('/', getAppointments);

router.get('/waxing', getWaxAppointments);

router.get('/users/:id', getUserAppointments);

router.post('/', 
    [
        check('contact', 'La información de contacto es obligatoria').not().isEmpty(),
        check('date', 'La fecha es obligatoria').not().isEmpty(),
        fieldValidator
    ], 
    createAppointment
);

router.put('/:id', updateAppointment);

router.delete('/:id', deleteAppointment);

module.exports = router;