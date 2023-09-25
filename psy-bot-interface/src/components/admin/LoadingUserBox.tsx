import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface UsersBoxProps {
}

const LoadingUserBox: React.FC<UsersBoxProps> = () => {
    // Determine the color class for the role text

    return (
        <div className="flex mt-5 items-center p-4 rounded-lg transition duration-300">
            <Skeleton className="h-9 w-9 bg-gray-200 rounded-full"/>
            <div className="ml-4 space-y-1 w-96">
                <Skeleton className="h-5 w-full bg-gray-200 rounded-full"/>
                <Skeleton className="h-3 w-3/4 bg-gray-100 rounded-full"/>
                {/* <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-sm text-muted-foreground">{email}</p> */}
            </div>
        </div>
    );
}

export default LoadingUserBox;