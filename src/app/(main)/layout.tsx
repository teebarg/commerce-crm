import { type Metadata } from "next";
import React from "react";
import { redirect } from "next/navigation";
// import { Sidebar } from "@/components/layout/sidebar2";
import Sidebar from "@/components/layout/sidebar3";
import { auth } from "@/server/auth";
import Header from "@/components/layout/header2";
// import { Header } from "@/components/layout/header";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
};

export default async function PageLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    return (
        <React.Fragment>
            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-auto h-screen">
                    <Header />
                    <main className="flex-1 overflow-y-auto py-6 px-6">{children}</main>
                </div>
            </div>
        </React.Fragment>
    );
}
