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
import { EditUserAlert } from "~/components/admin/EditUserAlert"

interface CustomButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export const chatColumns: ColumnDef<Data>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
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
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt"));
      const options = {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      } as const;
      const formattedDate = createdAt.toLocaleString("en-US", options);
  
      return (
        <div title={createdAt.toString()}>
          {formattedDate}
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Go to Chat",
    cell: ({ row }) => {
      const handleClick = () => {
        window.location.href = `/admin/preview-chat/${row.original.id}`;
      };
      
      console.log("row", row.original.id);
      
  
      return (
        <Button onClick={handleClick}>Go to Chat</Button>
      );
    },
  },
]



export const userColumns: ColumnDef<Data>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const name = row.getValue("name")
      const image = row.getValue("image")

      return (
        <Avatar className="h-9 w-9">
            <AvatarImage src={image || "/default-avatar.png"} alt="Avatar" />
            <AvatarFallback>
                {name && name.length >= 2 ? name.slice(0, 2) : name}
            </AvatarFallback>
        </Avatar>
        // <Avatar size={32} className="flex-shrink-0">
        //   <AvatarImage src={image} alt={name} />
        //   <AvatarFallback>{name[0]}</AvatarFallback>
        // </Avatar>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "eMail"
  },
  {
    accessorKey: "emailVerified",
    header: () => <div>Verified</div>,
    cell: ({ row }) => {
      const emailVerified = row.getValue("emailVerified")

      console.log("emailVerified", emailVerified);
      
 
      return (<>
        {emailVerified}
      </>)
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt"));
      const options = {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      } as const;
      const formattedDate = createdAt.toLocaleString("en-US", options);
  
      return (
        <div title={createdAt.toString()}>
          {formattedDate}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "",
    cell: ({ row }) => {
      const handleClick = () => {
        window.location.href = `/admin/preview-chat/${row.original.id}`;
      };
      
      console.log("row", row.original.id);
      
  
      return (
        <EditUserAlert actionButton={<Button>edit</Button>} title="Edit" description="Edit description" buttonContinue="continue" />
      );
    },
  },
]
