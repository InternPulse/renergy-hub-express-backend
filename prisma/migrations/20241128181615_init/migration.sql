/*
  Warnings:

  - You are about to drop the column `cartId` on the `OrderItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_cartId_fkey";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "cartId";
