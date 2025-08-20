"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const EmailContactsList: React.FC = () => {
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const pageSize = 20;

    const { data, isLoading, refetch } = api.email.listContacts.useQuery({ search, page, pageSize });
    const total = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

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
                        <Button onClick={() => { setPage(1); void refetch(); }} variant="secondary">Search</Button>
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
                            {data.items.map((c) => (
                                <div key={c.id} className="border rounded-md p-3">
                                    <div className="font-medium">{c.name ?? "Unnamed"}</div>
                                    <div className="text-sm text-muted-foreground">{c.email}</div>
                                    {!!c.memberships?.length && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {c.memberships.map((m) => (
                                                <Badge key={m.id} variant="secondary">{m.group.name}</Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
                            <div className="flex items-center gap-2">
                                <Button
                                    disabled={page <= 1}
                                    onClick={() => { setPage((p) => Math.max(1, p - 1)); void refetch(); }}
                                    variant="outline"
                                >
                                    Previous
                                </Button>
                                <Button
                                    disabled={page >= totalPages}
                                    onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); void refetch(); }}
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


