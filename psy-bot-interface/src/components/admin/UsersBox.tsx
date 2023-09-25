import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UsersBoxProps {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
    verified: boolean;
}

const UsersBox: React.FC<UsersBoxProps> = ({ id, name, email, image, role, verified }) => {
    // Define colors for each role
    const roleColors: { [key: string]: string } = {
        admin: "text-red-500",
        contributor: "text-orange-500",
        member: "text-green-500",
        user: "text-black",
    };

    // Determine the color class for the role text
    const roleColorClass = roleColors[role.toLowerCase()] || "text-black";

    return (
        <div className="flex mt-5 items-center p-4 rounded-lg transition duration-300 hover:bg-fade-in">
            <style jsx>{`
                .hover\:bg-fade-in {
                    background: radial-gradient(ellipse at center, rgba(243, 244, 246, 1) 0%, transparent 100%);
                    transition: background 0.3s ease-in-out;
                }

                .hover\:bg-fade-in:hover {
                    background: rgba(243, 244, 246, 1);
                }
            `}</style>
            <Avatar className="h-9 w-9">
                <AvatarImage src={image || "/default-avatar.png"} alt="Avatar" />
                <AvatarFallback>
                    {name && name.length >= 2 ? name.slice(0, 2) : name}
                </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            <div className={`ml-auto font-medium ${roleColorClass} transition duration-300 hover:${roleColors[role.toLowerCase()] || "text-opacity-100"}`}>
                {role}
            </div>
        </div>
    );
}

export default UsersBox;
