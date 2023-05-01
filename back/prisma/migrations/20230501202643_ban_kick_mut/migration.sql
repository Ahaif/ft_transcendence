-- CreateTable
CREATE TABLE "_Kicks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Bans" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Mutes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Kicks_AB_unique" ON "_Kicks"("A", "B");

-- CreateIndex
CREATE INDEX "_Kicks_B_index" ON "_Kicks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Bans_AB_unique" ON "_Bans"("A", "B");

-- CreateIndex
CREATE INDEX "_Bans_B_index" ON "_Bans"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Mutes_AB_unique" ON "_Mutes"("A", "B");

-- CreateIndex
CREATE INDEX "_Mutes_B_index" ON "_Mutes"("B");

-- AddForeignKey
ALTER TABLE "_Kicks" ADD CONSTRAINT "_Kicks_A_fkey" FOREIGN KEY ("A") REFERENCES "Channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Kicks" ADD CONSTRAINT "_Kicks_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Bans" ADD CONSTRAINT "_Bans_A_fkey" FOREIGN KEY ("A") REFERENCES "Channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Bans" ADD CONSTRAINT "_Bans_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Mutes" ADD CONSTRAINT "_Mutes_A_fkey" FOREIGN KEY ("A") REFERENCES "Channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Mutes" ADD CONSTRAINT "_Mutes_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
