import EmailCampaignComposer from "@/components/EmailCampaignComposer";
import EmailCampaignsAnalytics from "@/components/EmailCampaignsAnalytics";

export default function EmailCampaignPage() {
    return (
        <div className="space-y-6 px-4 py-2">
            <EmailCampaignsAnalytics />
            <EmailCampaignComposer />
        </div>
    );
}
