import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import { PrismaClient } from '@prisma/client';

// Importar ÚNICO archivo de rutas que contiene TODO
import authRoutes from "./routes/auth.routes.js";

// Configurar dotenv
dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4001;
// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// =============================================
// ÚNICA RUTA - authRoutes lo contiene TODO
// =============================================
app.use("/auth", authRoutes);  // 👈 Este archivo tiene auth E instituciones

// Ruta de health check
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        service: "auth-service",
        port: 4001,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Ruta raíz
app.get("/", (req, res) => {
    res.json({
        message: "Auth Service",
        version: "1.0.0",
        endpoints: {
            auth: "/auth/* (contiene auth e instituciones)",
            health: "/health"
        }
    });
});

// =============================================
// MANEJADOR DE ERRORES
// =============================================
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message,
        service: 'auth-service'
    });
});

// =============================================
// INICIAR SERVIDOR
// =============================================
app.listen(PORT, () => {
    console.log("\n✅ Auth Service running on port 4001");
    console.log("📋 Archivo de rutas: ./routes/auth.routes.js (contiene TODO)");
    console.log("\n🔐 ENDPOINTS DISPONIBLES:");

    console.log("\n🚀 Servicio listo para usar en http://localhost:4001");
});

// =============================================
// MANEJO DE CIERRE GRACEFUL
// =============================================
process.on('SIGINT', async () => {
    console.log("\n👋 Cerrando Auth Service gracefulmente...");
    await prisma.$disconnect();
    console.log("✅ Prisma desconectado");
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log("\n👋 Cerrando Auth Service gracefulmente...");
    await prisma.$disconnect();
    console.log("✅ Prisma desconectado");
    process.exit(0);
});