/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Channels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Channels_name_key" ON "Channels"("name");
