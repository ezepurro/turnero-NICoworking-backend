import express from "express";
const appointmentRouter = express.Router();
import { check } from "express-validator";
import { fieldValidator } from "../middlewares/field-validator.js";
import { getAppointments, createAppointment, getUserAppointments, updateAppointment, deleteAppointment, getWaxAppointments, getAppointmentsPagination, checkAppointmentAvailability } from "../controllers/appointments.js";


appointmentRouter.get('/', getAppointments);

appointmentRouter.get('/waxing', getWaxAppointments);

appointmentRouter.get('/users/:id', getUserAppointments);

appointmentRouter.post('/', 
    [
        check('contact', 'La información de contacto es obligatoria').not().isEmpty(),
        check('date', 'La fecha es obligatoria').not().isEmpty(),
        fieldValidator
    ], 
    createAppointment
);

appointmentRouter.put('/:id', updateAppointment);

appointmentRouter.delete('/:id', deleteAppointment);

appointmentRouter.get('/pagination', getAppointmentsPagination);

appointmentRouter.get('/check-availability', checkAppointmentAvailability);

export default appointmentRouter;