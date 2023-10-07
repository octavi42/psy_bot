import React from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Chat, ChatRole } from "@prisma/client";
import { useChat, type Message } from "ai/react"

import AutoScrollContainer from "../AutoScrollContainer";
import ChatMessage from "../ChatMessage";
import { Button } from "@/components/ui/button";

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}


function PreviewCurrentChat({ id, initialMessages, className }: ChatProps) {
  const router = useRouter();
  const { chatId } = router.query;
  const { mutate: saveChatMessage } = api.chat.saveChatMessage.useMutation();
  
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      api: `/api/openai`,
      initialMessages,
      id,
      body: {
        id,
        chatId
      },
      onResponse(response) {
        
        console.log("request happening");
        
      },

      onFinish(message) {
        saveChatMessage(
          {
            chatId: chatId as string,
            role: ChatRole.assistant,
            text: message.content,
          },
          {
            onError(error) {
              console.log(error);
            },
          }
        );
      },

      onError(error) {
        console.log("error");
        console.log(error);
      }
    })

  const { data: chatsData } = api.chat.getChats.useQuery();

  const selectedChat = chatsData?.find((chat) => chat.id === chatId) as Chat;

  const handleBackButtonClick = () => {
    router.back(); // Redirects to the previous page
  };
  
  return (
    <div className="flex h-screen max-h-screen w-full flex-col justify-between bg-gray-100">
      {/* Chat component label */}
      <div className="flex flex-row border-b p-4 bg-white">
      <Button
        onClick={handleBackButtonClick}
      >
        Back
      </Button>
        <span className="font-semibold text-gray-800">Selected chat:</span>
        <span className="ml-2 font-bold text-blue-600">
          {selectedChat && selectedChat.name}
        </span>
      </div>
      
      {/* Container for messages */}
      <AutoScrollContainer>
        {messages.map((message, index) => (
          <div key={index}>
            <ChatMessage message={message} />
          </div>
        ))}
      </AutoScrollContainer>

    </div>
  );
};

export default PreviewCurrentChat;