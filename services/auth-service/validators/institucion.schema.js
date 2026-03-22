import { z } from "zod";

export const institucionSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    nombreInstitucion: z.string().min(3),
    pais: z.string().optional(),
    ciudad: z.string().optional(),
});

//crear plan
export const PlanSchema = z.object({
    id: z.number().int().optional(),

    nombre: z
        .string()
        .min(1, "nombre obligatorio")
        .max(100),

    codigo: z
        .string()
        .min(1, "El código es obligatorio")
        .max(50),

    price: z
        .number()
        .positive("El precio debe ser mayor que 0"),

    currency: z
        .string()
        .length(3, "La moneda debe ser tipo ISO (USD, COP, EUR)"),

    interval: z.enum(["MENSUAL", "ANUAL"]),

    maxDays: z
        .number()
        .int()
        .positive(),

    estado: z.enum(["ACTIVO", "INACTIVO"])
});