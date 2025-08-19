"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";

const EmailCampaignsAnalytics: React.FC = () => {
    const { data } = api.email.campaignsAnalytics.useQuery();

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalCampaigns ?? 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Sent</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalSent ?? 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Avg Open Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data ? `${data.avgOpenRate.toFixed(1)}%` : "-"}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left">
                                    <th className="py-2 pr-4">Subject</th>
                                    <th className="py-2 pr-4">Status</th>
                                    <th className="py-2 pr-4">Recipients</th>
                                    <th className="py-2 pr-4">Open Rate</th>
                                    <th className="py-2 pr-4">Click Rate</th>
                                    <th className="py-2 pr-4">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.campaigns?.map((c) => (
                                    <tr key={c.id} className="border-t">
                                        <td className="py-2 pr-4">{c.subject}</td>
                                        <td className="py-2 pr-4">{c.status}</td>
                                        <td className="py-2 pr-4">{c.recipients}</td>
                                        <td className="py-2 pr-4">{`${c.openRate.toFixed(1)}%`}</td>
                                        <td className="py-2 pr-4">{`${c.clickRate.toFixed(1)}%`}</td>
                                        <td className="py-2 pr-4">{c.sentAt ? new Date(c.sentAt).toLocaleString() : "-"}</td>
                                    </tr>
                                ))}
                                {(!data || data.campaigns.length === 0) && (
                                    <tr>
                                        <td className="py-4 text-center" colSpan={6}>
                                            No campaigns yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EmailCampaignsAnalytics;
