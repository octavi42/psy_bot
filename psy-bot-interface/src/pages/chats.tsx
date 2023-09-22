import UserChats from "../components/UserChats";
import CurrentChat from "../components/Chat";
import SelectChat from "../components/SelectChat";

import { api } from "~/utils/api";
import { getSession, useSession } from "next-auth/react";
import SelectChatModal from "../components/SelectChat";
import ChatLayout from "~/components/ChatLayout";
import AuthLayout from "~/components/AuthLayout";
import { GetServerSidePropsContext } from "next";
import { requireAuthentication } from "~/actions/auth";

const MainPage = () => {
  return (
      <ChatLayout>
        <SelectChatModal />
      </ChatLayout>
  );
};

export default MainPage;


export const getServerSideProps = requireAuthentication;