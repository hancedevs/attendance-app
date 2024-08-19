-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "attachmentId" INTEGER;

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "text" TEXT,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "Attachment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
