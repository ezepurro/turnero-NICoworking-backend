import express from "express";
import { JSWValidator } from "../middlewares/jwt-validator.js";
import { isAdmin } from "../middlewares/is-admin.js";
import { getDates, removeDate, addDate } from "../controllers/settings.js";
const settingsRouter = express.Router();

settingsRouter.get('/', getDates);

settingsRouter.put('/wax', 
    [
        JSWValidator, isAdmin
    ],
    addDate
);

settingsRouter.delete('/wax', 
    [
        JSWValidator, isAdmin
    ],
    removeDate
);

export default settingsRouter;