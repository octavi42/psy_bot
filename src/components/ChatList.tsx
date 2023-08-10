import { useSession } from "next-auth/react";
import React, { use, useState } from "react";
import { api } from "~/utils/api";

const ChatList = () => {
  const { data: sessionData } = useSession();

  const { data: chatData, isLoading: isChatLoading } = api.chat.getAll.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div>
      {isChatLoading ? (
        <p>Loading chats...</p>
      ) : (
        <div>
          {chatData?.map((chat) => (
            <div key={chat.id}>{chat.name}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
