import NodeCache from "node-cache";
import bcrypt from "bcryptjs"; // ✅ CORRECTO
import jwt from "jsonwebtoken";
import { addEmailToQueue } from "./../NotificacionEmail/SendEmail.js";
import { PrismaClient } from "@prisma/client";
import { generateCode } from "../validators/CodeGenerate.js";
import { addEmailToQueue2 } from "../NotificacionEmail/SendEmail2.js";
export const cacheNEwUser = new NodeCache({ stdTTL: 900 });//15 minutos

const prisma = new PrismaClient();
//Registro OK
export const registerInstitucion = async (req, res) => {
    try {
        const {
            nombreInstitucion,
            tipo,
            telefonocorp,
            direccion,
            nombreAdministrador,
            email,
            password,
            celularadmin,
            pais
        } = req.body;

        const hash = await bcrypt.hash(password, 10);

        const DatosProcess = {
            email,
            passwordHash: hash,
            nombreInstitucion,
            telefono: telefonocorp,
            direccion,
            pais,
            tipo,
            nombreadmin: nombreAdministrador,
            celularadmin,
            rol: 'admin',
            suscripcion: 13, // si aplica
            activo: "inactive"
        };
        console.log(DatosProcess)
        // 1 Crear usuario en base de datos
        const institucion = await prisma.institucion.create({
            data: DatosProcess
        });


        //Guardar {email,code} y guardarlo en cache
        let code = generateCode();
        cacheNEwUser.set(email, { email, code });

        //Envio de email con code
        const Envio = await addEmailToQueue(email); // ✅ await

        res.json({ success: true, institucion, Envio });

    } catch (error) {
        console.error(error); // 👈 para ver el error real en consola
        res.status(500).json({ name: error.name, message: error.message });
    }
};
//Reenvio Code OK
export const Reenvio = async (req, res) => {
    try {
        const { email } = req.body;
        const { message } = await addEmailToQueue2(email);
        res.json({ success: true, message });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

//LOgin
export const loginInstitucion = async (req, res) => {
    const { email, password } = req.body;

    const institucion = await prisma.institucion.findFirst({
        where: {
            email,
            activo: "activo"
        }
    });

    if (!institucion) {
        return res.status(404).json({ message: "Institución no encontrada" });
    }

    const match = await bcrypt.compare(password, institucion.passwordHash);

    if (!match) {
        return res.status(401).json({ message: "Password incorrecto" });
    }

    const token1 = jwt.sign(
        {
            id: institucion.id, nombre: institucion.nombreInstitucion,
            email: institucion.email, code: "wpyurAbcdi"
        },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    );


    // insertar "werty" después del caracter 3
    const tokenModificado2 =
        token1.slice(0, 3) + "wpyurAbcdi" + token1.slice(3);

    res.json({
        data: {
            success: "OK",
            ProcessT: tokenModificado2,
            fecha: new Date(),
            status: "activo"
        }
    });
};

//Get instituciones
export const getInstituciones = async (req, res) => {

    const data = await prisma.institucion.findMany({
        where: {
            activo: "activo"
        }
    });

    res.json(data);
};

//Desactivar instituciones desactivar institución
export const disableInstitucion = async (req, res) => {

    const { id } = req.params;

    const data = await prisma.institucion.update({
        where: { id: Number(id) },
        data: {
            activo: "inactive"
        }
    });

    res.json(data);
};
/*const getFechaRegistro = () => {
    return new Date().toISOString(); // ✅ "2026-03-10T22:03:23.000Z"
};*/
