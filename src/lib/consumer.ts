export async function handlePushEvent(ctx: any, event: any) {
    await ctx.db.notificationEvent.create({
        data: {
            ...event,
            occurredAt: new Date(),
        },
    });
}

export async function handleNewUser(ctx: any, event: any) {
    await ctx.db.emailContact.upsert({
        where: { email: event.email },
        create: { email: event.email, name: event.first_name + " " + event.last_name },
        update: { name: event.first_name + " " + event.last_name },
    });
}

export async function handleEmailEvent(ctx: any, event: any) {
    const { campaignId, recipient, timestamp } = event;

    await ctx.db.emailCampaignEvent.create({
        data: {
            campaignId,
            recipient,
            eventType: event.type,
            occurredAt: new Date(timestamp ?? Date.now()),
        },
    });
}

export const handlers: Record<string, (ctx: any, event: any) => Promise<any>> = {
    PUSH_EVENT: handlePushEvent,
    USER_REGISTERED: handleNewUser,
    EMAIL_EVENT: handleEmailEvent,
};

export function parseStreamResponse(events: any) {
    if (!events) return [];

    return events.flatMap(([stream, entries]: [string, any[]]) =>
        entries.map(([id, fields]) => {
            const data: Record<string, string> = {};
            for (let i = 0; i < fields.length; i += 2) {
                data[fields[i]] = fields[i + 1];
            }
            return { stream, id, data };
        })
    );
}
