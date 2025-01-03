const express = require('express');
const router = express.Router();
const { getAppointments, createAppointment } = require('../controllers/appointments');


router.get('/', getAppointments);

// router.get('/users/:id', getUserAppointments);

router.post('/', createAppointment);

// router.put('/:id', updateAppointment);

// router.delete('/:id', deleteAppointment);

module.exports = router;