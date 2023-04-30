-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "twoFactorSecret" BOOLEAN DEFAULT false,
    "twofa_secret" TEXT DEFAULT '',
    "avatar" TEXT DEFAULT '',
    "displayName" TEXT NOT NULL,
    "status" TEXT DEFAULT '',
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "ladderLevel" INTEGER NOT NULL DEFAULT 0,
    "achievements" TEXT[],

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "user1Id" INTEGER NOT NULL,
    "user2Id" INTEGER NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matches" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "gameType" TEXT NOT NULL,
    "winnerId" INTEGER NOT NULL,
    "loserId" INTEGER NOT NULL,

    CONSTRAINT "Matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_access_token_key" ON "Users"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "Users_displayName_key" ON "Users"("displayName");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
