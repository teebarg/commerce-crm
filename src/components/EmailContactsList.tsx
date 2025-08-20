"use client";

import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { QueueStats } from "@/trpc/schema";
import { Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EmailContact } from "@prisma/client";
import { useOverlayTriggerState } from "@react-stately/overlays";

const EmailContactItem: React.FC<{ c: EmailContact; onRefetch: () => void }> = ({ c, onRefetch }) => {
    const deleteState = useOverlayTriggerState({});
    const deleteContactMutation = api.email.deleteContact.useMutation({
        onSuccess: () => {
            toast.success("Contact deleted successfully");
            void onRefetch();
        },
        onError: () => {
            toast.error("Failed to delete contact");
        },
    });
    return (
        <div className="border rounded-md p-3">
            <div className="flex justify-between items-start">
                <div>
                    <div className="font-medium">{c.name ?? "Unnamed"}</div>
                    <div className="text-sm text-muted-foreground">{c.email}</div>
                </div>
                <AlertDialog open={deleteState.isOpen} onOpenChange={deleteState.setOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete the contact {c?.email}? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    deleteContactMutation.mutate({ id: c.id });
                                }}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

const EmailContactsList: React.FC = () => {
    const utils = api.useUtils();
    const [processing, setProcessing] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [stats, setStats] = useState<QueueStats | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const pageSize = 20;

    const { data, isLoading, refetch } = api.email.listContacts.useQuery({ search, page, pageSize });
    const total = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/worker");
            if (response.ok) {
                const data = await response.json();
                console.log("🚀 ~ fetchStats ~ data:", data);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                setStats(data);
            }
        } catch (error) {
            console.log("🚀 ~ fetchStats ~ error:", error);
            toast.error("Failed to fetch stats:");
        } finally {
            setLoading(false);
        }
    };

    const processEvents = async (limit = 50) => {
        setProcessing(true);
        try {
            const response = await fetch("/api/worker", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ limit }),
            });

            if (response.ok) {
                await response.json();
                await fetchStats();
                await utils.push.invalidate();
            }
        } catch (error) {
            console.log("🚀 ~ processEvents ~ error:", error);
            toast.error("Failed to process events:");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between gap-3">
                    <CardTitle>Email Contacts</CardTitle>
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search name or email"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setPage(1);
                                    void refetch();
                                }
                            }}
                            className="w-64"
                        />
                        <Button
                            onClick={() => {
                                setPage(1);
                                void refetch();
                            }}
                            variant="secondary"
                        >
                            Search
                        </Button>
                        <Button onClick={() => processEvents(50)} disabled={processing || (stats?.queueLength ?? 0) === 0} variant="default">
                            {processing ? "Processing..." : `Process Events (${stats?.queueLength ?? 0})`}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="py-10 text-center text-muted-foreground">Loading contacts...</div>
                ) : !data?.items?.length ? (
                    <div className="py-10 text-center text-muted-foreground">No contacts found.</div>
                ) : (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {data.items.map((c: EmailContact, idx: number) => (
                                <EmailContactItem key={idx} c={c} onRefetch={() => void refetch()} />
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    disabled={page <= 1}
                                    onClick={() => {
                                        setPage((p) => Math.max(1, p - 1));
                                        void refetch();
                                    }}
                                    variant="outline"
                                >
                                    Previous
                                </Button>
                                <Button
                                    disabled={page >= totalPages}
                                    onClick={() => {
                                        setPage((p) => Math.min(totalPages, p + 1));
                                        void refetch();
                                    }}
                                    variant="outline"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default EmailContactsList;
