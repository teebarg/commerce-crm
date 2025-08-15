import { type Metadata } from "next";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import { AdminSidebar } from "@/components/layouts/admin-sidebar";
import AdminNavbar from "@/components/layouts/navbar";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
};

export default async function PageLayout(props: { children: React.ReactNode }) {
    const session = await auth();

    return (
        <SidebarProvider>
            <AdminSidebar session={session}/>
            <main className="flex-1">
                <AdminNavbar />
                {props.children}
            </main>
        </SidebarProvider>
    );
}
