-- CreateTable
CREATE TABLE "Channels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChannelAdmin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelMembership" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelAdmin_AB_unique" ON "_ChannelAdmin"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelAdmin_B_index" ON "_ChannelAdmin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelMembership_AB_unique" ON "_ChannelMembership"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelMembership_B_index" ON "_ChannelMembership"("B");

-- AddForeignKey
ALTER TABLE "Channels" ADD CONSTRAINT "Channels_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelAdmin" ADD CONSTRAINT "_ChannelAdmin_A_fkey" FOREIGN KEY ("A") REFERENCES "Channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelAdmin" ADD CONSTRAINT "_ChannelAdmin_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelMembership" ADD CONSTRAINT "_ChannelMembership_A_fkey" FOREIGN KEY ("A") REFERENCES "Channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelMembership" ADD CONSTRAINT "_ChannelMembership_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
