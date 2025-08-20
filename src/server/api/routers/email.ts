import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { CreateEmailCampaignSchema } from "@/schemas/notification.schema";
import { z } from "zod";

export const emailRouter = createTRPCRouter({
    listContacts: protectedProcedure
        .input(
            z
                .object({
                    search: z.string().optional(),
                    page: z.number().int().min(1).default(1).optional(),
                    pageSize: z.number().int().min(1).max(100).default(20).optional(),
                    groupSlug: z.string().optional(),
                })
                .optional()
        )
        .query(async ({ input, ctx }) => {
            const page = input?.page ?? 1;
            const pageSize = input?.pageSize ?? 20;
            const where: any = {};
            if (input?.search) {
                where.OR = [
                    { email: { contains: input.search, mode: "insensitive" } },
                    { name: { contains: input.search, mode: "insensitive" } },
                ];
            }
            if (input?.groupSlug) {
                where.memberships = {
                    some: { group: { slug: input.groupSlug } },
                };
            }

            const [total, items] = await Promise.all([
                ctx.db.emailContact.count({ where }),
                ctx.db.emailContact.findMany({
                    where,
                    include: { memberships: { include: { group: true } } },
                    orderBy: { createdAt: "desc" },
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                }),
            ]);

            return { items, total, page, pageSize } as const;
        }),
    sendCampaign: protectedProcedure.input(CreateEmailCampaignSchema).mutation(async ({ input, ctx }) => {
        const { renderEmail, sendEmail } = await import("@/utils/email");

        let recipients: string[] = input.recipients ?? [];
        if (!recipients.length && input.groupSlug) {
            const group = await ctx.db.emailGroup.findUnique({
                where: { slug: input.groupSlug },
                include: { members: { include: { contact: true } } },
            });
            recipients = group?.members.map((m) => m.contact.email) ?? [];
        }
        if (!recipients.length) {
            const { popEmailsFromRedis } = await import("@/lib/redis");
            recipients = await popEmailsFromRedis(200);
        }
        if (!recipients.length) return { message: "No recipients found" } as const;

        const dbAny = ctx.db as any;
        const group = input.groupSlug ? await ctx.db.emailGroup.findUnique({ where: { slug: input.groupSlug } }) : null;
        const campaign = await dbAny.emailCampaign.create({
            data: {
                subject: input.subject,
                body: input.body,
                imageUrl: input.imageUrl,
                data: { actionUrl: input.actionUrl },
                status: "PUBLISHED",
                sentAt: new Date(),
                groupId: group?.id,
                sentCount: recipients.length,
            },
        });

        const baseUrl = (process.env.BASE_URL ?? (typeof window === "undefined" ? "" : window.location.origin)) || "";
        for (const to of recipients) {
            const originalAction = input.actionUrl ?? "";
            const trackedAction = originalAction
                ? `${baseUrl}/api/email/track/click?c=${encodeURIComponent(campaign.id)}&r=${encodeURIComponent(to)}&u=${encodeURIComponent(
                      originalAction
                  )}`
                : "";
            let emailHtml = await renderEmail("contact-us", {
                title: input.subject,
                message: input.body,
                action_url: trackedAction,
                image_url: input.imageUrl ?? "",
            });
            const pixel = `<img src="${baseUrl}/api/email/track/open?c=${encodeURIComponent(campaign.id)}&r=${encodeURIComponent(
                to
            )}" alt="" width="1" height="1" style="display:none" />`;
            emailHtml = emailHtml.replace("</body>", `${pixel}</body>`);

            await sendEmail({ to, subject: input.subject, html: emailHtml });
            await dbAny.emailCampaignEvent.create({ data: { campaignId: campaign.id, recipient: to, eventType: "DELIVERED" } });
        }
        return { message: "Email campaign sent" } as const;
    }),

    campaignsAnalytics: protectedProcedure.query(async ({ ctx }) => {
        const dbAny = ctx.db as any;
        const [totalCampaigns, totalSent, events] = await Promise.all([
            dbAny.emailCampaign.count(),
            dbAny.emailCampaign.aggregate({ _sum: { sentCount: true } }),
            dbAny.emailCampaignEvent.groupBy({ by: ["campaignId", "eventType"], _count: { _all: true } }),
        ]);
        const eventMap = new Map<string, Record<string, number>>();
        for (const e of events as any[]) {
            const m = eventMap.get(e.campaignId) ?? {};
            m[e.eventType] = (e._count._all as number) ?? 0;
            eventMap.set(e.campaignId, m);
        }
        const campaigns: any[] = await dbAny.emailCampaign.findMany({ orderBy: { createdAt: "desc" } });
        const analytics = campaigns.map((c: any) => {
            const m = eventMap.get(c.id) ?? {};
            const delivered = (m.DELIVERED ?? 0);
            const opened = (m.OPENED ?? 0);
            const clicked = (m.CLICKED ?? 0);
            const openRate = delivered > 0 ? (opened / delivered) * 100 : 0;
            const clickRate = delivered > 0 ? (clicked / delivered) * 100 : 0;
            return {
                id: c.id,
                subject: c.subject,
                body: c.body,
                status: c.status,
                recipients: c.sentCount,
                openRate,
                clickRate,
                sentAt: c.sentAt ?? null,
            };
        });
        const deliveredTotal = (events as any[])
            .filter((e: any) => e.eventType === "DELIVERED")
            .reduce((a: number, b: any) => a + (b._count._all as number), 0);
        const openedTotal = (events as any[])
            .filter((e: any) => e.eventType === "OPENED")
            .reduce((a: number, b: any) => a + (b._count._all as number), 0);
        const avgOpenRate = deliveredTotal > 0 ? (openedTotal / deliveredTotal) * 100 : 0;
        return { totalCampaigns, totalSent: totalSent._sum.sentCount ?? 0, avgOpenRate, campaigns: analytics };
    }),
});


