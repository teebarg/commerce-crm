"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button2";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Star, StarHalf, CheckCircle2, XCircle } from "lucide-react";

interface Review {
    id: string;
    customer: {
        name: string;
        email: string;
        avatar?: string;
        initials: string;
    };
    product: string;
    rating: number;
    comment: string;
    date: string;
    status: "Published" | "Pending" | "Rejected";
}

export function ReviewList() {
    const [reviews, setReviews] = useState<Review[]>([
        {
            id: "1",
            customer: {
                name: "Olivia Martin",
                email: "olivia.martin@email.com",
                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1761&auto=format&fit=crop&ixlib=rb-4.0.3",
                initials: "OM",
            },
            product: "Apple iPhone 13 Pro",
            rating: 5,
            comment: "Absolutely love this phone! The camera quality is amazing and battery life is excellent.",
            date: "2025-04-01",
            status: "Published",
        },
        {
            id: "2",
            customer: {
                name: "Jackson Lee",
                email: "jackson.lee@email.com",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
                initials: "JL",
            },
            product: "Samsung Galaxy S22",
            rating: 4,
            comment: "Great phone overall, but battery could be better.",
            date: "2025-03-28",
            status: "Published",
        },
        {
            id: "3",
            customer: {
                name: "Isabella Nguyen",
                email: "isabella.nguyen@email.com",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
                initials: "IN",
            },
            product: "Sony WH-1000XM4",
            rating: 4.5,
            comment: "Excellent noise cancellation and sound quality. Very comfortable for long listening sessions.",
            date: "2025-03-25",
            status: "Pending",
        },
        {
            id: "4",
            customer: {
                name: "William Kim",
                email: "will@email.com",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
                initials: "WK",
            },
            product: 'MacBook Pro 16"',
            rating: 2,
            comment: "Overpriced and had issues with the keyboard. Not worth the money.",
            date: "2025-02-15",
            status: "Rejected",
        },
        {
            id: "5",
            customer: {
                name: "Sofia Davis",
                email: "sofia.davis@email.com",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
                initials: "SD",
            },
            product: "iPad Air",
            rating: 5,
            comment: "Perfect for my needs. Great for drawing and note-taking with the Apple Pencil.",
            date: "2025-03-30",
            status: "Published",
        },
    ]);

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
        }

        if (hasHalfStar) {
            stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
        }

        return <div className="flex">{stars}</div>;
    };

    const getStatusBadge = (status: Review["status"]) => {
        switch (status) {
            case "Published":
                return (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" variant="outline">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Published
                    </Badge>
                );
            case "Pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" variant="outline">
                        Pending
                    </Badge>
                );
            case "Rejected":
                return (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" variant="outline">
                        <XCircle className="mr-1 h-3 w-3" />
                        Rejected
                    </Badge>
                );
            default:
                return null;
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Customer Reviews</CardTitle>
                        <CardDescription>Manage product reviews from customers</CardDescription>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search reviews..." className="w-full pl-8" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reviews.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={review.customer.avatar} alt={review.customer.name} />
                                                <AvatarFallback>{review.customer.initials}</AvatarFallback>
                                            </Avatar>
                                            <div className="text-sm">{review.customer.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[150px] truncate">{review.product}</TableCell>
                                    <TableCell>{renderStars(review.rating)}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">{review.comment}</TableCell>
                                    <TableCell>{review.date}</TableCell>
                                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>View details</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Approve</DropdownMenuItem>
                                                <DropdownMenuItem>Reject</DropdownMenuItem>
                                                <DropdownMenuItem>Reply</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* pagination */}
            </CardContent>
        </Card>
    );
}
