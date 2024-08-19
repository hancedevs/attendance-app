/*
  Warnings:

  - The values [RECEPTION] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('MANAGEMENT', 'MARKETING', 'DEVELOPMENT', 'SALES', 'RND');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "StaffRequest" ADD COLUMN     "attachmentId" INTEGER;

-- AddForeignKey
ALTER TABLE "StaffRequest" ADD CONSTRAINT "StaffRequest_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "Attachment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
