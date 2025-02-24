import dotenv from "dotenv";

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.DATABASE_URL, 
    SECRET_JWT_SEED: process.env.SECRET_JWT_SEED,
    CALENDARID: process.env.CALENDARID,
    MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER,
};

const requiredEnvVars = [
    "DATABASE_URL",
    "SECRET_JWT_SEED",
    "CALENDARID",
    "MP_ACCESS_TOKEN",
    "WHATSAPP_ACCESS_TOKEN",
    "WHATSAPP_NUMBER",
];

const missingVars = requiredEnvVars.filter((key) => !config[key]);

if (missingVars.length > 0) {
    throw new Error(
        `Faltan las siguientes variables de entorno: ${missingVars.join(", ")}. Verifica el archivo .env.`
    );
}

export default config;
