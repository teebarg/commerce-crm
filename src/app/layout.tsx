import "@/styles/globals.css";
import { type Metadata } from "next";

import { Outfit } from "next/font/google";
import { cn } from "@/utils/utils";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeScript } from "@/theme/theme-script";
import { Toaster } from "@/components/ui/sonner";
import ProgressBar from "@/components/ui/progress-bar";

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    style: ["normal"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Commerce CRM",
    description: "Commerce CRM",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html suppressHydrationWarning className={cn("scroll-smooth antialiased", outfit.className)} lang="en">
            <head>
                <ThemeScript />
                <link href="/favicon-96x96.png" rel="icon" sizes="96x96" type="image/png" />
                <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
                <link href="/favicon.ico" rel="shortcut icon" />
                <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
                <meta content="Crm" name="apple-mobile-web-app-title" />
                <link href="/site.webmanifest" rel="manifest" />
            </head>
            <body className="min-h-screen">
                <TRPCReactProvider>
                    <ProgressBar className="">
                        {children}
                        <Toaster closeButton richColors duration={3000} expand={false} position="top-right" />
                    </ProgressBar>
                </TRPCReactProvider>
            </body>
        </html>
    );
}
