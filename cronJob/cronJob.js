import { PrismaClient } from "@prisma/client";
import "./cleanupExpiredAppointments.js";
import "./sendWhatsAppReminders.js";

const prisma = new PrismaClient();

process.on("SIGINT", async () => {
    console.log("Cerrando conexión con Prisma...");
    await prisma.$disconnect();
    process.exit(0);
});