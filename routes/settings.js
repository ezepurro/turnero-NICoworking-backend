import express from "express";
const settingsRouter = express.Router();
import { getCalendarSettings, addDatesToCalendarSettings, removeDateFromCalendarSettings } from "../controllers/settings.js";

settingsRouter.get('/', getCalendarSettings);

settingsRouter.put('/wax', addDatesToCalendarSettings);

settingsRouter.delete('/wax', removeDateFromCalendarSettings);

export default settingsRouter;