
import nodemailer from "nodemailer";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateCode } from "../validators/CodeGenerate.js";
import { cacheNEwUser } from "../controller/institucion.controller.js";

const prisma = new PrismaClient();

//Verificacion de cuenta y activacion
/*Solo Activa cuenta active
*/
export const verifyCodeCuenta = async (req, res) => {
    try {
        const { code, email } = req.body;

        // ✅ Obtener del cache
        const getCodeValida = cacheNEwUser.get(email);

        // ✅ Verificar que no haya expirado
        if (!getCodeValida) {
            return res.status(400).json({ message: "Código expirado" });
        }

        // ✅ Comparar el código que llega con el guardado en cache
        if (getCodeValida.code !== code) {
            return res.status(400).json({ message: "Código incorrecto" });
        }

        // ✅ Verificar que el email coincida (seguridad extra)
        if (getCodeValida.email !== email) {
            return res.status(400).json({ message: "Datos inválidos" });
        }

        // ✅ Eliminar del cache tras uso exitoso
        cacheNEwUser.del(email);

        // Actualizar en DB
        await prisma.institucion.update({
            where: { email },
            data: {
                codigoOTP: null,
                activo: "activo"
            }
        });

        res.json({ success: true, message: "Cuenta activada, código OK" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error del servidor" });
    }
};

//Reenvio debe Generar nueva Mente Los datos encache.
export const requestResetEnvio = async (req, res) => {
    try {

        const { email } = req.body;

        const usuario = await prisma.institucion.findUnique({
            where: { email }
        });

        if (!usuario) {
            return res.status(404).json({ message: "El correo no existe" });
        }

        // Generar código
        let code = generateCode();
        //nueva asignación
        cacheNEwUser.set(email, { email, code });


        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "f5extuniversal@gmail.com",
                pass: "smgcwgvfrlpyenjb"
            }
        });

        await transporter.sendMail({
            from: '"Soporte Plataforma" <f5extuniversal@gmail.com>',
            to: email,
            subject: "Código de recuperación",
            html: `
  <div style="background:#f4f6f8;padding:40px;font-family:Arial,Helvetica,sans-serif">
    
    <table align="center" width="500" style="background:white;border-radius:8px;padding:40px;text-align:center">
      
      <tr>
        <td>
          <h2 style="color:#333;margin-bottom:10px">
            Recuperación de contraseña
          </h2>

          <p style="color:#666;font-size:15px">
            Usa el siguiente código para restablecer tu contraseña
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding:30px 0">
          <div style="
            font-size:38px;
            font-weight:bold;
            letter-spacing:8px;
            background:#f1f5f9;
            padding:20px;
            border-radius:6px;
            color:#2563eb;
          ">
            ${code}
          </div>
        </td>
      </tr>

      <tr>
        <td>
          <p style="color:#555;font-size:14px">
            Este código expirará en <b>30 minutos.</b>.
          </p>

          <p style="color:#999;font-size:12px;margin-top:25px">
            Si no solicitaste este código puedes ignorar este correo.
          </p>
        </td>
      </tr>

    </table>

    <p style="text-align:center;color:#aaa;font-size:12px;margin-top:20px">
      © 2026 Plataforma - Todos los derechos reservados
    </p>

  </div>
  `
        });

        res.json({ message: "Código enviado al correo" });

    } catch (error) {

        console.log(error);
        res.status(500).json({ message: "Error del servidor" });

    }
};


//envian email => Se envia correo con code
//Ventana  que pide codigo => verificacion de code enviado y
//Se valida si es correcto y se guarda tabla en institucion
//Se
//Solo verifica code y email de usuario
export const verifyCode = async (req, res) => {
    try {

        const { code, email } = req.body;

        if (!req.cookies.reset_code) {
            return res.status(400).json({ message: "Código expirado" });
        }

        const hashedCode = crypto
            .createHash("sha256")
            .update(code)
            .digest("hex");

        if (hashedCode !== req.cookies.reset_code) {
            return res.status(400).json({ message: "Código incorrecto" });
        }
        //Si codigo valido se busca y se actualiza
        const updateCode = await prisma.institucion.update({
            where: {
                email: email
            },
            data: {
                codigoOTP: code
            }
        })

        res.json({ success: true, message: "Código válido", "data": updateCode });

    } catch (error) {

        res.status(500).json({ success: false, message: "Error del servidor" });

    }
};


//Cambio Password
export const resetPassword = async (req, res) => {
    try {
        const { code, email, newPassword } = req.body;

        const Codeval = cacheNEwUser.get(email);

        // ❌ no existe o expiró
        if (!Codeval) {
            return res.status(400).json({
                message: "Sesión inválida o expirada"
            });
        }

        // ✅ validar código correctamente
        if (Codeval.code !== code) {
            return res.status(400).json({
                message: "Código incorrecto"
            });
        }

        // 🔐 hash password
        const hash1Reset = await bcrypt.hash(newPassword, 10);

        // ✅ actualizar directamente por email
        await prisma.institucion.update({
            where: { email },
            data: {
                passwordHash: hash1Reset,
                codigoOTP: null
            }
        });

        // 🧹 eliminar cache (importante)
        cacheNEwUser.del(email);

        return res.json({
            success: true,
            message: "Contraseña actualizada correctamente"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error del servidor"
        });
    }
};

