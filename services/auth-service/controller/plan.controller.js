import { PrismaClient } from "@prisma/client";
const prismaP = new PrismaClient();

//Crear
export const crearPlan = async (req, res) => {
    const { nombre, codigo, price, currency, interval } = req.body;
    let DataNew = {
        nombre: nombre,
        codigo: codigo,
        price: Number(price),
        currency: currency,
        interval: interval,
        maxDays: 15,
        estado: 'activo'
    }
    //Crear plan
    const envio = await prismaP.plan.create({ data: DataNew })
    res.json({
        message: "Usuario creado",
        envio
    });
}

//Ver
export const VerPlan = async (req, res) => {

}