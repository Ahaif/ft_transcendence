/*
  Warnings:

  - You are about to drop the `_Mutes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Mutes" DROP CONSTRAINT "_Mutes_A_fkey";

-- DropForeignKey
ALTER TABLE "_Mutes" DROP CONSTRAINT "_Mutes_B_fkey";

-- DropTable
DROP TABLE "_Mutes";

-- CreateTable
CREATE TABLE "Mutes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,
    "muteEndTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mutes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mutes" ADD CONSTRAINT "Mutes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mutes" ADD CONSTRAINT "Mutes_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
