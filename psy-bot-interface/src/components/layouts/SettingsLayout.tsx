import { Metadata } from "next";
import { SidebarNav } from "~/components/admin/sidebar-nav";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/admin",
  },
  {
    title: "Account",
    href: "/admin/account",
  },
  {
    title: "Database",
    href: "/admin/database",
  },
  {
    title: "Bot",
    href: "/admin/bot",
  },
  {
    title: "Users",
    href: "/admin/users",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-1/4 bg-gray flex-shrink-0 overflow-y-auto">
        <div className="p-10 pb-16">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-gray-800">
              Settings
            </h2>
            <p className="text-muted-foreground">
              Manage your account settings and set e-mail preferences.
            </p>
          </div>
          <SidebarNav items={sidebarNavItems} className="mt-10"/>
        </div>
      </aside>
      <main className="flex-1 bg-white overflow-y-auto">{children}</main>
    </div>
  );
}
