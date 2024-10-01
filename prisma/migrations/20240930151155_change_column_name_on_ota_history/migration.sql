/*
  Warnings:

  - You are about to drop the column `node_id` on the `otahistory` table. All the data in the column will be lost.
  - Added the required column `gatewayId` to the `OTAHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `otahistory` DROP COLUMN `node_id`,
    ADD COLUMN `gatewayId` INTEGER NOT NULL;
