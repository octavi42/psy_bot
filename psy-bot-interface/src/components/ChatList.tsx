import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import { Separator } from "@/components/ui/separator";
import ChatBox from "./ChatBox";

const ChatList = () => {

  const { data: sessionData } = useSession();

  const { data: chatData, isLoading: isChatLoading, refetch: refetchChats } = api.chat.getAll.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );

  return (
      
    <div className="p-4">
      { !chatData? (
        <div className="text-center items-center">
          <p>Failed to load Chats</p>
        </div>
      ) : (
          chatData?.map((chat) => (
          <>
            <ChatBox id={chat.id} name={chat.name} />
            <Separator className="m-1 bg-transparent" />
          </>
          ))
      )}
      </div>

  );
};

export default ChatList;
