import express from "express";
import { createPreference, webHook } from "../controllers/mercadoPago.js";
const mpRouter = express.Router();


mpRouter.post('/create_preference', createPreference);

mpRouter.post('/webhook', webHook);

export default mpRouter;
