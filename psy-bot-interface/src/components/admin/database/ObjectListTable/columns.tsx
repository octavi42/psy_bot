"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { AlertDialogComponent } from "~/components/Alert"
import { api } from "~/utils/api"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Data = {
  id: string
  email: string
  title: string,
  description: string,
  category: string,
  type: string,
  youtube_id: string
}

import React from "react";

interface CustomButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export const columns: ColumnDef<Data>[] = [
  {
    accessorKey: "createdByUserId",
    header: () => <div>Created by</div>,
    cell: ({ row }) => {
      const name = row.getValue("name")
      const image = row.getValue("image")

      const userId = row.getValue("createdByUserId")
      const { data: user, refetch: refetchUser, isFetching: loading } = api.users.getById.useQuery({ id: userId as string });      
 
      return (<>
        {user?.name}
      </>)
    },
  },
  {
    accessorKey: "createdByUserId",
    header: () => <div>Creator mail</div>,
    cell: ({ row }) => {
      const userId = row.getValue("createdByUserId")
      const { data: user, refetch: refetchUser, isFetching: loading } = api.users.getById.useQuery({ id: userId as string });      
 
      return (<>
        {user?.email}
      </>)
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
        const description = row.getValue("description") as string
        const truncatedDescription = description ? description.slice(0, 50) + (description.length > 50 ? "..." : "") : "";
        
        return (
          <div title={description}>
            {truncatedDescription}
          </div>
        );
      },
  },
//   {
//     id: "category",
//     accessorKey: "type",
//     header: "Category",
//     cell: ({ row }) => {
//       const type = row.getValue("type");

//       console.log(row);
      
      
//       if (type === "Youtube") {
//         const ytid = row.getValue("youtube_id");
//         console.log("ytid", ytid);
//         console.log("type", type);
        
        
//         return <>{ytid}</>;
//       } else {
//         return "-";
//       }
//     },
//     },
    {
        accessorKey: "youtube_id",
        cell: ({ row }) => {
          const userId = row.getValue("createdByUserId");
          const { data: user, refetch: refetchUser, isFetching: loading } = api.users.getById.useQuery({ id: userId as string });
          const address = user?.email as string;
          const ytid = row.getValue("youtube_id");
      
          // Construct the YouTube video URL
          const youtubeVideoUrl = `https://www.youtube.com/watch?v=${ytid}`;
      
          const handleGoToYouTubeVideo = () => {
            // Open a new tab with the YouTube video URL
            window.open(youtubeVideoUrl, "_blank");
          };
      
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(address)}
                  className="text-black focus:bg-gray-600 focus:text-slate-50 rounded-xl"
                >
                  Edit
                </DropdownMenuItem>
                <AlertDialogComponent
                    actionButton={
                        <Button
                        onClick={() => {
                            // Add your code here for the action you want to perform
                            // (e.g., showing the AlertDialog or performing clipboard action).
                        }}
                        className="cursor-default w-full h-8 p-2 text-sm font-normal justify-start text-left hover:bg-gray-600 hover:text-slate-50 rounded-xl"
                        >
                        Delete
                        </Button>
                    } title="Ești sigur că vrei să ștergi conținutul?" description="Această acțiune nu poate fi anulată. Aceasta va șterge permanent datele din baza de date." buttonContinue="Delete"/>
                <DropdownMenuSeparator />
                {ytid !== null && (
                  <DropdownMenuItem
                    className="text-black focus:bg-blue-400 focus:text-slate-50 rounded-xl"
                    onClick={handleGoToYouTubeVideo}
                  >
                    Go to YouTube video
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }
      
  
]
