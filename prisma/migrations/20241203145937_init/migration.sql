/*
  Warnings:

  - You are about to drop the `ShippingOptions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `shippingOptionId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShippingOptions" DROP CONSTRAINT "ShippingOptions_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingOptionId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ShippingOptions";

-- CreateTable
CREATE TABLE "ShippingOption" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "ShippingOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingOptionId_fkey" FOREIGN KEY ("shippingOptionId") REFERENCES "ShippingOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
