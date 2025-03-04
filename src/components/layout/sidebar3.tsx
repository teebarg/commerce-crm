// File: components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Users, CreditCard, Package, Star, MapPin, Settings, BarChart, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
    { label: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
    { label: "Dashboard", href: "/store", icon: <Home className="w-5 h-5" /> },
    { label: "Orders", href: "/store/orders", icon: <ShoppingBag className="w-5 h-5" /> },
    { label: "Products", href: "/store/products", icon: <Package className="w-5 h-5" /> },
    { label: "Customers", href: "/store/customers", icon: <Users className="w-5 h-5" /> },
    { label: "Payments", href: "/store/payments", icon: <CreditCard className="w-5 h-5" /> },
    { label: "Reviews", href: "/store/reviews", icon: <Star className="w-5 h-5" /> },
    { label: "Addresses", href: "/store/addresses", icon: <MapPin className="w-5 h-5" /> },
    { label: "Analytics", href: "/store/analytics", icon: <BarChart className="w-5 h-5" /> },
    { label: "Settings", href: "/store/settings", icon: <Settings className="w-5 h-5" /> },
];

const general = [
    { label: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
    { label: "Posts", href: "/posts", icon: <Home className="w-5 h-5" /> },
    { label: "Push Notification", href: "/notification", icon: <ShoppingBag className="w-5 h-5" /> },
    { label: "Settings", href: "/settings", icon: <Settings className="w-5 h-5" /> },
];

interface Props {
    label: string;
    href: string;
    icon: React.ReactNode;
    isActive?: boolean;
    isCollapsed?: boolean;
}

const NavLink: React.FC<Props> = ({ label, href, icon, isActive, isCollapsed }) => {
    return (
        <Link
            key={href}
            href={href}
            className={`
                flex items-center ${isCollapsed ? "justify-center" : "justify-start"}
                p-3 rounded-md transition-colors
                ${isActive ? "bg-indigo-50 text-indigo-600" : ""}
            `}
        >
            {icon}
            {!isCollapsed && <span className="ml-3 font-medium">{label}</span>}
            {isActive && !isCollapsed && <motion.div className="absolute right-0 w-1 h-8 bg-indigo-600 rounded-l-md" layoutId="activeIndicator" />}
        </Link>
    );
};

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleMobile = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return (
        <div className="flex h-screen">
            {/* Mobile menu button */}
            <button onClick={toggleMobile} className="lg:hidden fixed z-20 top-4 left-4 p-2 rounded-md bg-white shadow-md">
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile overlay */}
            {isMobileOpen && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleMobile} />}

            {/* Sidebar */}
            <AnimatePresence>
                <motion.aside
                    className={`bg-content1 border-r z-40 ${isCollapsed ? "w-20" : "w-72"} transition-all duration-300 ease-in-out hidden lg:block`}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex flex-col h-full">
                        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} p-4 border-b`}>
                            {!isCollapsed && <span className="text-xl font-bold">Shop Admin</span>}
                            <button onClick={toggleCollapse} className="p-1 rounded hover:bg-gray-100">
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                        <ScrollArea className="flex-1 py-4">
                            <div className="text-sm pl-2.5">Store</div>
                            <nav className="px-2 space-y-1">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <NavLink
                                            key={item.href}
                                            href={item.href}
                                            label={item.label}
                                            icon={item.icon}
                                            isActive={isActive}
                                            isCollapsed={isCollapsed}
                                        />
                                    );
                                })}
                            </nav>
                            <div className="text-sm pl-2.5 mt-4">General</div>
                            {general.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <NavLink
                                        key={item.href}
                                        href={item.href}
                                        label={item.label}
                                        icon={item.icon}
                                        isActive={isActive}
                                        isCollapsed={isCollapsed}
                                    />
                                );
                            })}
                        </ScrollArea>
                        <div className="p-4 border-t border-gray-200">
                            <button
                                className={`flex items-center ${
                                    isCollapsed ? "justify-center w-full" : ""
                                } text-red-500 hover:text-red-600 transition-colors`}
                            >
                                <LogOut className="w-5 h-5" />
                                {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
                            </button>
                        </div>
                    </div>
                </motion.aside>
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-40 lg:hidden"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                <span className="text-xl font-bold">Shop Admin</span>
                                <button onClick={toggleMobile} className="p-1 rounded hover:bg-gray-100">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 py-6 overflow-y-auto">
                                <nav className="px-2 space-y-1">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`
                                                    flex items-center px-3 py-3 rounded-md transition-colors
                                                    ${isActive ? "bg-indigo-50 text-indigo-600" : ""}
                                                `}
                                                onClick={toggleMobile}
                                            >
                                                {item.icon}
                                                <span className="ml-3 font-medium">{item.label}</span>
                                                {isActive && (
                                                    <motion.div
                                                        className="absolute right-0 w-1 h-8 bg-indigo-600 rounded-l-md"
                                                        layoutId="mobileActiveIndicator"
                                                    />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                            <div className="p-4 border-t">
                                <button className="flex items-center text-red-500 hover:text-red-600 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                    <span className="ml-3 font-medium">Logout</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
