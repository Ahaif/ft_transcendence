/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Channels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Channels_id_key" ON "Channels"("id");
