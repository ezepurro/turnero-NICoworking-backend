import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Crear un Business
    const business = await prisma.business.create({
      data: {
        name: "Estética Belleza Total",
        description: "Un salón de belleza con servicios premium",
        owner: {
          create: {
            name: "Test",
            email: "test@test.com",
            password: "jeremias",
            isAdmin: true,
          },
        },
      },
    });

    console.log("Business creado:", business);

    // Crear un Service vinculado al Business
    const service = await prisma.service.create({
      data: {
        name: "Depilación Láser",
        description: "Depilación definitiva con láser de última generación",
        duration: 60,
        price: 5000,
        businessId: business.id,
      },
    });

    console.log("Service creado:", service);

    // Crear un BusinessSettings vinculado al Business con disponibilidad específica
    const businessSettings = await prisma.businessSettings.create({
      data: {
        businessId: business.id,
        availableDays: ["Lunes", "Miércoles", "Viernes"],
        openingTime: "09:00",
        closingTime: "18:00",
        serviceAvailability: JSON.stringify([
          {
            serviceId: service.id,
            dates: ["2025-03-21T00:00:00.000Z", "2025-03-22T00:00:00.000Z"],
          },
        ]), 
      },
    });

    console.log("BusinessSettings creado:", businessSettings);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
