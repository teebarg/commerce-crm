import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Activity {
    id: string;
    type: "notification_sent" | "subscriber_added" | "subscriber_removed";
    title: string;
    description: string;
    timestamp: Date;
    status: "success" | "failed" | "pending";
}

const mockActivities: Activity[] = [
    {
        id: "1",
        type: "notification_sent",
        title: "Flash Sale Alert",
        description: "Sent to 2,450 subscribers",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        status: "success",
    },
    {
        id: "2",
        type: "subscriber_added",
        title: "New Subscriber",
        description: "john.doe@example.com joined",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: "success",
    },
    {
        id: "3",
        type: "notification_sent",
        title: "Weekly Newsletter",
        description: "Sent to 2,430 subscribers",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        status: "success",
    },
    {
        id: "4",
        type: "subscriber_removed",
        title: "Subscriber Unsubscribed",
        description: "jane.smith@example.com left",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        status: "success",
    },
];

export function RecentActivity() {
    const getStatusVariant = (status: Activity["status"]) => {
        switch (status) {
            case "success":
                return "default";
            case "failed":
                return "destructive";
            case "pending":
                return "secondary";
            default:
                return "secondary";
        }
    };

    const getTypeIcon = (type: Activity["type"]) => {
        switch (type) {
            case "notification_sent":
                return "📨";
            case "subscriber_added":
                return "➕";
            case "subscriber_removed":
                return "➖";
            default:
                return "📋";
        }
    };

    return (
        <Card className="shadow-soft">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {mockActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
                        <div className="text-lg">{getTypeIcon(activity.type)}</div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className="font-medium text-sm truncate">{activity.title}</h4>
                                <Badge variant={getStatusVariant(activity.status)} className="text-xs">
                                    {activity.status}
                                </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground">{activity.description}</p>

                            <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
