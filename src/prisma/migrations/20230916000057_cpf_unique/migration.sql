/*
  Warnings:

  - You are about to drop the column `address_city` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `address_complement` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `address_country` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `address_district` on the `UserProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf_cnpj]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "address_city",
DROP COLUMN "address_complement",
DROP COLUMN "address_country",
DROP COLUMN "address_district";

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_cpf_cnpj_key" ON "UserProfile"("cpf_cnpj");
