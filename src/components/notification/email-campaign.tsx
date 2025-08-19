"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Mail, MoreHorizontal, Eye, Edit, Trash2, Send, Calendar, Users, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Overlay from "@/components/overlay";
import { useOverlayTriggerState } from "@react-stately/overlays";
import EmailCampaignComposer from "../EmailCampaignComposer";

const dummyCampaigns: any[] = [];

const statusColors = {
    sent: "bg-green-500/10 text-green-700 border-green-200",
    draft: "bg-gray-500/10 text-gray-700 border-gray-200",
    scheduled: "bg-blue-500/10 text-blue-700 border-blue-200",
};

export default function EmailCampaigns() {
    const [campaigns] = useState(dummyCampaigns);
    const createState = useOverlayTriggerState({});

    return (
        <div className="space-y-8 px-4 py-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Email Campaigns</h1>
                    <p className="text-muted-foreground mt-2">Create and manage your email marketing campaigns</p>
                </div>
                <Overlay
                    open={createState.isOpen}
                    title="Create New Campaign"
                    trigger={
                        <Button className="gradient-blue">
                            <Plus className="h-4 w-4 mr-2" />
                            New Campaign
                        </Button>
                    }
                    onOpenChange={createState.setOpen}
                >
                    <EmailCampaignComposer onClose={createState.close} />
                </Overlay>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                        <Send className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">125,430</div>
                        <p className="text-xs text-muted-foreground">emails this month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">28.4%</div>
                        <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Campaigns</CardTitle>
                    <CardDescription>Manage and track your email marketing campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Campaign</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Recipients</TableHead>
                                <TableHead>Open Rate</TableHead>
                                <TableHead>Click Rate</TableHead>
                                <TableHead>Sent Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {campaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{campaign.name}</div>
                                            <div className="text-sm text-muted-foreground truncate max-w-[300px]">{campaign.subject}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={statusColors[campaign.status as keyof typeof statusColors]}>
                                            {campaign.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-muted-foreground" />
                                            {campaign.recipients.toLocaleString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>{campaign.status === "sent" ? `${campaign.openRate}%` : "—"}</TableCell>
                                    <TableCell>{campaign.status === "sent" ? `${campaign.clickRate}%` : "—"}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            {formatDate(campaign.sentAt)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                {campaign.status === "draft" && (
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Campaign
                                                    </DropdownMenuItem>
                                                )}
                                                {campaign.status === "draft" && (
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Send className="mr-2 h-4 w-4" />
                                                        Send Now
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem className="cursor-pointer text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
