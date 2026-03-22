-- CreateEnum
CREATE TYPE "EstadoActivo" AS ENUM ('activo', 'inactive');

-- CreateEnum
CREATE TYPE "EstadoGeneral" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "IntervaloPlan" AS ENUM ('mensual', 'anual', 'trial');

-- CreateEnum
CREATE TYPE "EstadoSuscripcion" AS ENUM ('activo', 'cancelado', 'expirado');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('transferencia', 'stripe', 'paypal', 'manual');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('suscripcion', 'renovacion', 'upgrade');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('pendiente', 'verificando', 'exitoso', 'fallido');

-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('profesor', 'estudiante');

-- CreateEnum
CREATE TYPE "EstadoSesion" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "CategoriaCurso" AS ENUM ('curso1', 'curso2', 'curso3', 'curso4', 'curso5');

-- CreateEnum
CREATE TYPE "ModuloCurso" AS ENUM ('Princiante', 'Intermedio', 'Avanzado');

-- CreateEnum
CREATE TYPE "EstadoCurso" AS ENUM ('activo', 'finalizado', 'cancelado');

-- CreateEnum
CREATE TYPE "EstadoClase" AS ENUM ('programada', 'realizada', 'cancelada');

-- CreateEnum
CREATE TYPE "ClaseActual" AS ENUM ('clase_1', 'clase_2', 'clase_3', 'clase_4', 'clase_5', 'clase_6', 'clase_7', 'clase_8', 'clase_9', 'clase_10');

-- CreateEnum
CREATE TYPE "TipoMaterial" AS ENUM ('audio', 'video', 'excel', 'pdf', 'word', 'otro');

-- CreateEnum
CREATE TYPE "EstadoMaterial" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "EstadoMatricula" AS ENUM ('activo', 'finalizado', 'retirado');

