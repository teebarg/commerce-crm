import Dropdown from "@/components/ui/dropdown";
import Link from "next/link";
import { LogOut, User, UserCircleMini } from "nui-react-icons";

const UserMenu = () => {
    return (
        <>
            {/* Desktop */}
            <div className="flex items-center">
                <Dropdown align="end" trigger={<UserCircleMini viewBox="0 0 20 20" className="h-10 w-10" />}>
                    <div>
                        <div className="bg-default-100 rounded-lg shadow-md p-3 min-w-[100px] text-sm font-medium">
                            <div className="mb-2">
                                <Link className="flex w-full items-center" href="settings">
                                    <span className="mr-2">
                                        <User viewBox="0 0 24 24" className="h-6 w-6" />
                                    </span>
                                    <span>My profile</span>
                                </Link>
                            </div>
                            <Link href="/api/auth/signout" className="flex w-full items-center text-rose-500 font-semibold no-underline gap-2">
                                <LogOut viewBox="0 0 24 24" className="h-6 w-6" />
                                Sign out
                            </Link>
                        </div>
                    </div>
                </Dropdown>
            </div>
        </>
    );
};

export default UserMenu;
