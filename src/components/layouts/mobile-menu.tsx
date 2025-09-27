"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useOverlayTriggerState } from "@react-stately/overlays";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

import {
    Home,
    Users,
    Settings,
    Search,
    LogOut,
    ChevronRight,
    MenuIcon,
    BarChart3,
    PlusCircle,
    FileText,
    TrendingUp,
    Send,
    History,
    Mail,
    Settings2,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Menu: React.FC<{ session: any }> = ({ session }) => {
    const pathname = usePathname();

    const menuItems = [
        // Application
        { id: "home", label: "Home", icon: <Home size={20} />, href: "/" },
        { id: "users", label: "Users", icon: <Users size={20} />, href: "/users" },
        { id: "settings", label: "Settings", icon: <Settings size={20} />, href: "/settings" },
        // Socials
        { id: "social-dashboard", label: "Social Dashboard", icon: <BarChart3 size={20} />, href: "/social" },
        { id: "social-create", label: "Create", icon: <PlusCircle size={20} />, href: "/social/create" },
        { id: "social-manage", label: "Manage", icon: <FileText size={20} />, href: "/social/manage" },
        { id: "social-analytics", label: "Analytics", icon: <TrendingUp size={20} />, href: "/social/analytics" },
        // Push Notification
        { id: "notif-dashboard", label: "Notifications", icon: <BarChart3 size={20} />, href: "/notification" },
        { id: "notif-subs", label: "Subscribers", icon: <Users size={20} />, href: "/notification/subscribers" },
        { id: "notif-compose", label: "Compose", icon: <Send size={20} />, href: "/notification/compose" },
        // { id: "notif-templates", label: "Templates", icon: <FileText size={20} />, href: "/notification/templates" },
        { id: "notif-history", label: "History", icon: <History size={20} />, href: "/notification/history" },
        // { id: "notif-settings", label: "Notification Settings", icon: <Settings size={20} />, href: "/notification/settings" },
        { id: "notif-email", label: "Email Campaigns", icon: <Mail size={20} />, href: "/notification/email" },
        { id: "email-contacts", label: "Email Contacts", icon: <Users size={20} />, href: "/notification/email/contacts" },
    ];

    return (
        <div className="h-full rounded-[inherit] overflow-hidden overflow-y-auto">
            <div className="p-4 bg-accent text-gray-800 sticky top-0 z-10">
                <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarImage src={session?.user?.image} />
                        <AvatarFallback className="bg-secondary">{session?.user?.name?.[0] ?? ""}</AvatarFallback>
                    </Avatar>

                    <div>
                        <div className="font-medium">{session?.user?.name}</div>
                        <div className="text-xs text-gray-700">{session?.user?.email}</div>
                    </div>
                </div>
            </div>

            <div className="p-4 border-b-divider">
                <div className="relative">
                    <input
                        className="w-full py-2 pl-8 pr-4 bg-content1 rounded-lg text-sm focus:outline-none border"
                        placeholder="Search..."
                        type="text"
                    />
                    <Search className="absolute left-2 top-2.5 text-default-500" size={16} />
                </div>
            </div>

            <nav className="py-2">
                {menuItems.map((item, idx: number) => (
                    <Link
                        key={idx}
                        className={`flex items-center justify-between w-full p-3 text-left transition-colors ${
                            pathname === item.href ? "bg-accent/50" : ""
                        }`}
                        href={item.href}
                    >
                        <div className="flex items-center space-x-3">
                            <span className={pathname === item.href ? "text-accent" : "text-default-500"}>{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                        <ChevronRight className={pathname === item.href ? "text-accent" : "text-default-500"} size={16} />
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t-divider sticky bottom-0 bg-content1">
                <button className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors w-full p-2">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

const MobileMenu: React.FC<{ session: any }> = ({ session }) => {
    const pathname = usePathname();
    const state = useOverlayTriggerState({});

    useEffect(() => {
        state.close();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (
        <Drawer open={state.isOpen} onOpenChange={state.setOpen}>
            <DrawerTrigger>
                <MenuIcon className="h-8 w-8 md:hidden" />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="sr-only">
                    <DrawerTitle>Menu</DrawerTitle>
                </DrawerHeader>
                <Menu session={session} />
            </DrawerContent>
        </Drawer>
    );
};

export default MobileMenu;
