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
    <div className="bg-white p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-4">User Chats</h2>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Enter chat name"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          className="w-full border p-1 rounded-md focus:outline-none"
        />
        <button
          onClick={createChat}
          className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Create
        </button>
      </div>
      <ChatList />
    </div>
  );
};

export default UserChats;
