"use client";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { EmailCampaign } from "@/schemas/notification.schema";

const statusColors = {
    sent: "bg-green-500/10 text-green-700 border-green-200",
    draft: "bg-gray-500/10 text-gray-700 border-gray-200",
    scheduled: "bg-blue-500/10 text-blue-700 border-blue-200",
};

const EmailCampaignDetails: React.FC<{ campaign: EmailCampaign }> = ({ campaign }) => {
    return (
        <div className="space-y-6 px-3 py-6">
            <div className="grid gap-4">
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                    <p className="mt-1">{campaign.subject}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Body</h3>
                    <p className="mt-1 whitespace-pre-wrap">{campaign.body}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Recipients</h3>
                        <p className="mt-1">{campaign.recipients}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                        <Badge variant="outline" className={statusColors[campaign.status.toLowerCase() as keyof typeof statusColors]}>
                            {campaign.status}
                        </Badge>
                    </div>
                    {/* <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Open Rate</h3>
                        <p className="mt-1">{campaign.openRate.toFixed(1)}%</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Click Rate</h3>
                        <p className="mt-1">{campaign.clickRate.toFixed(1)}%</p>
                    </div> */}
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Sent At</h3>
                        <p className="mt-1">{campaign.sentAt ? formatDate(campaign.sentAt) : "-"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailCampaignDetails;
