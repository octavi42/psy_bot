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
