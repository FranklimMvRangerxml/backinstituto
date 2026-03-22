// CORRECCIÓN 1: Importar prisma correctamente
// Opción A: Si prisma está en la raíz del proyecto
import { PrismaClient } from '@prisma/client';
import { loginUsuario, registerUsuario } from '../services_auth/auth.services.js';
const prisma = new PrismaClient();


// Servicios de autenticación
export const register = async (req, res) => {
    try {
        const { email, password, nombreCompleto } = req.body; // Añadí nombreCompleto

        // Validar datos requeridos
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email y password son requeridos'
            });
        }

        const user = await registerUsuario(email, password, nombreCompleto);
        res.status(201).json(user); // 201 = Created

    } catch (error) {
        console.error('Error en register:', error);
        res.status(500).json({
            error: error.message || 'Error al registrar usuario'
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar datos requeridos
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email y password son requeridos'
            });
        }

        const data = await loginUsuario(email, password);
        res.json(data);

    } catch (error) {
        console.error('Error en login:', error);
        res.status(401).json({
            error: error.message || 'Credenciales inválidas'
        });
    }
};

// Mostrar usuarios activos
export const getUsuariosActivos = async (req, res) => {
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

        res.json(usuarios);

    } catch (error) {
        console.error('Error en getUsuariosActivos:', error);
        res.status(500).json({
            error: error.message || 'Error al obtener usuarios'
        });
    }
};

// Desactivar usuario
export const disableUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: 'ID de usuario requerido'
            });
        }

        const usuario = await prisma.usuario.update({
            where: {
                id: Number(id)
            },
            data: {
                activo: "inactivo"
            }
        });

        res.json({
            message: 'Usuario desactivado correctamente',
            usuario
        });

    } catch (error) {
        console.error('Error en disableUsuario:', error);
        res.status(500).json({
            error: error.message || 'Error al desactivar usuario'
        });
    }
};

// Opcional: Método para activar usuario
export const activateUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await prisma.usuario.update({
            where: {
                id: Number(id)
            },
            data: {
                activo: "activo"
            }
        });

        res.json({
            message: 'Usuario activado correctamente',
            usuario
        });

    } catch (error) {
        console.error('Error en activateUsuario:', error);
        res.status(500).json({
            error: error.message || 'Error al activar usuario'
        });
    }
};