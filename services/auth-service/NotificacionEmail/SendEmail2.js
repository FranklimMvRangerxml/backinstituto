import nodemailer from "nodemailer";
import { cacheNEwUser } from "../controller/institucion.controller.js";
import { generateCode } from "../validators/CodeGenerate.js";
import { PrismaClient } from "@prisma/client";
let queue2 = [];
let isProcessing = false;
const prisma = new PrismaClient();

export const addEmailToQueue2 = (email) => {
  return new Promise((resolve, reject) => {
    queue2.push({ email, resolve, reject });
    console.log(`[QUEUE] Correo añadido. Pendientes: ${queue2.length}`);
  });
};


setInterval(async () => {
  if (isProcessing || queue2.length === 0) return;

  isProcessing = true;
  const item = queue2.shift();
  const { email, resolve, reject } = item;

  // Guardar {email, code} en cache
  let code = generateCode();


  cacheNEwUser.set(email, { email, code });

  try {
    const getCode1 = cacheNEwUser.get(email);
    console.log("Codigo Reenviado es:", getCode1); // { email: '...', code: '...' }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "f5extuniversal@gmail.com",
        pass: "smgcwgvfrlpyenjb",
      },
    });

    await transporter.sendMail({
      from: '"Soporte Plataforma Idiomas" <f5extuniversal@gmail.com>',
      to: email,
      subject: "Código de Confirmacion",
      html: `
                <div style="background:#f4f6f8;padding:40px;font-family:Arial,Helvetica,sans-serif">
                  <table align="center" width="500" style="background:white;border-radius:8px;padding:40px;text-align:center">
                    <tr>
                      <td>
                        <h2 style="color:#333;margin-bottom:10px">Confirmacion de Cuenta.</h2>
                        <p style="color:#666;font-size:15px">Usa el siguiente código de Confirmación</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px 0">
                        <div style="font-size:38px;font-weight:bold;letter-spacing:8px;background:#f1f5f9;padding:20px;border-radius:6px;color:#2563eb;">
                          ${getCode1.code} 
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="color:#555;font-size:14px">Este código expirará en <b>5 minutos</b>.</p>
                        <p style="color:#999;font-size:12px;margin-top:25px">Si no solicitaste este código puedes ignorar este correo.</p>
                      </td>
                    </tr>
                  </table>
                  <p style="text-align:center;color:#aaa;font-size:12px;margin-top:20px">© 2026 Plataforma - Todos los derechos reservados</p>
                </div>
            `,
    });

    console.log(`[WORKER] Correo enviado a: ${email}`);
    resolve({ message: "Código enviado al correo" });

  } catch (error) {
    console.error(`[WORKER] Error enviando correo a ${email}:`, error.message);
    reject(error);
  } finally {
    isProcessing = false;
  }

}, 2000);