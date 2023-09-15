/*
  Warnings:

  - You are about to drop the column `currentOrganizationId` on the `Session` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_currentOrganizationId_fkey";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "currentOrganizationId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentOrganizationId" INTEGER;
