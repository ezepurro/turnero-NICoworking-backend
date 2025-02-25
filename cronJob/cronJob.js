import "./cleanupExpiredAppointments.js";
import "./sendWhatsAppReminders.js";


process.on("SIGINT", async () => {
    console.log("Cerrando conexión con Prisma...");
    await prisma.$disconnect();
    process.exit(0);
});