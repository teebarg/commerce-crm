"use client";

import { Home, Settings, Users, ChevronUp, LogOut, PanelLeftIcon, BarChart3, Send, History, FileText, PlusCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { type Session } from "@/schemas/base.schema";

const AdminItems = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
    // {
    //     title: "Profile",
    //     url: "/profile",
    //     icon: User,
    // },
];

const Socials = [
    {
        title: "Dashboard",
        url: "/social",
        icon: BarChart3,
    },
    {
        title: "Create",
        url: "/social/create",
        icon: PlusCircle,
    },
    {
        title: "Manage",
        url: "/social/manage",
        icon: FileText,
    },
    {
        title: "Analytics",
        url: "/social/analytics",
        icon: TrendingUp,
    },
];

const PushNotification = [
    {
        title: "Dashboard",
        url: "/notification",
        icon: BarChart3,
    },
    {
        title: "Subscribers",
        url: "/notification/subscribers",
        icon: Users,
    },
    {
        title: "Compose",
        url: "/notification/send",
        icon: Send,
    },
    // {
    //     title: "Templates",
    //     url: "/notification/templates",
    //     icon: FileText,
    // },
    {
        title: "History",
        url: "/notification/history",
        icon: History,
    },
    // {
    //     title: "Settings",
    //     url: "/notification/settings",
    //     icon: Settings,
    // },
];

const Email = [
    {
        title: "Campaigns",
        url: "/email/campaigns",
        icon: FileText,
    },
    {
        title: "Contacts",
        url: "/email/contacts",
        icon: Users,
    },
];

export function AdminSidebar({ session }: { session: Session | null }) {
    const { toggleSidebar, state } = useSidebar();
    const path = usePathname();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <PanelLeftIcon onClick={toggleSidebar} />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {AdminItems.map((item, idx: number) => (
                                <SidebarMenuItem key={idx}>
                                    <SidebarMenuButton asChild isActive={path === item.url}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Socials</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {Socials.map((item, idx: number) => (
                                <SidebarMenuItem key={idx}>
                                    <SidebarMenuButton asChild isActive={path === item.url || (item.url !== "/social" && path.startsWith(item.url))}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Push Notification</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {PushNotification.map((item, idx: number) => (
                                <SidebarMenuItem key={idx}>
                                    <SidebarMenuButton asChild isActive={path === item.url}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Email</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {Email.map((item, idx: number) => (
                                <SidebarMenuItem key={idx}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={path === item.url || (item.url !== "/notification/email" && path.startsWith(item.url))}
                                    >
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className={cn("bg-secondary py-6", state === "collapsed" && "hidden")}>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8 cursor-pointer">
                                            <AvatarImage alt={session?.user?.firstName ?? "User"} src={session?.user?.image ?? undefined} />
                                            <AvatarFallback className="bg-green-600 text-white text-xs">
                                                {session?.user?.name
                                                    ?.split(" ")
                                                    .map((n: string) => n[0])
                                                    .join("") ?? "ME"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p className="font-semibold">{session?.user?.name ?? "User"}</p>
                                            <p className="text-xs text-muted-foreground">{session?.user?.email ?? "User"}</p>
                                        </div>
                                    </div>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-(--radix-popper-anchor-width)" side="top">
                                <DropdownMenuItem>
                                    <Link className="justify-between" href="/profile">
                                        Profile
                                        <span className="badge">New</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 cursor-pointer">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    <Link href="/api/auth/signout">Sign out</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
