import React, { useState, useRef, useEffect, ReactNode, FunctionComponent } from "react";
import AutoScrollContainer from "./AutoScrollContainer";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Chat, ChatRole } from "@prisma/client";
import { useChat } from "ai/react"
import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import { Loader2 } from "lucide-react";

type ChatComponentProps = {
  children?: ReactNode;
};

const CurrentChat: FunctionComponent<ChatComponentProps> = () => {
  const router = useRouter();
  const { chatId } = router.query;
  const { mutate: saveChatMessage } = api.chat.saveChatMessage.useMutation();
  
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      api: `/api/openai`,
      body: {
        chatId: chatId as string,
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
              console.log("error!");
              console.log("error!");
              console.log("error!");
              console.log(error);
            },
          }
        );
      },
    });

  const { data: chatsData } = api.chat.getChats.useQuery();

  const { data: messagesData, isFetching: isMessageLoading, refetch: refetchMessages } =
    api.chat.getMessages.useQuery(
      { chatId: chatId + "" },
      { enabled: !!chatId }
    );

  
  const selectedChat = chatsData?.find((chat) => chat.id === chatId) as Chat;


  useEffect(() => {
    if (!messagesData) return;
    // take the presaved messages and add them to messages;
    setMessages(
      messagesData.map((message) => ({
        content: message.text,
        id: message.id,
        role: message.role,
        createdAt: message.createdAt,
      }))
    );
  }, [messagesData]);

  const [usrMessage, setUsrMessage] = useState("");

  const maxTextareaHeight = 200; // Maximum height before scrolling is enabled

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // const { mutate: saveChatMessage } = api.chat.saveChatMessage.useMutation({
  //   onSuccess: () => {
  //     setUsrMessage(""); // Clear the input field
  //     // Refetch messages after saving a new message
  //     refetchMessages();
  //   },
  // });

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

  useEffect(() => {
    if (!messagesData) return;
    // take the presaved messages and add them to messages;
    setMessages(
      messagesData.map((message) => ({
        content: message.text,
        id: message.id,
        role: message.role,
        createdAt: message.createdAt,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesData]);

  // const handleKeyPress = (e: React.KeyboardEvent) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSubmitFC(e);
  //   }
  // };

  return (
    <div className="flex h-screen max-h-screen w-full flex-col justify-between">
      {/* the chat component label */}
      <div className="flex flex-row border-b p-4">
        Selected chat:
        {/* <Label className="ml-2 font-bold">
          {selectedChat && selectedChat.name}
        </Label> */}
      </div>
      {/* the container that has all the messages */}
      <AutoScrollContainer>
        {messages.map((message) => {
          const { content, id, role } = message;
          return (
            <div
              key={id}
              className={`${
                role !== ChatRole.assistant && "bg-accent"
              } my-2 flex w-full flex-row items-center gap-3 rounded-md border p-2`}
            >
              <div className="flex flex-col justify-center gap-3">
                <h1>{role === ChatRole.assistant ? "Assistant" : "You"}</h1>
                <p className="text-sm">{content}</p>
              </div>
            </div>
          );
        })}
        {/* {isMessageLoading && (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="animate-spin" size={64} />
          </div>
        )} */}
      </AutoScrollContainer>
      {/* the main input into the chat */}
      <div className="h-[55px] w-full bg-accent px-2">
        <form className="w-full" onSubmit={handleSubmitInFunction}>
          <Input
            className="h-[55px] w-full"
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
