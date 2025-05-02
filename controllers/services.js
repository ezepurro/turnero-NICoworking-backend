import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getServices = async (req, res) => {
    try {
        const services = await prisma.service.findMany();
        res.json({
            ok: true,
            services
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
};

export const addService = async (req, res) => {
    try {
        const { name, description, duration, price } = req.body;
        const newService = await prisma.service.create({
            data: { name, description, duration, price }
        });
        res.status(201).json({
            ok: true,
            service: newService
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al añadir servicio'
        });
    }
};

export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.appointment.deleteMany({
            where: {
                serviceId: id,
            },
        });
        
        await prisma.service.delete({ where: { id } });
        res.json({
            ok: true,
            msg: 'Servicio eliminado correctamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar servicio'
        });
    }
};

export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, duration, price } = req.body;
        const updatedService = await prisma.service.update({
            where: { id },
            data: { name, description, duration, price }
        });
        res.json({
            ok: true,
            service: updatedService
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar servicio'
        });
    }
};