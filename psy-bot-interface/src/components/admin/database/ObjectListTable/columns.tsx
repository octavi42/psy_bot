"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { ColumnDef } from "@tanstack/react-table"
import { api } from "~/utils/api"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
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
  {
    accessorKey: "type",
    header: "Category",
    cell: ({ row }) => {
      const type = row.getValue("type");

      console.log(row);
      
      
      if (type === "Youtube") {
        const ytid = row.getValue("youtube_id");
        console.log("ytid", ytid);
        console.log("type", type);
        
        
        return <>{ytid}</>;
      } else {
        return "-";
      }
    },
  }
]
