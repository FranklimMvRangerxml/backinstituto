import express from "express";

export const router = express.Router();
//ingreso http://localhost:4002/dashboard/presento
// Ruta de prueba - CORREGIDA: 'Dashboard' en lugar de 'Dasboart'
router.get('/presento', (req, res) => {
    res.json({
        message: 'Bienvenido al Dashboard principal',

    });
});

