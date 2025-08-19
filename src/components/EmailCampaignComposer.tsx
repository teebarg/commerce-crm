"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const EmailCampaignComposer: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [actionUrl, setActionUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [recipientsRaw, setRecipientsRaw] = useState("");

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
        onError: (e) => toast.error(String(e)),
    });

    const onSend = () => {
        const recipients = recipientsRaw
            .split(/[\n,;\s]+/)
            .map((s) => s.trim())
            .filter(Boolean);
        if (recipients.length === 0) {
            toast.error("Please add at least one recipient email");
            return;
        }
        mutation.mutate({ subject, body, actionUrl: actionUrl || undefined, imageUrl: imageUrl || undefined, recipients });
    };

    return (
        <Card className="space-y-6 py-4 h-full">
            <CardHeader>
                <CardTitle>Email Campaign</CardTitle>
                <CardDescription>Compose and send an email campaign to your customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
                <Textarea label="Body" rows={6} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Email body" />
                <Input label="Action URL (optional)" value={actionUrl} onChange={(e) => setActionUrl(e.target.value)} placeholder="https://..." />
                <Input label="Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
                <Textarea
                    label="Recipients (comma, space, or newline-separated)"
                    rows={4}
                    value={recipientsRaw}
                    onChange={(e) => setRecipientsRaw(e.target.value)}
                    placeholder="user1@example.com, user2@example.com"
                />
                <div className="flex justify-end">
                    <Button onClick={onSend} isLoading={mutation.isPending} disabled={mutation.isPending || !subject || !body}>
                        Send Campaign
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default EmailCampaignComposer;
