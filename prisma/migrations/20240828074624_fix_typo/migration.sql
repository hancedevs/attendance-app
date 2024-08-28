/*
  Warnings:

  - The values [CONSULTATION_REQURED] on the enum `StaffRequestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StaffRequestStatus_new" AS ENUM ('APPROVED', 'PENDING', 'REJECTED', 'CONSULTATION_REQUIRED');
ALTER TABLE "StaffRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "StaffRequest" ALTER COLUMN "status" TYPE "StaffRequestStatus_new" USING ("status"::text::"StaffRequestStatus_new");
ALTER TYPE "StaffRequestStatus" RENAME TO "StaffRequestStatus_old";
ALTER TYPE "StaffRequestStatus_new" RENAME TO "StaffRequestStatus";
DROP TYPE "StaffRequestStatus_old";
ALTER TABLE "StaffRequest" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
