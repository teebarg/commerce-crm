"use client";

import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Files } from "lucide-react";
import Overlay from "@/components/overlay";
import { useOverlayTriggerState } from "@react-stately/overlays";
import EmailCampaignComposer from "../EmailCampaignComposer";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import EmailCampaignDetails from "./email-campaign-details";
import { type EmailCampaign } from "@/schemas/notification.schema";
import SendDraftCampaign from "./send-draft-campaign";

const EmailCampaignAction: React.FC<{ campaign: EmailCampaign }> = ({ campaign }) => {
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

    const handleDelete = async (campaign: EmailCampaign) => {
        if (confirm("Are you sure you want to delete this campaign?")) {
            deleteMutation.mutate({ id: campaign.id });
        }
    };

    const handleDuplicate = async (campaign: EmailCampaign) => {
        duplicateMutation.mutate({ id: campaign.id });
    };

    return (
        <div className="flex items-center">
            <Overlay
                open={detailState.isOpen}
                title={`View ${campaign.subject}`}
                trigger={
                    <Button size="icon" variant="ghost">
                        <Eye className="h-5 w-5" />
                    </Button>
                }
                onOpenChange={detailState.setOpen}
            >
                <EmailCampaignDetails campaign={campaign} />
            </Overlay>
            <SendDraftCampaign campaign={campaign} />
            <Overlay
                open={editState.isOpen}
                title={`Edit ${campaign.subject}`}
                trigger={
                    <Button size="icon" variant="ghost">
                        <Edit className="h-5 w-5" />
                    </Button>
                }
                onOpenChange={editState.setOpen}
                sheetClassName="min-w-[40vw]"
            >
                <EmailCampaignComposer initialData={campaign} onClose={editState.close} />
            </Overlay>
            {campaign.status === "DRAFT" && (
                <>
                    <Overlay
                        open={editState.isOpen}
                        title={`Edit ${campaign.subject}`}
                        trigger={
                            <Button size="icon" variant="ghost">
                                <Edit className="h-5 w-5" />
                            </Button>
                        }
                        onOpenChange={editState.setOpen}
                        sheetClassName="min-w-[40vw]"
                    >
                        <EmailCampaignComposer initialData={campaign} onClose={editState.close} />
                    </Overlay>
                    <SendDraftCampaign campaign={campaign} />
                </>
            )}
            <Button size="icon" variant="ghost" onClick={() => handleDuplicate(campaign)}>
                <Files className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(campaign)}>
                <Trash2 className="h-5 w-5" />
            </Button>
        </div>
    );
};

export default EmailCampaignAction;
