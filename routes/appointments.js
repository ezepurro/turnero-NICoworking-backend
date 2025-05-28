import express from "express";
import { check } from "express-validator";
import { fieldValidator } from "../middlewares/field-validator.js";
import { JSWValidator } from "../middlewares/jwt-validator.js";
import { checkUserAccess } from "../middlewares/check-user-access.js";
import { isAdmin } from "../middlewares/is-admin.js";
import { createAppointmentByAdmin, getReservedAppointments, getAppointments, getAppointmentsByService, createAppointment, getUserAppointments, updateAppointment, deleteAppointment, getAppointmentsPagination, checkAppointmentAvailability, getAppointmentsNoPaidPagination } from "../controllers/appointments.js";
const appointmentRouter = express.Router();


appointmentRouter.get('/', 
    [
        JSWValidator, isAdmin
    ], 
    getAppointments
);

appointmentRouter.post('/service', 
    [
        JSWValidator, isAdmin
    ], 
    getAppointmentsByService
);


appointmentRouter.post('/admin', 
    [
        JSWValidator, isAdmin
    ], 
    createAppointmentByAdmin
);

appointmentRouter.get('/users/:id', 
    [
        JSWValidator, checkUserAccess
    ],
    getUserAppointments
);

appointmentRouter.post('/', 
    [
        check('contact', 'La información de contacto es obligatoria').not().isEmpty(),
        check('date', 'La fecha es obligatoria').not().isEmpty(),
        fieldValidator,
        JSWValidator
    ], 
    createAppointment
);
appointmentRouter.get('/reserved', getReservedAppointments)


appointmentRouter.put('/:id', 
    [
        JSWValidator, isAdmin
    ],  
    updateAppointment
);

appointmentRouter.delete('/:id', 
    [
        JSWValidator, isAdmin
    ],  
    deleteAppointment
);

appointmentRouter.get('/pagination', 
    [
        JSWValidator, isAdmin
    ],  
    getAppointmentsPagination
);

appointmentRouter.get('/no-paid/pagination', 
    [
        JSWValidator, isAdmin
    ],  
    getAppointmentsNoPaidPagination
);

appointmentRouter.get('/check-availability', checkAppointmentAvailability);

export default appointmentRouter;