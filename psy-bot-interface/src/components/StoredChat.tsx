import React from "react";
import AutoScrollContainer from "./AutoScrollContainer";
import { useRouter } from "next/router";
import { useChat, type Message } from "ai/react";
import ChatMessage from "./ChatMessage";

import { InputPanel } from "./InputPanel";

export interface StoredChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id?: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

function StoredChat({ id, initialMessages, setMessages }: StoredChatProps) {
  const {
    messages,
    append,
    reload,
    stop,
    isLoading,
    input,
    setInput,
  } = useChat({
    api: `/api/openai`,
    initialMessages,
    id,
    body: {
      id,
    },
    onResponse(response) {

    },

    onFinish(message) {
        
        const existingArray = JSON.parse(localStorage.getItem("messages") || "[]");
          existingArray.push(message);
          localStorage.setItem("messages", JSON.stringify(existingArray));

    //   localStorage.setItem("message", JSON.stringify({
    //     text: message,
    //     createdAt: new Date().toISOString(),
    //     role: "assistant",
    //   }));
    },

    onError(error) {
      console.log("error");
      console.log(error);
    },
  });

  return (
    <div className="flex h-screen max-h-screen w-full flex-col justify-between bg-gray-100">
      {/* Chat component label */}
      <div className="flex flex-row border-b p-4 bg-white">
        <span className="font-semibold text-gray-800">Selected chat:</span>
        <span className="ml-2 font-bold text-blue-600">"trial chat"</span>
      </div>

      {/* Container for messages */}
      <AutoScrollContainer>
        {Array.isArray(messages) &&
          messages.map((message, index) => (
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
        setMessages={setMessages}
      />
    </div>
  );
}

export default StoredChat;
