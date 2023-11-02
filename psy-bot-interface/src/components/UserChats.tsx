import React from "react";
import ChatList from "./ChatList";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateChat from "./CreateChat"

const UserChats = () => {
  return (
    <div className="justify-items-stretch flex flex-col content-evenly bg-white p-4 rounded-md h-screen ">

      {/* title */}
      <div className="basis-0">
        <h2 className="text-xl font-semibold mb-4">User Chats</h2>
      </div>

      {/* create chat */}
      <CreateChat />

      {/* listed chats */}
      <ScrollArea className="relative w-full rounded-md border bottom-0 basis-full no-scrollbar">
        <ChatList />
      </ScrollArea>

    </div>
  );
};

export default UserChats;
