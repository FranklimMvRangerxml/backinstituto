dotenv.config();
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 4002;
// Montar rutas - CORREGIDO: consistencia en el path

// Ruta raíz
app.get("/dashboard", (req, res) => {
    res.json({
        message: "dashboard Service",
        version: "1.0.0",

    });
});

app.listen(PORT, () => {
    console.log(`✅ Auth Service running on port ${PORT}`);
    console.log("📋 Rutas montadas correctamente:");
    console.log(`   → GET /api/dashboard`);
});