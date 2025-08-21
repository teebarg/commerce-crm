-- CreateTable
CREATE TABLE "shop_settings" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,
    "companyPhone" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "supportLink" TEXT NOT NULL,
    "unsubscribeLink" TEXT NOT NULL,
    "preferencesLink" TEXT NOT NULL,
    "socialLinks" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_settings_pkey" PRIMARY KEY ("id")
);
