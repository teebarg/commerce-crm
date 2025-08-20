"use client";

import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Files, Send } from "lucide-react";
import Overlay from "@/components/overlay";
import { useOverlayTriggerState } from "@react-stately/overlays";
import EmailCampaignComposer from "../EmailCampaignComposer";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import EmailCampaignDetails from "./email-campaign-details";

interface Campaign {
    id: string;
    subject: string;
    body: string;
    status: string;
    recipients: number;
    openRate: number;
    clickRate: number;
    sentAt: Date | null;
    imageUrl?: string;
    data?: { actionUrl?: string };
}

const EmailCampaignAction: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
    const utils = api.useUtils();
    const detailState = useOverlayTriggerState({});
    const editState = useOverlayTriggerState({});

    const deleteMutation = api.email.deleteCampaign.useMutation({
        onSuccess: () => {
            void utils.email.campaignsAnalytics.invalidate();
            toast.success("Campaign deleted successfully");
        },
        onError: () => toast.error("Failed to delete campaign"),
    });

    const duplicateMutation = api.email.duplicateCampaign.useMutation({
        onSuccess: () => {
            void utils.email.campaignsAnalytics.invalidate();
            toast.success("Campaign duplicated successfully");
        },
        onError: () => toast.error("Failed to duplicate campaign"),
    });

    const sendDraftMutation = api.email.sendDraftCampaign.useMutation({
        onSuccess: () => {
            void utils.email.campaignsAnalytics.invalidate();
            toast.success("Draft campaign sent successfully");
        },
        onError: () => toast.error("Failed to send draft campaign"),
    });

    const handleDelete = async (campaign: Campaign) => {
        if (confirm("Are you sure you want to delete this campaign?")) {
            await deleteMutation.mutate({ id: campaign.id });
        }
    };

    const handleDuplicate = async (campaign: Campaign) => {
        await duplicateMutation.mutate({ id: campaign.id });
    };

    const handleSendDraft = async (campaign: Campaign) => {
        await sendDraftMutation.mutate({ id: campaign.id, recipients: [] });
    };

    return (
        <div className="flex items-center gap-2">
            <Overlay
                open={detailState.isOpen}
                title={`View ${campaign.subject}`}
                trigger={
                    <Button size="iconOnly">
                        <Eye className="h-5 w-5" />
                    </Button>
                }
                onOpenChange={detailState.setOpen}
            >
                <EmailCampaignDetails campaign={campaign} />
            </Overlay>
            {campaign.status === "DRAFT" && (
                <>
                    <Overlay
                        open={editState.isOpen}
                        title={`Edit ${campaign.subject}`}
                        trigger={
                            <Button size="iconOnly">
                                <Edit className="h-5 w-5" />
                            </Button>
                        }
                        onOpenChange={editState.setOpen}
                    >
                        <EmailCampaignComposer initialData={campaign} onClose={editState.close} />
                    </Overlay>
                    <Button size="iconOnly" variant="secondary" onClick={() => handleSendDraft(campaign)}>
                        <Send className="h-5 w-5" />
                    </Button>
                </>
            )}
            <Button size="iconOnly" onClick={() => handleDuplicate(campaign)}>
                <Files className="h-5 w-5" />
            </Button>
            <Button size="iconOnly" className="text-destructive" onClick={() => handleDelete(campaign)}>
                <Trash2 className="h-5 w-5" />
            </Button>
        </div>
    );
};

export default EmailCampaignAction;
