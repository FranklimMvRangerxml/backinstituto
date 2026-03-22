/*
  Warnings:

  - Made the column `maxDays` on table `Plan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "maxDays" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Institucion" ADD CONSTRAINT "Institucion_suscripcion_fkey" FOREIGN KEY ("suscripcion") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
