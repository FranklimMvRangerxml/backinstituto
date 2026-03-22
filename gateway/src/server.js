import express from "express";
import proxy from "express-http-proxy";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 4000;

// =============================
// Middlewares globales
// =============================
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// =============================
// CONFIG DE SERVICIOS
// =============================
const services = {
    auth: {
        target: process.env.AUTH_SERVICE_URL || "http://localhost:4001",
        name: "auth-service",
    },
    dashboard: {
        target: process.env.DASHBOARD_SERVICE_URL || "http://localhost:4002",
        name: "dashboard-service",
    },
};

// =============================
// GATEWAY DINÁMICO (🔥 PRO)
// =============================
app.use("/:service", (req, res, next) => {
    const { service } = req.params;
    const serviceConfig = services[service];

    if (!serviceConfig) {
        return res.status(404).json({
            error: "Servicio no encontrado",
            service,
        });
    }

    console.log(
        `📡 [${serviceConfig.name}] ${req.method} ${req.originalUrl}`
    );

    return proxy(serviceConfig.target, {
        proxyReqPathResolver: (req) => {
            return req.originalUrl.replace(`/${service}`, "");
        },
        timeout: 15000,
        proxyErrorHandler: (err, res) => {
            console.error(
                `❌ Error en ${serviceConfig.name}:`,
                err.message
            );
            res.status(503).json({
                error: `${serviceConfig.name} no disponible`,
                service: serviceConfig.name,
            });
        },
    })(req, res, next);
});

// =============================
// HEALTH CHECK
// =============================
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        gateway: "API Gateway",
        port: PORT,
        uptime: process.uptime(),
        services,
    });
});

// =============================
// 404
// =============================
app.use((req, res) => {
    res.status(404).json({
        error: "Ruta no encontrada",
        path: req.originalUrl,
    });
});

// =============================
// START SERVER
// =============================
app.listen(PORT, () => {
    console.log("\n🚀 API Gateway corriendo");
    console.log(`http://localhost:${PORT}`);

    console.log("\nServicios conectados:");
    Object.keys(services).forEach((key) => {
        console.log(` /${key}`);
    });
    console.log("");
});