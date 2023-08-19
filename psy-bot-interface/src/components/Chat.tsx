import React, { useState, useRef, useEffect, ReactNode, FunctionComponent } from "react";
import AutoScrollContainer from "./AutoScrollContainer";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Chat, ChatRole } from "@prisma/client";
import { useChat } from "ai/react"
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";

type ChatComponentProps = {
  children?: ReactNode;
};

type Message = {
  content: string;
  id: string;
  role: ChatRole;
  createdAt: Date;
};

const CurrentChat: FunctionComponent<ChatComponentProps> = () => {
  const router = useRouter();
  const { chatId } = router.query;
  const { mutate: saveChatMessage } = api.chat.saveChatMessage.useMutation();

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const { messages: aiMessages, input, handleInputChange, handleSubmit } = useChat({
    api: `/api/openai`,
    body: {},
    onResponse() {
      setActiveChatId(chatId as string);
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
  });

  const { data: chatsData } = api.chat.getChats.useQuery();

  const { data: messagesData, isFetching: isMessagesLoading } =
    api.chat.getMessages.useQuery(
      {
        chatId: chatId as string,
      },
      {
        enabled: !!chatId,
      }
    );

  const selectedChat = chatsData?.find((chat) => chat.id === chatId) as Chat;

  const handleSubmitInFunction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // here we want to also save user message to our database;
    saveChatMessage(
      {
        chatId: chatId as string,
        role: ChatRole.user,
        text: input,
      },
      {
        onError(error) {
          console.log(error);
        },
      }
    );
    handleSubmit(e);
  };

  const [dbMessages, setDbMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (messagesData) {
      const newMessages = messagesData.map((message) => ({
        content: message.text,
        id: message.id,
        role: message.role,
        createdAt: message.createdAt,
      }));
      setDbMessages(newMessages);
    }
  }, [messagesData]);

  const combinedMessages = activeChatId === chatId ? [...dbMessages, ...aiMessages] : dbMessages;


  // console.log("combinedMessages");
  // console.log(activeChatId, chatId);

  return (
    <div className="flex h-screen max-h-screen w-full flex-col justify-between bg-gray-100">
      {/* Chat component label */}
      <div className="flex flex-row border-b p-4 bg-white">
        <span className="font-semibold text-gray-800">Selected chat:</span>
        <Label className="ml-2 font-bold text-blue-600">
          {selectedChat && selectedChat.name}
        </Label>
      </div>
      {/* Container for messages */}
      <AutoScrollContainer>
        {combinedMessages.map((message) => {
          const { content, id, role } = message;
          const messageClassName =
            role !== ChatRole.assistant ? "bg-accent" : "bg-white";

          return (
            <div
              key={id}
              className={`${messageClassName} my-2 flex w-full flex-row items-center gap-3 rounded-md border p-2 shadow-md`}
            >
              <div className="flex flex-col">
                <h1
                  className={`font-semibold ${
                    role === ChatRole.assistant
                      ? "text-blue-600"
                      : "text-green-600"
                  }`}
                >
                  {role === ChatRole.assistant ? "Assistant" : "You"}
                </h1>
                <p className="text-sm text-gray-700">{content}</p>
              </div>
            </div>
          );
        })}
        {isMessagesLoading && (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={64} />
          </div>
        )}
      </AutoScrollContainer>
      {/* Input box */}
      <div className="h-[55px] bg-accent px-2">
        <form className="w-full" onSubmit={handleSubmitInFunction}>
          <Input
            className="h-[55px] w-full bg-white border rounded-md p-2"
            placeholder="Say something..."
            value={input}
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
};

export default CurrentChat;
