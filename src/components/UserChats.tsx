import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { api } from "~/utils/api";
import ChatList from "./ChatList";

const UserChats = () => {
  const { data: sessionData } = useSession();

  const { data: chatData, isLoading: isChatLoading, refetch: refetchChats } = api.chat.getAll.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );

  const createChatMutation = api.chat.createChat.useMutation({
    onSuccess: () => {
      refetchChats();
    }
  });

  const [chatName, setChatName] = useState<string>("");

  const createChat = () => {
    try {
      createChatMutation.mutate({
        name: chatName, // Use the chatName state for the chat name
      });
      setChatName(""); // Clear the chat name input
    } catch (error) {
      console.error("Mutation Error:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User Chats</h2>
      <div>
        <input
          type="text"
          placeholder="Enter chat name"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
        />
        <button onClick={createChat}>Create Chat</button>
      </div>
      <ChatList/>
    </div>
  );
};

export default UserChats;
