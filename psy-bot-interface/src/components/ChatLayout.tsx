import { ReactNode } from "react";
import UserChats from "./UserChats";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import AuthLayout from "./AuthLayout";

interface LayoutProps {
    children?: ReactNode;
}

const ChatLayout = ({ children }: LayoutProps) => {

    return (
        <main className="flex h-screen bg-gradient-to-b">
            <div className="w-1/4 bg-gray flex-shrink-0">
                {/* Left Section: User Chats */}
                <UserChats />
            </div>
            <div className="flex-1 bg-white">
                {/* Right Section: Current Chat */}
                {children}
            </div>
        </main>
    )
}

export default ChatLayout;