import express from "express";
import {
    registerInstitucion,
    loginInstitucion,
    Reenvio,
} from "../controller/institucion.controller.js";
import { validateGlobal } from "../validators/ValidatorGolobal.js";
import { crearPlan } from "../controller/plan.controller.js";
import { TypeMidleware } from "../validators/propiedades.js";
import { resetPassword, verifyCodeCuenta } from "../NotificacionEmail/Notification.Reset.js";

const router = express.Router();

// ====================================
// RUTAS DE INSTITUCIONES
// =============================================

//Registro
router.post("/instituciones/register", validateGlobal(TypeMidleware[1].nombre), registerInstitucion);  // ✅ Ahora es /instituciones/register
router.post("/institucion/send-otp", verifyCodeCuenta)//verifica cuenta y activa
router.post("/institucion/Resent", Reenvio) //Reenvia code (n veces)
//Login Normal
router.post("/instituciones/login", loginInstitucion);

// Cambio final Password
router.post("/instituciones/ResetFinal", resetPassword)

//crear plan
router.post("/crearplan", validateGlobal(TypeMidleware[0].nombre), crearPlan);




export default router; 