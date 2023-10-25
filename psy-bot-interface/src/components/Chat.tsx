import React from "react";
import AutoScrollContainer from "./AutoScrollContainer";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Chat, ChatRole } from "@prisma/client";
import { useChat, type Message } from "ai/react"
import ChatMessage from "./ChatMessage";

import { InputPanel } from "./InputPanel";

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}


function CurrentChat({ id, initialMessages, className }: ChatProps) {
  const router = useRouter();
  const { chatId } = router.query;
  const { mutate: saveChatMessage } = api.chat.saveChatMessage.useMutation();
  const { mutate: deleteChatMessage } = api.chat.deleteChatMessage.useMutation();
  
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
        console.log("finished!!!!");

        saveChatMessage(
          {
            chatId: chatId as string,
            role: ChatRole.assistant,
            text: message.content,
          },
          {
            onError(error) {
              console.log("error at onFinish and the message save", error);
            },
          }
        );
      },

      onError(error) {

        console.log("error on the onError", error);

        deleteChatMessage(
          {
            id: messages[messages.length - 1]?.id as string,
          },
          {
            onError(error) {
              console.log("error at the on Error and deleteChat", error);
            },
          }
        )

      },

      

      
    })

  const { data: chatsData } = api.chat.getChats.useQuery();

  const selectedChat = chatsData?.find((chat) => chat.id === chatId) as Chat;
  
  return (
    <div className="flex h-screen max-h-screen w-full flex-col justify-between bg-white">
      {/* Chat component label */}
      <div className="flex flex-row p-4 bg-white border border-gray-100">
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

      {/* Input box */}
      <InputPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
        chatId={chatId as string}
      />
      
    </div>
  );
};

export default CurrentChat;