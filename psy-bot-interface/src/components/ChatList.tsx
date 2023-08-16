import { useSession } from "next-auth/react";
import { useRouter } from "next/router"; // Import useRouter
import React from "react";
import { api } from "~/utils/api";

const ChatList = () => {
  const { data: sessionData } = useSession();
  const router = useRouter(); // Initialize the router

  const { data: chatData, isLoading: isChatLoading, refetch: refetchChats } = api.chat.getAll.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );

  const deleteChatMutation = api.chat.deleteChat.useMutation();

  const handleDeleteChat = (chatId: string) => {
    try {
      deleteChatMutation.mutate({ chatId }, {
        onSuccess: () => {
          refetchChats();
        },
      });
    } catch (error) {
      console.error("Mutation Error:", error);
    }
  };

  const handleSelectChat = (chatId: string) => {
    // Programmatically navigate to the selected chat URL
    router.push(`/chats/${chatId}`);
  };

  return (
    <div className="bg-gray-100 p-4">
      <h2 className="text-xl font-semibold mb-4">Chat List</h2>
      {isChatLoading ? (
        <p>Loading chats...</p>
      ) : (
        <div className="space-y-2">
          {chatData?.map((chat) => (
            <div
              key={chat.id}
              className="border border-gray-300 rounded-md p-2 flex justify-between items-center hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelectChat(chat.id)} // Call handleSelectChat on click
            >
              {chat.name}
              <button
                className="text-red-500"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event from bubbling to the parent div
                  handleDeleteChat(chat.id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
