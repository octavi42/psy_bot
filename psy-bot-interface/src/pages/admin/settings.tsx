

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
        <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      {/* <Separator />
      <ProfileForm /> */}
    </div>
    </AdminLayout>
  );
};

export default TestPage;


export const getServerSideProps = requireContributionAuthentication;