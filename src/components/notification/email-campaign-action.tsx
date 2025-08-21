"use client";

import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Files, Send } from "lucide-react";
import Overlay from "@/components/overlay";
import { useOverlayTriggerState } from "@react-stately/overlays";
import EmailCampaignComposer from "../EmailCampaignComposer";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import EmailCampaignDetails from "./email-campaign-details";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button as UIButton } from "@/components/ui/button";
import { useEffect, useState } from "react";

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
    const sendState = useOverlayTriggerState({});
    const [selectedGroupId, setSelectedGroupId] = useState<string>("all");

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
        onSuccess: (res) => {
            void utils.email.campaignsAnalytics.invalidate();
            toast.success("Draft campaign sent", {
                description: `Delivered: ${res?.delivered ?? 0}${res && "failed" in res ? `, Failed: ${res.failed}` : ""}`,
            });
            sendState.close();
        },
        onError: () => toast.error("Failed to send draft campaign"),
    });

    const groupsQuery = api.email.getGroups.useQuery();
    const recipientsQuery = api.email.getRecipients.useQuery({ groupId: selectedGroupId }, { enabled: false });

    useEffect(() => {
        if (sendState.isOpen) {
            void recipientsQuery.refetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendState.isOpen, selectedGroupId]);

    const handleDelete = async (campaign: Campaign) => {
        if (confirm("Are you sure you want to delete this campaign?")) {
            deleteMutation.mutate({ id: campaign.id });
        }
    };

    const handleDuplicate = async (campaign: Campaign) => {
        duplicateMutation.mutate({ id: campaign.id });
    };

    const handleSendDraft = async (campaign: Campaign) => {
        try {
            const { data } = await recipientsQuery.refetch();
            const recipients = data?.emails ?? [];
            if (!recipients.length) {
                toast.error("No recipients found for the selected option");
                return;
            }
            sendDraftMutation.mutate({ id: campaign.id, recipients });
        } catch (e) {
            toast.error("Failed to resolve recipients");
        }
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
                        sheetClassName="min-w-[40vw]"
                    >
                        <EmailCampaignComposer initialData={campaign} onClose={editState.close} />
                    </Overlay>
                    <Overlay
                        open={sendState.isOpen}
                        title={`Send ${campaign.subject}`}
                        trigger={
                            <Button size="iconOnly" variant="secondary">
                                <Send className="h-5 w-5" />
                            </Button>
                        }
                        onOpenChange={sendState.setOpen}
                        sheetClassName="min-w-[28rem]"
                        showHeader
                    >
                        <div className="p-4 space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Choose recipients</p>
                                <Select
                                    value={selectedGroupId}
                                    onValueChange={(val) => {
                                        setSelectedGroupId(val);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select recipients" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Contacts</SelectItem>
                                        {(groupsQuery.data ?? []).map((g) => (
                                            <SelectItem key={g.id} value={g.id}>
                                                {g.name} ({g._count?.members ?? 0})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                {recipientsQuery.isFetching ? (
                                    <p className="text-xs text-muted-foreground">Loading recipients…</p>
                                ) : (
                                    <>
                                        <p className="text-xs text-muted-foreground">
                                            Recipients: {(recipientsQuery.data?.emails?.length ?? 0)}
                                        </p>
                                        {(recipientsQuery.data?.emails?.length ?? 0) > 0 && (
                                            <div className="border rounded p-2 max-h-40 overflow-y-auto text-xs">
                                                {(recipientsQuery.data?.emails ?? []).slice(0, 100).map((email) => (
                                                    <div key={email} className="truncate">{email}</div>
                                                ))}
                                                {(recipientsQuery.data?.emails?.length ?? 0) > 100 && (
                                                    <div className="text-[10px] text-muted-foreground mt-1">Showing first 100…</div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <UIButton variant="outline" onClick={() => sendState.close()}>Cancel</UIButton>
                                <UIButton
                                    onClick={() => void handleSendDraft(campaign)}
                                    disabled={sendDraftMutation.isPending || recipientsQuery.isFetching || (recipientsQuery.data?.emails?.length ?? 0) === 0}
                                >
                                    {sendDraftMutation.isPending ? "Sending..." : "Send"}
                                </UIButton>
                            </div>
                        </div>
                    </Overlay>
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
