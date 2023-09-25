

import { api } from "~/utils/api";
import { getSession, useSession } from "next-auth/react";
import ChatLayout from "~/components/ChatLayout";
import AuthLayout from "~/components/AuthLayout";
import { GetServerSidePropsContext } from "next";
import { requireAuthentication, requireContributionAuthentication } from "~/actions/auth";
import SelectChatModal from "~/components/SelectChat";
import AdminLayout from "~/components/admin/sidebar-nav";

const TestPage = () => {


  return (
    <AdminLayout>
        <ChatLayout>
            <SelectChatModal />
        </ChatLayout>
    </AdminLayout>
  );
};

export default TestPage;


export const getServerSideProps = requireContributionAuthentication