import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { CreateEmailCampaignSchema } from "@/schemas/notification.schema";
import { z } from "zod";

export const emailRouter = createTRPCRouter({
    createDraftCampaign: protectedProcedure
        .input(z.object({
            subject: z.string().min(1),
            body: z.string().min(1),
            actionUrl: z.string().url().optional(),
            imageUrl: z.string().url().optional(),
            groupId: z.string().optional()
        }))
        .mutation(async ({ ctx, input }) => {
            const campaign = await ctx.db.emailCampaign.create({
                data: {
                    subject: input.subject,
                    body: input.body,
                    imageUrl: input.imageUrl,
                    data: { actionUrl: input.actionUrl },
                    status: "DRAFT",
                    groupId: input.groupId === "all" ? undefined : input.groupId
                }
            });

            return campaign;
        }),

    sendDraftCampaign: protectedProcedure
        .input(z.object({ 
            id: z.string(),
            recipients: z.array(z.string().email()).min(1)
        }))
        .mutation(async ({ ctx, input }) => {
            const { renderEmail, sendEmail } = await import("@/utils/email");
            
            const campaign = await ctx.db.emailCampaign.findUnique({
                where: { id: input.id }
            });
            
            if (!campaign || campaign.status !== "DRAFT") {
                throw new Error("Campaign not found or is not in draft status");
            }

            const baseUrl = (process.env.BASE_URL ?? (typeof window === "undefined" ? "" : window.location.origin)) || "";
            
            // Update campaign status
            await ctx.db.emailCampaign.update({
                where: { id: input.id },
                data: {
                    status: "PUBLISHED",
                    sentAt: new Date(),
                    sentCount: input.recipients.length
                }
            });

            // Send emails
            for (const to of input.recipients) {
                const originalAction = "/";
                const trackedAction = `${baseUrl}/api/email/track/click?c=${encodeURIComponent(campaign.id)}&r=${encodeURIComponent(to)}&u=${encodeURIComponent(originalAction)}`;
                
                let emailHtml = await renderEmail("marketing", {
                    title: campaign.subject,
                    message: campaign.body,
                    action_url: trackedAction,
                    image_url: campaign.imageUrl ?? "",
                });

                const pixel = `<img src="${baseUrl}/api/email/track/open?c=${encodeURIComponent(campaign.id)}&r=${encodeURIComponent(to)}" alt="" width="1" height="1" style="display:none" />`;
                emailHtml = emailHtml.replace("</body>", `${pixel}</body>`);

                await sendEmail({ to, subject: campaign.subject, html: emailHtml });
                await ctx.db.emailCampaignEvent.create({ 
                    data: { 
                        campaignId: campaign.id, 
                        recipient: to, 
                        eventType: "DELIVERED" 
                    } 
                });
            }

            return { message: "Campaign sent successfully" };
        }),

    getGroups: protectedProcedure.query(async ({ ctx }) => {
        const groups = await ctx.db.emailGroup.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                _count: {
                    select: {
                        members: true,
                    },
                },
            },
        });
        return groups;
    }),

    getRecipients: protectedProcedure
        .input(
            z.object({
                groupId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            if (input.groupId === "all") {
                const allEmails = await ctx.db.emailContact.findMany({
                    select: { email: true },
                });
                return { emails: allEmails.map((contact) => contact.email) };
            }

            const groupMembers = await ctx.db.emailGroupMember.findMany({
                where: { groupId: input.groupId },
                include: {
                    contact: {
                        select: { email: true },
                    },
                },
            });
            return { emails: groupMembers.map((member) => member.contact.email) };
        }),

    deleteContact: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Delete all memberships first
            await ctx.db.emailGroupMember.deleteMany({
                where: { contactId: input.id },
            });

            await ctx.db.emailContact.delete({
                where: { id: input.id },
            });

            return { message: "Contact deleted successfully" };
        }),

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
                where.OR = [{ email: { contains: input.search, mode: "insensitive" } }, { name: { contains: input.search, mode: "insensitive" } }];
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
            // const trackedAction = originalAction
            //     ? `${baseUrl}/api/email/track/click?c=${encodeURIComponent(campaign.id)}&r=${encodeURIComponent(to)}&u=${encodeURIComponent(
            //           originalAction
            //       )}`
            //     : "";
            const trackedAction = `${baseUrl}/api/email/track/click?c=${encodeURIComponent(campaign.id)}&r=${encodeURIComponent(to)}&u=${encodeURIComponent(
                originalAction
            )}`;
            console.log("trackedAction", trackedAction);
            let emailHtml = await renderEmail("marketing", {
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

    getCampaign: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        const campaign = await ctx.db.emailCampaign.findUnique({
            where: { id: input.id },
            include: {
                group: true,
                events: {
                    select: {
                        eventType: true,
                        recipient: true,
                        occurredAt: true,
                    },
                },
            },
        });
        return campaign;
    }),

    deleteCampaign: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        // Delete campaign events first
        await ctx.db.emailCampaignEvent.deleteMany({
            where: { campaignId: input.id },
        });
        await ctx.db.emailCampaign.delete({
            where: { id: input.id },
        });

        return { message: "Campaign deleted successfully" };
    }),

    duplicateCampaign: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        const campaign = await ctx.db.emailCampaign.findUnique({
            where: { id: input.id },
        });

        if (!campaign) {
            throw new Error("Campaign not found");
        }

        const duplicated = await ctx.db.emailCampaign.create({
            data: {
                subject: `${campaign.subject} (Copy)`,
                body: campaign.body,
                imageUrl: campaign.imageUrl,
                data: campaign.data ?? {},
                status: "DRAFT",
                groupId: campaign.groupId,
            },
        });

        return duplicated;
    }),

    updateCampaign: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                subject: z.string().min(1),
                body: z.string().min(1),
                actionUrl: z.string().url().optional(),
                imageUrl: z.string().url().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const campaign = await ctx.db.emailCampaign.update({
                where: { id: input.id },
                data: {
                    subject: input.subject,
                    body: input.body,
                    imageUrl: input.imageUrl,
                    data: { actionUrl: input.actionUrl },
                },
            });

            return campaign;
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
            const delivered = m.DELIVERED ?? 0;
            const opened = m.OPENED ?? 0;
            const clicked = m.CLICKED ?? 0;
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
