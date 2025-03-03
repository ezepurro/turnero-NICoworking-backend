import express from "express";
import { reScheduleMessage } from "../controllers/whatsapp.js";
const whatsappRouter = express.Router();

whatsappRouter.post('/reschedule', reScheduleMessage);

export default whatsappRouter;
