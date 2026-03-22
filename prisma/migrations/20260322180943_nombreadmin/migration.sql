-- DropIndex
DROP INDEX "Institucion_nit_key";

-- AlterTable
ALTER TABLE "Institucion" ADD COLUMN     "nombreadmin" TEXT,
ADD COLUMN     "rol" TEXT;
