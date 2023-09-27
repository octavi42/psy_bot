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
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  }
]
