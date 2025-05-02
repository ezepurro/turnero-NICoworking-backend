import express from "express";
import { JSWValidator } from "../middlewares/jwt-validator.js";
import { isAdmin } from "../middlewares/is-admin.js";
import { getServices, addService, deleteService, updateService } from "../controllers/services.js";


const servicesRouter = express.Router();


servicesRouter.get('/', 
    [
        
    ], 
    getServices
);

servicesRouter.post('/add', 
    [
        JSWValidator, isAdmin
    ], 
    addService
);

servicesRouter.delete('/delete/:id', 
    [
        JSWValidator, isAdmin
    ], 
    deleteService
);

servicesRouter.put('/update/:id', 
    [
        JSWValidator, isAdmin
    ], 
    updateService
);


export default servicesRouter;