"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button2";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LayoutDashboard, Package, ShoppingCart, CreditCard, Users, MapPin, Star, BarChart3, Settings, Menu, Store } from "lucide-react";
import { cn } from "@/utils/utils";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            color: "text-sky-500",
        },
        {
            label: "Products",
            icon: Package,
            href: "/dashboard/products",
            color: "text-violet-500",
        },
        {
            label: "Orders",
            icon: ShoppingCart,
            href: "/dashboard/orders",
            color: "text-pink-500",
        },
        {
            label: "Payments",
            icon: CreditCard,
            href: "/dashboard/payments",
            color: "text-orange-500",
        },
        {
            label: "Customers",
            icon: Users,
            href: "/dashboard/customers",
            color: "text-green-500",
        },
        {
            label: "Addresses",
            icon: MapPin,
            href: "/dashboard/addresses",
            color: "text-red-500",
        },
        {
            label: "Reviews",
            icon: Star,
            href: "/dashboard/reviews",
            color: "text-yellow-500",
        },
        {
            label: "Analytics",
            icon: BarChart3,
            href: "/dashboard/analytics",
            color: "text-blue-500",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/dashboard/settings",
            color: "text-gray-500",
        },
    ];

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden fixed left-4 top-4 z-40">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 pt-10">
                    <MobileSidebar routes={routes} pathname={pathname} setOpen={setOpen} />
                </SheetContent>
            </Sheet>

            <aside className={cn("fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r bg-background md:flex", className)}>
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold">
                        <Store className="h-6 w-6" />
                        <span className="text-xl">Admin Panel</span>
                    </Link>
                </div>
                <ScrollArea className="flex-1 py-4">
                    <nav className="grid gap-2 px-4">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all",
                                    pathname === route.href ? "bg-accent text-accent-foreground" : "transparent"
                                )}
                            >
                                <route.icon className={cn("h-5 w-5 shrink-0", route.color)} />
                                <span>{route.label}</span>
                            </Link>
                        ))}
                    </nav>
                </ScrollArea>
            </aside>
        </>
    );
}

function MobileSidebar({ routes, pathname, setOpen }: { routes: any[]; pathname: string; setOpen: (open: boolean) => void }) {
    return (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold" onClick={() => setOpen(false)}>
                    <Store className="h-6 w-6" />
                    <span className="text-xl">Admin Panel</span>
                </Link>
            </div>
            <ScrollArea className="flex-1">
                <nav className="grid gap-2 px-4 py-4">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all",
                                pathname === route.href ? "bg-accent text-accent-foreground" : "transparent"
                            )}
                        >
                            <route.icon className={cn("h-5 w-5 shrink-0", route.color)} />
                            <span>{route.label}</span>
                        </Link>
                    ))}
                </nav>
            </ScrollArea>
        </div>
    );
}
