"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/trpc/react";

export default function WorkerPage() {
    const utils = api.useUtils();
    const processMutation = api.push.processStream.useMutation({
        onSuccess: () => {
            void utils.push.subscriptions.invalidate();
            toast.success("Processed events");
        },
    });

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Worker Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>Manual queue management</CardDescription>
                    </CardHeader>
                    <CardContent className="space-x-2">
                        <Button
                            onClick={() => processMutation.mutate({ streamName: "PUSH_EVENT" })}
                            disabled={processMutation.isPending}
                            isLoading={processMutation.isPending}
                            variant="outline"
                        >
                            Process Push Events
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
