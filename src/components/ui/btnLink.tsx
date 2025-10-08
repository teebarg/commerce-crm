"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface BtnLinkProps {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "default" | "destructive" | "success" | "emerald";
    size?: "sm" | "lg" | "icon";
    className?: string;
    href: string;
}

const BtnLink: React.FC<BtnLinkProps> = ({ size = "sm", variant = "primary", href, className, children, ...props }) => {
    return (
        <Link
            className={cn(
                buttonVariants({
                    variant: variant,
                    size,
                }),
                "z-0 group relative inline-flex items-center justify-center whitespace-nowrap",
                "font-medium overflow-hidden outline-none transition-all hover:opacity-80",
                className
            )}
            href={href}
            {...props}
        >
            {children}
        </Link>
    );
};

BtnLink.displayName = "BtnLink";

export { BtnLink };
