import UserChats from "../../../components/UserChats";
import CurrentChat from "../../../components/Chat";

import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const MainPage = () => {
  
    

  return (
    <main className="flex h-screen bg-gradient-to-b">
      <div className="w-1/4 bg-gray flex-shrink-0">
        {/* Left Section: User Chats */}
        <UserChats />
      </div>
      <div className="flex-1 bg-white shadow">
        {/* Right Section: Current Chat */}
        <CurrentChat />
      </div>
    </main>
  );
};

export default MainPage;
