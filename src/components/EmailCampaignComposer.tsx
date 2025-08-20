"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Campaign {
    id: string;
    subject: string;
    body: string;
    status: string;
    imageUrl?: string;
    data?: { actionUrl?: string };
    groupId?: string;
}

interface EmailCampaignComposerProps {
    initialData?: Campaign;
    onClose?: () => void;
}

const EmailCampaignComposer: React.FC<EmailCampaignComposerProps> = ({ initialData, onClose }) => {
    const utils = api.useUtils();
    const [subject, setSubject] = useState(initialData?.subject ?? "");
    const [body, setBody] = useState(initialData?.body ?? "");
    const [actionUrl, setActionUrl] = useState(initialData?.data?.actionUrl ?? "");
    const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
    const [selectedGroup, setSelectedGroup] = useState<string>(initialData?.groupId ?? "all");
    const [recipientsRaw, setRecipientsRaw] = useState("");
    const [isDraft, setIsDraft] = useState(false);
    
    const { data: groups } = api.email.getGroups.useQuery();
    const { data: recipients, refetch: refetchRecipients } = api.email.getRecipients.useQuery(
        { groupId: selectedGroup },
        { enabled: false }
    );

    const updateMutation = api.email.updateCampaign.useMutation({
        onSuccess: () => {
            toast.success("Campaign updated successfully");
            void utils.email.campaignsAnalytics.invalidate();
            onClose?.();
        },
        onError: () => toast.error("Failed to update campaign"),
    });

    const createDraftMutation = api.email.createDraftCampaign.useMutation({
        onSuccess: () => {
            toast.success("Draft campaign created");
            void utils.email.campaignsAnalytics.invalidate();
            onClose?.();
        },
        onError: () => toast.error("Failed to create draft campaign"),
    });

    const sendDraftMutation = api.email.sendDraftCampaign.useMutation({
        onSuccess: () => {
            toast.success("Draft campaign sent successfully");
            void utils.email.campaignsAnalytics.invalidate();
            onClose?.();
        },
        onError: () => toast.error("Failed to send draft campaign"),
    });

    useEffect(() => {
        if (selectedGroup) {
            refetchRecipients();
        }
    }, [selectedGroup, refetchRecipients]);

    const mutation = api.email.sendCampaign.useMutation({
        onSuccess: () => {
            toast.success("Email campaign sent");
            setSubject("");
            setBody("");
            setActionUrl("");
            setImageUrl("");
            setRecipientsRaw("");
            onClose?.();
        },
        onError: (e) => toast.error("Failed to send email campaign"),
    });

    useEffect(() => {
        if (recipients?.emails) {
            setRecipientsRaw(recipients.emails.join(", "));
        }
    }, [recipients]);

    const onSend = () => {
        const recipientList = recipients?.emails || recipientsRaw
            .split(/[\n,;\s]+/)
            .map((s) => s.trim())
            .filter(Boolean);

        if (!isDraft && recipientList.length === 0 && !initialData) {
            toast.error("Please select a group or add recipient emails");
            return;
        }

        if (initialData?.id) {
            if (initialData.status === "DRAFT" && !isDraft) {
                sendDraftMutation.mutate({
                    id: initialData.id,
                    recipients: recipientList
                });
            } else {
                updateMutation.mutate({
                    id: initialData.id,
                    subject,
                    body,
                    actionUrl: actionUrl || undefined,
                    imageUrl: imageUrl || undefined
                });
            }
        } else if (isDraft) {
            createDraftMutation.mutate({
                subject,
                body,
                actionUrl: actionUrl || undefined,
                imageUrl: imageUrl || undefined,
                groupId: selectedGroup === "all" ? undefined : selectedGroup
            });
        } else {
            mutation.mutate({
                subject,
                body,
                actionUrl: actionUrl || undefined,
                imageUrl: imageUrl || undefined,
                recipients: recipientList,
                groupId: selectedGroup === "all" ? undefined : selectedGroup
            });
        }
    };

    return (
        <Card className="py-4 h-full overflow-y-auto">
            <CardHeader>
                <CardTitle>Email Campaign</CardTitle>
                <CardDescription>Compose and send an email campaign to your customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
                <Textarea label="Body" rows={6} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Email body" />
                <Input label="Action URL (optional)" value={actionUrl} onChange={(e) => setActionUrl(e.target.value)} placeholder="https://..." />
                <Input label="Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
                
                {!initialData && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Group</label>
                            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a group" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Email Groups</SelectLabel>
                                        <SelectItem value="all">All Recipients</SelectItem>
                                        {groups?.map((group) => (
                                            <SelectItem key={group.id} value={group.id}>
                                                {group.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Recipients</label>
                            <Textarea
                                rows={4}
                                value={recipientsRaw}
                                onChange={(e) => setRecipientsRaw(e.target.value)}
                                placeholder="Recipients will be populated based on selected group, or enter emails manually"
                                disabled={selectedGroup !== "all"}
                            />
                            {recipients && (
                                <p className="text-sm text-muted-foreground">
                                    {recipients.emails.length} recipients in selected group
                                </p>
                            )}
                        </div>
                    </>
                )}

                {!initialData && (
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="draft-mode"
                            checked={isDraft}
                            onCheckedChange={setIsDraft}
                        />
                        <Label htmlFor="draft-mode">Save as draft</Label>
                    </div>
                )}

                <div className="flex justify-end space-x-2">
                    {initialData && (
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    )}
                    {initialData?.status === "DRAFT" ? (
                        <>
                            <Button 
                                onClick={onSend} 
                                isLoading={updateMutation.isPending}
                                disabled={updateMutation.isPending || !subject || !body}
                                variant="outline"
                            >
                                Save Draft
                            </Button>
                        </>
                    ) : (
                        <Button 
                            onClick={onSend} 
                            isLoading={initialData ? updateMutation.isPending : mutation.isPending}
                            disabled={initialData ? (updateMutation.isPending || !subject || !body) : (mutation.isPending || !subject || !body)}
                            variant="primary"
                        >
                            {initialData ? 'Save Changes' : (isDraft ? 'Save Draft' : 'Send Campaign')}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default EmailCampaignComposer;
