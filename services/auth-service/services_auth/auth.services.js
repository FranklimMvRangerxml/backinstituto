import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Registro usuario
export const registerUsuario = async (email, password, nombreCompleto, institucionId) => {
    try {
        const hash = await bcrypt.hash(password, 10);

        const usuario = await prisma.usuario.create({
            data: {
                email,
                passwordHash: hash,
                nombreCompleto,
                institucionId,
                rol: "estudiante",
                activo: "activo"
            }
        });

        return { datos: usuario, mensaje: "Creado correctamente" };
    } catch (error) {
        throw error;
    }
};

// Login usuario
export const loginUsuario = async (email, password) => {
    try {
        const usuario = await prisma.usuario.findFirst({
            where: {
                email,
                activo: "activo"
            }
        });

        if (!usuario) {
            throw new Error("Usuario no existe");
        }

        const match = await bcrypt.compare(password, usuario.passwordHash);

        if (!match) {
            throw new Error("Password incorrecto");
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                nombre: usuario.nombreCompleto,
                email: usuario.email,
                code: "wpyurAbcdi"
            },
            process.env.JWT_SECRET || 'secret-key',
            { expiresIn: "8h" }
        );

        // insertar "werty" después del caracter 3
        const tokenModificado = token.slice(0, 3) + "wpyurAbcdi" + token.slice(3);

        await prisma.session.create({
            data: {
                ProcessT: tokenModificado,
                fecha: new Date(),
                status: "activo"
            }
        });

        return { token };
    } catch (error) {
        throw error;
    }
};

// Obtener usuarios activos
export const getUsuariosActivos = async () => {
    try {
        const usuarios = await prisma.usuario.findMany({
            where: {
                activo: "activo"
            },
            select: {
                id: true,
                nombreCompleto: true,
                email: true,
                rol: true,
                fechaRegistro: true
            }
        });

        return usuarios;
    } catch (error) {
        throw error;
    }
};

// Desactivar usuario
export const disableUsuario = async (id) => {
    try {
        const usuario = await prisma.usuario.update({
            where: {
                id: Number(id)
            },
            data: {
                activo: "inactivo"
            }
        });

        return usuario;
    } catch (error) {
        throw error;
    }
};