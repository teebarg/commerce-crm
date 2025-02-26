import webpush from "web-push";

export const sendNotificationsToSubscribers = (subscriptions: any[], notification: { title: any; body: any }) => {
    const failedSubscriptions: any[] = [];

    webpush.setVapidDetails(`mailto:${process.env.ADMIN_EMAIL}`, process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);

    subscriptions.forEach((subscriber: { endpoint: any; p256dh: any; auth: any; id: any }) => {
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
            path: "/collections",
        });

        webpush.sendNotification(subscription, payload).catch((error: any) => {
            console.error("WebPush Error:", error);
            failedSubscriptions.push(subscriber.id);
        });
    });

    if (failedSubscriptions.length > 0) {
        console.log(`Failed to send notifications to: ${JSON.stringify(failedSubscriptions)}`);
    }
};
