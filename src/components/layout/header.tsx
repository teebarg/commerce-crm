"use client";

import { useState, useEffect } from "react";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button2";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import Link from "next/link";
import { LogOut, User } from "nui-react-icons";

const getThemeToggler = () =>
    dynamic(() => import("@/theme/theme-button"), {
        loading: () => <div className="w-6 h-6" />,
    });

export function Header() {
    const [mounted, setMounted] = useState(false);
    const [notifications, setNotifications] = useState(3);

    const ThemeButton = getThemeToggler();

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <div className="hidden md:flex md:flex-1">
                <form className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search..." className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-96" />
                </form>
            </div>
            <div className="flex flex-1 items-center justify-end gap-4 md:gap-2 lg:gap-4">
                <Button variant="outline" size="icon" className="relative" onClick={() => setNotifications(0)}>
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                        <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0" variant="destructive">
                            {notifications}
                        </Badge>
                    )}
                </Button>
                <ThemeButton />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
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
                            <Link href="/api/auth/signout" className="flex w-full items-center text-rose-500 font-semibold no-underline gap-2">
                                <LogOut viewBox="0 0 24 24" className="h-6 w-6" />
                                Sign out
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
