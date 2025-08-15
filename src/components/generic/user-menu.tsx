"use client";

import Link from "next/link";
import { LogOut } from "nui-react-icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import ProfileAvatar from "@/assets/profile.svg";

const UserMenu = () => {
    const links = [
        {
            dataKey: "admin",
            child: (
                <span className="flex-1 text-sm font-normal truncate">
                    <Link href="/settings">Profile</Link>
                </span>
            ),
        },
        {
            dataKey: "account",
            child: (
                <Link href="/api/auth/signout" className="flex w-full items-center text-rose-500 font-semibold no-underline gap-2">
                    <LogOut viewBox="0 0 24 24" className="h-6 w-6" />
                    Sign out
                </Link>
            ),
        },
    ];
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <span className="relative outline-none w-10 h-10 rounded-full ring-2 ring-offset-1 ring-default cursor-pointer">
                    <Image fill alt="avatar" src={ProfileAvatar} />
                </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    <div key="user" className="flex gap-2">
                        <p className="font-semibold">Signed in as</p>
                        <p className="font-semibold">@Niyi</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {links.map((item, index: number) => (
                    <DropdownMenuItem key={index} className="px-2 py-1.5 cursor-pointer" data-key={item.dataKey}>
                        {item.child}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserMenu;
