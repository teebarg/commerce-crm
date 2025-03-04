"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { MoonFilled, SunFilled } from "nui-react-icons";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const [isClient, setIsClient] = useState<boolean>(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    const icon = theme === "dark" ? <SunFilled className="h-6 w-6" /> : <MoonFilled className="h-6 w-6" />;

    return (
        <button aria-label="theme" className="text-primary" type="button" onClick={toggleTheme}>
            {icon}
        </button>
    );
}
