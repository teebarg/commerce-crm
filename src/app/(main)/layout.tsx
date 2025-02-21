import { type Metadata } from "next";
import React from "react";
import { redirect } from "next/navigation";
import SideBar from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import UserMenu from "@/components/generic/user-menu";
import dynamic from "next/dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
};

const getThemeToggler = () =>
    dynamic(() => import("@/theme/theme-button"), {
        loading: () => <div className="w-6 h-6" />,
    });

export default async function PageLayout(props: { children: React.ReactNode }) {
    const session = await auth();
    const ThemeButton = getThemeToggler();

    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    return (
        <React.Fragment>
            <div className="flex min-h-screen bg-zinc-800">
                <span className="hidden sm:block min-w-[20rem] h-screen overflow-y-auto">
                    <SideBar />
                </span>
                <div className="flex-1 h-screen overflow-y-auto flex flex-col">
                    <div className="flex flex-row-reverse gap-2 items-center py-2 px-4 shadow-xl">
                        <UserMenu />
                        <ThemeButton />
                    </div>
                    <main className="flex-1">{props.children}</main>
                </div>
            </div>
        </React.Fragment>
    );
}
