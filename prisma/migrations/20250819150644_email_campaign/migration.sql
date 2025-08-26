-- CreateTable
CREATE TABLE "public"."email_contacts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."email_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."email_group_members" (
    "id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."email_campaigns" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "imageUrl" TEXT,
    "data" JSONB,
    "status" "public"."notification_statuses" NOT NULL DEFAULT 'DRAFT',
    "sent_at" TIMESTAMP(3),
    "scheduled_at" TIMESTAMP(3),
    "group_id" TEXT,
    "sent_count" INTEGER NOT NULL DEFAULT 0,
    "failed_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "email_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."email_campaign_events" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "event_type" "public"."notification_event_types" NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_campaign_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_contacts_email_key" ON "public"."email_contacts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "email_groups_slug_key" ON "public"."email_groups"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "email_group_members_contact_id_group_id_key" ON "public"."email_group_members"("contact_id", "group_id");

-- CreateIndex
CREATE INDEX "email_campaign_events_campaign_id_event_type_idx" ON "public"."email_campaign_events"("campaign_id", "event_type");

-- AddForeignKey
ALTER TABLE "public"."email_group_members" ADD CONSTRAINT "email_group_members_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "public"."email_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."email_group_members" ADD CONSTRAINT "email_group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."email_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."email_campaigns" ADD CONSTRAINT "email_campaigns_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."email_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."email_campaign_events" ADD CONSTRAINT "email_campaign_events_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."email_campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
