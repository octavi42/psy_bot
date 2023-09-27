"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { ColumnDef } from "@tanstack/react-table"

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
    accessorKey: "image",
    header: () => <div>Image</div>,
    cell: ({ row }) => {
      const name = row.getValue("name")
      const image = row.getValue("image")
 
      return (<>
        <Avatar className="h-9 w-9">
                <AvatarImage src={image?.toString() || "/default-avatar.png"} alt="Avatar" />
                <AvatarFallback>
                    {name && typeof name === "string" && name.length >= 2 ? name.slice(0, 2) : name as string}
                </AvatarFallback>
            </Avatar>
      </>)
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  }
]
