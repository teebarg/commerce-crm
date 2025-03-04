"use client";

import { Search, Bell, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const getThemeToggler = () =>
    dynamic(() => import("@/theme/theme-button"), {
        loading: () => <div className="w-6 h-6" />,
    });

export default function Header() {
    const ThemeButton = getThemeToggler();

    // Avoid hydration mismatch
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const notifications = [
        { id: 1, content: "New order #1234 received", time: "5 min ago", read: false },
        { id: 2, content: "Product stock low: Wireless Headphones", time: "1 hour ago", read: false },
        { id: 3, content: "Payment processed for order #1230", time: "3 hours ago", read: true },
        { id: 4, content: "New review for Blue T-Shirt", time: "5 hours ago", read: true },
    ];

    const messages = [
        { id: 1, sender: "John Doe", content: "When will my order arrive?", time: "10 min ago", avatar: "/avatar-1.jpg" },
        { id: 2, sender: "Sarah Smith", content: "I'd like to return my purchase", time: "1 hour ago", avatar: "/avatar-2.jpg" },
        { id: 3, sender: "Mike Johnson", content: "Do you offer discounts?", time: "2 hours ago", avatar: "/avatar-3.jpg" },
    ];

    return (
        <header className="sticky top-0 z-50 border-b py-2.5 px-6">
            <div className="flex items-center justify-between">
                <div className="hidden md:flex md:flex-1">
                    <form className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-96"
                        />
                    </form>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <ThemeButton />
                    </div>
                    <div className="relative">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                    <Bell className="w-5 h-5 text-foreground" />
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                                        2
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-80" align="end" forceMount>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="px-4 py-2 border-b border-gray-200 font-medium">Notifications</div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${
                                                    !notification.read ? "bg-blue-50" : ""
                                                }`}
                                            >
                                                <p className="text-sm text-gray-800">{notification.content}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="py-2 px-4 text-center">
                                        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View all notifications</button>
                                    </div>
                                </motion.div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="relative">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                    <MessageSquare className="w-5 h-5 text-foreground" />
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                                        3
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-80" align="end" forceMount>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="px-4 py-2 border-b border-gray-200 font-medium">Messages</div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {messages.map((message) => (
                                            <div key={message.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 flex items-start">
                                                <div className="flex-shrink-0 mr-3">
                                                    <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                                                        {/* Placeholder for avatar */}
                                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-indigo-500">
                                                            {message.sender.charAt(0)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{message.sender}</p>
                                                    <p className="text-sm text-gray-500 truncate">{message.content}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{message.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="py-2 px-4 text-center">
                                        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View all messages</button>
                                    </div>
                                </motion.div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.0.3"
                                            alt="Avatar"
                                        />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuItem>
                                    <Link className="flex w-full items-center" href="settings">
                                        <span className="mr-2">
                                            <User viewBox="0 0 24 24" className="h-6 w-6" />
                                        </span>
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link
                                        href="/api/auth/signout"
                                        className="flex w-full items-center text-rose-500 font-semibold no-underline gap-2"
                                    >
                                        <LogOut viewBox="0 0 24 24" className="h-6 w-6" />
                                        Sign out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}
