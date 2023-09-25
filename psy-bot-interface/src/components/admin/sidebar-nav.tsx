"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"


interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
        key={item.href}
        href={item.href}
        className={cn(
          // Add your base button classes here
          "text-gray-600 hover:text-blue-500 transition duration-200",
          // Apply background and underline styles conditionally
          {
            "bg-muted hover:bg-muted text-blue-500": pathname === item.href,
            "": pathname !== item.href,
          },
          "flex items-center py-2 px-4 rounded-md cursor-pointer"
        )}
      >
        {item.title}
      </Link>
      
      
      ))}
    </nav>
  )
}
