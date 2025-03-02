import express from "express";
import { JSWValidator } from "../middlewares/jwt-validator.js";
import { isAdmin } from "../middlewares/is-admin.js";
import { getCalendarSettings, addDatesToCalendarSettings, removeDateFromCalendarSettings } from "../controllers/settings.js";
const settingsRouter = express.Router();

settingsRouter.get('/', getCalendarSettings);

settingsRouter.put('/wax', 
    [
        JSWValidator, isAdmin
    ],
    addDatesToCalendarSettings
);

settingsRouter.delete('/wax', 
    [
        JSWValidator, isAdmin
    ],
    removeDateFromCalendarSettings
);

export default settingsRouter;