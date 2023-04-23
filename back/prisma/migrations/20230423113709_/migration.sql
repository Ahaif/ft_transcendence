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

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_access_token_key" ON "Users"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "Users_displayName_key" ON "Users"("displayName");
