/*
  Warnings:

  - You are about to drop the column `productId` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `days` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `day` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_industryId_fkey";

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "days",
ADD COLUMN     "day" "Day" NOT NULL;

-- DropTable
DROP TABLE "Product";
