import webpush from "web-push";
import { type PushSubscription } from "@prisma/client";
import { type Notify } from "@/schemas/notification.schema";

export const sendNotificationsToSubscribers = async (subscriptions: PushSubscription[], notification: Notify) => {
    const failedSubscriptions: any[] = [];
    const sentSubscriptions: any[] = [];

    webpush.setVapidDetails(`mailto:${process.env.ADMIN_EMAIL}`, process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);

    subscriptions.forEach((subscriber: PushSubscription) => {
        const subscription = {
            endpoint: subscriber.endpoint,
            keys: {
                p256dh: subscriber.p256dh,
                auth: subscriber.auth,
            },
        };

        const payload = JSON.stringify({
            title: notification.title,
            body: notification.body,
            path: notification.data?.actionUrl || "/collections",
            data: notification.data,
            imageUrl: notification.imageUrl,
            subscriberId: subscriber.id,
            notificationId: notification.id,
        });

        webpush
            .sendNotification(subscription, payload)
            .then(() => {
                sentSubscriptions.push(subscriber.id);
            })
            .catch((error: any) => {
                console.error("WebPush Error:", error);
                failedSubscriptions.push(subscriber.id);
            });
    });

    if (failedSubscriptions.length > 0) {
        console.log(`Failed to send notifications to: ${JSON.stringify(failedSubscriptions)}`);
    }

    return { sentSubscriptions, failedSubscriptions };
};
