import React from "react";
import MenuActions from "../../components/admin/Menu"; // Import the AdminActions component
import AdminLayout from "~/components/admin/AdminLayout";
import { requireContributionAuthentication } from "~/actions/auth";

const AdminPage = () => {
  return (
    <AdminLayout>
        <div>
            <h1 className="text-2xl font-semibold mb-6">Admin Page</h1>
        </div>
    </AdminLayout>
  );
};

export default AdminPage;


export const getServerSideProps = requireContributionAuthentication;