import express from 'express'
import { getDates, removeDate, addDate, changeDateTime } from "../controllers/date.js";
import { isAdmin } from "../middlewares/is-admin.js";
import { JSWValidator } from "../middlewares/jwt-validator.js";
const datesRouter = express.Router();



datesRouter.get('/', getDates);

datesRouter.post('/', 
    [
        JSWValidator, isAdmin
    ],
    addDate
);

datesRouter.put('/', 
    [
        JSWValidator, isAdmin
    ], 
    changeDateTime
)

datesRouter.delete('/', 
    [
        JSWValidator, isAdmin
    ],
    removeDate
);

export default datesRouter