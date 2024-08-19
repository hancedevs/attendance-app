-- CreateEnum
CREATE TYPE "StaffRequestStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED', 'CONSULTATION_REQURED');

-- CreateTable
CREATE TABLE "StaffRequest" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "title" VARCHAR(40),
    "content" TEXT,
    "status" "StaffRequestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "StaffRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StaffRequest" ADD CONSTRAINT "StaffRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
