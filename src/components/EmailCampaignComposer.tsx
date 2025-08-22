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
import ProductSearchClient from "./product-search";
import { X } from "lucide-react";
import Image from "next/image";

interface Product {
    name: string;
    price: string;
    originalPrice?: string;
    imageUrl: string;
    url: string;
}

interface Promotion {
    title: string;
    description: string;
    discount: number;
    code: string;
    ctaText: string;
    ctaLink: string;
    urgency: string;
}

interface SocialLinks {
    facebook: string;
    instagram: string;
    twitter: string;
}

interface Campaign {
    id: string;
    subject: string;
    body: string;
    status: string;
    imageUrl?: string;
    groupId?: string;
    data?: {
        promotion?: Promotion;
        featuredProducts?: Product[];
        socialLinks?: SocialLinks;
        supportLink?: string;
        unsubscribeLink?: string;
        preferencesLink?: string;
        companyName?: string;
        companyAddress?: string;
        companyPhone?: string;
        contactEmail?: string;
    };
}

interface EmailCampaignComposerProps {
    initialData?: Campaign;
    onClose?: () => void;
}

const EmailCampaignComposer: React.FC<EmailCampaignComposerProps> = ({ initialData, onClose }) => {
    const utils = api.useUtils();
    const [subject, setSubject] = useState(initialData?.subject ?? "");
    const [body, setBody] = useState(initialData?.body ?? "");
    const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
    const [selectedGroup, setSelectedGroup] = useState<string>(initialData?.groupId ?? "all");
    const [recipientsRaw, setRecipientsRaw] = useState("");
    const [isDraft, setIsDraft] = useState(false);

    // Promotion fields
    const [promotion, setPromotion] = useState<Promotion>(initialData?.data?.promotion ?? {
        title: "",
        description: "",
        discount: 0,
        code: "",
        ctaText: "",
        ctaLink: "",
        urgency: ""
    });

    // Featured Products
    const [selectedProducts, setSelectedProducts] = useState<Product[]>(initialData?.data?.featuredProducts ?? []);
    const [showProductSearch, setShowProductSearch] = useState(false);

    // Load shop settings
    const { data: shopSettings } = api.email.getShopSettings.useQuery();

    const { data: groups } = api.email.getGroups.useQuery();
    const { data: recipients, refetch: refetchRecipients } = api.email.getRecipients.useQuery({ groupId: selectedGroup }, { enabled: false });

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

    useEffect(() => {
        if (selectedGroup) {
            void refetchRecipients();
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
        const recipientList =
            recipients?.emails ??
            recipientsRaw
                .split(/[\n,;\s]+/)
                .map((s) => s.trim())
                .filter(Boolean);

        if (!isDraft && recipientList.length === 0 && !initialData) {
            toast.error("Please select a group or add recipient emails");
            return;
        }

        if (!shopSettings) {
            toast.error("Shop settings not found. Please contact support.");
            return;
        }

        const campaignData = {
            promotion: Object.values(promotion).some(Boolean) ? promotion : undefined,
            featuredProducts: selectedProducts.length > 0 ? selectedProducts : undefined,
            socialLinks: shopSettings.socialLinks as SocialLinks,
            supportLink: shopSettings.supportLink,
            unsubscribeLink: shopSettings.unsubscribeLink,
            preferencesLink: shopSettings.preferencesLink,
            companyName: shopSettings.companyName,
            companyAddress: shopSettings.companyAddress,
            companyPhone: shopSettings.companyPhone,
            contactEmail: shopSettings.contactEmail
        };

        if (initialData?.id) {
            updateMutation.mutate({
                id: initialData.id,
                subject,
                body,
                imageUrl: imageUrl || undefined,
                data: campaignData
            });
        } else if (isDraft) {
            createDraftMutation.mutate({
                subject,
                body,
                imageUrl: imageUrl || undefined,
                groupId: selectedGroup === "all" ? undefined : selectedGroup,
                data: campaignData
            });
        } else {
            mutation.mutate({
                subject,
                body,
                imageUrl: imageUrl || undefined,
                recipients: recipientList,
                groupId: selectedGroup === "all" ? undefined : selectedGroup,
                data: campaignData
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
                <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="text-lg font-semibold">Promotion</h3>
                    <Input
                        label="Title"
                        value={promotion.title}
                        onChange={(e) => setPromotion({ ...promotion, title: e.target.value })}
                        placeholder="Special Offer"
                    />
                    <Input
                        label="Description"
                        value={promotion.description}
                        onChange={(e) => setPromotion({ ...promotion, description: e.target.value })}
                        placeholder="Get 10% off your first purchase"
                    />
                    <Input
                        type="number"
                        label="Discount %"
                        value={promotion.discount}
                        onChange={(e) => setPromotion({ ...promotion, discount: parseInt(e.target.value) })}
                        placeholder="10"
                    />
                    <Input
                        label="Promo Code"
                        value={promotion.code}
                        onChange={(e) => setPromotion({ ...promotion, code: e.target.value })}
                        placeholder="SAVE10"
                    />
                    <Input
                        label="CTA Text"
                        value={promotion.ctaText}
                        onChange={(e) => setPromotion({ ...promotion, ctaText: e.target.value })}
                        placeholder="Shop Now"
                    />
                    <Input
                        label="CTA Link"
                        value={promotion.ctaLink}
                        onChange={(e) => setPromotion({ ...promotion, ctaLink: e.target.value })}
                        placeholder="https://..."
                    />
                    <Input
                        label="Urgency Message"
                        value={promotion.urgency}
                        onChange={(e) => setPromotion({ ...promotion, urgency: e.target.value })}
                        placeholder="Limited time offer"
                    />
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Featured Products</h3>
                        <Button variant="outline" onClick={() => setShowProductSearch(true)}>
                            Add Product
                        </Button>
                    </div>

                    {selectedProducts.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                            {selectedProducts.map((product, idx: number) => (
                                <div key={idx} className="relative border rounded-md p-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-2"
                                        onClick={() => {
                                            setSelectedProducts(products =>
                                                products.filter((_, i) => i !== idx)
                                            )
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <div className="relative w-full h-32 mb-2">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="absolute inset-0 w-full h-full object-cover rounded-md"
                                        />
                                    </div>
                                    <h4 className="font-medium truncate">{product.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="font-semibold">${product.price}</span>
                                        {product.originalPrice && (
                                            <span className="text-sm line-through text-muted-foreground">
                                                ${product.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {showProductSearch && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Search Products</h3>
                                <Button variant="ghost" size="icon" onClick={() => setShowProductSearch(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <ProductSearchClient
                                onProductSelect={(product) => {
                                    setSelectedProducts(products => [...products, {
                                        name: product.name,
                                        price: product.price.toString(),
                                        originalPrice: product.originalPrice?.toString(),
                                        imageUrl: product.images[0] || product.image || "/placeholder.jpg",
                                        url: `/products/${product.slug}`
                                    }]);
                                    setShowProductSearch(false);
                                }}
                            />
                        </div>
                    </div>
                )}

                <Input label="Cover Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />

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
                            {recipients && <p className="text-sm text-muted-foreground">{recipients.emails.length} recipients in selected group</p>}
                        </div>
                    </>
                )}

                {!initialData && (
                    <div className="flex items-center space-x-2">
                        <Switch id="draft-mode" checked={isDraft} onCheckedChange={setIsDraft} />
                        <Label htmlFor="draft-mode">Save as draft</Label>
                    </div>
                )}

                <div className="flex justify-end space-x-2">
                    {initialData && (
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    )}
                    {initialData ? (
                        <Button
                            onClick={onSend}
                            isLoading={updateMutation.isPending}
                            disabled={updateMutation.isPending || !subject || !body}
                            variant="outline"
                        >
                            Update Draft
                        </Button>
                    ) : (
                        <Button
                            onClick={onSend}
                            isLoading={mutation.isPending || createDraftMutation.isPending}
                            disabled={mutation.isPending || createDraftMutation.isPending || !subject || !body}
                            variant="primary"
                        >
                            {isDraft ? "Save Draft" : "Send Campaign"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default EmailCampaignComposer;
