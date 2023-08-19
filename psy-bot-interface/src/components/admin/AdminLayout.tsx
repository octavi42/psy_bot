import React, { ReactNode } from "react";
import Menu from "./Menu";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gradient-to-b">
      <div className="relative w-1/6 bg-gray flex-shrink-0">
        <Menu />
      </div>
      <div className="flex-1 bg-white shadow">
        {/* Right Section: Content */}
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
