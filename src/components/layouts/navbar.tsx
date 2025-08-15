import ThemeToggle from "@/theme/theme-button";

import { auth } from "@/server/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const AdminNavbar = async () => {
    const session = await auth();

    return (
        <div className="flex items-center justify-between px-4 py-2.5 sticky top-0 z-50 bg-background">
            <Link href="/">
                <p className="font-semibold text-inherit">Crm</p>
            </Link>

            <div className="flex items-center gap-2">
                <ThemeToggle />
                {session?.user ? (
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={session.user.image ?? ""} alt="@user" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-xs text-default-500">Signed in as</p>
                            <p className="font-semibold text-sm">@{session.user?.name}</p>
                        </div>
                    </div>
                ) : (
                    <Link href="/api/auth/signin">
                        Log In <span aria-hidden="true">&rarr;</span>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default AdminNavbar;