-- CreateTable
CREATE TABLE "Institucion" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nombreInstitucion" TEXT NOT NULL,
    "nit" TEXT,
    "direccion" TEXT,
    "telefono" TEXT,
    "pais" TEXT,
    "ciudad" TEXT,
    "suscripcion" INTEGER,
    "codigoOTP" TEXT,
    "activo" "EstadoActivo" NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Institucion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "interval" "IntervaloPlan" NOT NULL,
    "maxDays" INTEGER,
    "createdAt" TIMESTAMP(3),
    "estado" "EstadoGeneral" NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "telefono" TEXT,
    "ciudad" TEXT,
    "rol" "RolUsuario" NOT NULL,
    "fechaNacimiento" TIMESTAMP(3),
    "nivelEducativo" TEXT,
    "institucionId" INTEGER NOT NULL,
    "codigoOTP" TEXT,
    "activo" "EstadoActivo" NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitucionPlan" (
    "id" SERIAL NOT NULL,
    "institucionId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoSuscripcion" NOT NULL,

    CONSTRAINT "InstitucionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "institucionId" INTEGER NOT NULL,
    "planId" INTEGER,
    "institucionPlanId" INTEGER,
    "monto" DECIMAL(65,30) NOT NULL,
    "currency" TEXT,
    "metodoPago" "MetodoPago" NOT NULL,
    "tipoPago" "TipoPago" NOT NULL,
    "estado" "EstadoPago" NOT NULL,
    "referenciaPago" TEXT NOT NULL,
    "banco" TEXT,
    "reciboFile" TEXT,
    "comprobanteUrl" TEXT,
    "fechaPago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaVerificacion" TIMESTAMP(3),

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "ip" TEXT,
    "usuarioId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "navegador" TEXT,
    "status" "EstadoSesion" NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "institucionId" INTEGER NOT NULL,
    "profesorId" INTEGER NOT NULL,
    "img" TEXT,
    "nombreCurso" TEXT NOT NULL,
    "categoria" "CategoriaCurso" NOT NULL,
    "modulo" "ModuloCurso" NOT NULL,
    "idioma" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoCurso" NOT NULL DEFAULT 'activo',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clase" (
    "id" SERIAL NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "estudianteId" INTEGER,
    "img" TEXT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaClase" TIMESTAMP(3) NOT NULL,
    "linkMeet" TEXT,
    "duracionMinutos" INTEGER NOT NULL DEFAULT 60,
    "claseActual" "ClaseActual" NOT NULL,
    "estadoClase" "EstadoClase" NOT NULL DEFAULT 'programada',

    CONSTRAINT "Clase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialEstudio" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT,
    "detalle" TEXT,
    "linkMaterial" TEXT,
    "tipo" "TipoMaterial" NOT NULL,
    "claseActual" "ClaseActual" NOT NULL,
    "claseMaterialId" INTEGER NOT NULL,
    "estadoMaterial" "EstadoMaterial" NOT NULL,

    CONSTRAINT "MaterialEstudio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluacion" (
    "id" SERIAL NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "codigoEvaluacion" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaLimite" TIMESTAMP(3),
    "porcentajeCurso" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Evaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pregunta" (
    "id" SERIAL NOT NULL,
    "evaluacionId" INTEGER NOT NULL,
    "pregunta" TEXT NOT NULL,
    "respuestaA" TEXT NOT NULL,
    "respuestaB" TEXT NOT NULL,
    "respuestaC" TEXT NOT NULL,
    "respuestaD" TEXT NOT NULL,
    "respuestaCorrecta" TEXT NOT NULL,
    "puntaje" DOUBLE PRECISION NOT NULL,
    "status" "EstadoGeneral" NOT NULL,

    CONSTRAINT "Pregunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resultado" (
    "id" SERIAL NOT NULL,
    "evaluacionId" INTEGER NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "respuestasJson" TEXT NOT NULL,
    "puntajeObtenido" DECIMAL(65,30) NOT NULL,
    "fechaRealizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resultado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matricula" (
    "id" SERIAL NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "fechaMatricula" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoMatricula" NOT NULL DEFAULT 'activo',

    CONSTRAINT "Matricula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reporte" (
    "id" SERIAL NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "fechaGeneracion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "promedioFinal" DECIMAL(65,30),
    "aprobado" BOOLEAN,
    "codigoCertificado" TEXT NOT NULL,
    "pdfUrl" TEXT,

    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Institucion_email_key" ON "Institucion"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Institucion_nit_key" ON "Institucion"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_referenciaPago_key" ON "Pago"("referenciaPago");

-- CreateIndex
CREATE UNIQUE INDEX "Resultado_evaluacionId_estudianteId_key" ON "Resultado"("evaluacionId", "estudianteId");

-- CreateIndex
CREATE UNIQUE INDEX "Matricula_cursoId_estudianteId_key" ON "Matricula"("cursoId", "estudianteId");

-- CreateIndex
CREATE UNIQUE INDEX "Reporte_codigoCertificado_key" ON "Reporte"("codigoCertificado");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_institucionId_fkey" FOREIGN KEY ("institucionId") REFERENCES "Institucion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitucionPlan" ADD CONSTRAINT "InstitucionPlan_institucionId_fkey" FOREIGN KEY ("institucionId") REFERENCES "Institucion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitucionPlan" ADD CONSTRAINT "InstitucionPlan_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_institucionId_fkey" FOREIGN KEY ("institucionId") REFERENCES "Institucion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_institucionPlanId_fkey" FOREIGN KEY ("institucionPlanId") REFERENCES "InstitucionPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_institucionId_fkey" FOREIGN KEY ("institucionId") REFERENCES "Institucion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clase" ADD CONSTRAINT "Clase_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialEstudio" ADD CONSTRAINT "MaterialEstudio_claseMaterialId_fkey" FOREIGN KEY ("claseMaterialId") REFERENCES "Clase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion" ADD CONSTRAINT "Evaluacion_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pregunta" ADD CONSTRAINT "Pregunta_evaluacionId_fkey" FOREIGN KEY ("evaluacionId") REFERENCES "Evaluacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resultado" ADD CONSTRAINT "Resultado_evaluacionId_fkey" FOREIGN KEY ("evaluacionId") REFERENCES "Evaluacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resultado" ADD CONSTRAINT "Resultado_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
