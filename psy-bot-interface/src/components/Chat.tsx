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

  const [isBotProcessing, setIsBotProcessing] = useState(false);

  const { messages: aiMessages, setMessages, append, reload, input, isLoading, stop, handleInputChange, handleSubmit } = useChat({
    api: `/api/openai`,
    onResponse() {
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
      setIsBotProcessing(false)
    },
    onError(error){
      console.log("error");
      console.log(error)
      handleError()
    }
  });

  const handleError = () => {
    setIsBotProcessing(false)
  }

  const { data: chatsData } = api.chat.getChats.useQuery();

  const { data: messagesData, isFetching: isMessagesLoading, refetch: refetchMessages } =
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
    setMessages([])
    
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) {
      stop()
      setIsBotProcessing(false)
      return
    }

    saveChatMessage(
      {
        chatId: chatId as string,
        role: ChatRole.user,
        text: input,
      },
      {
        onSuccess(){
          refetchMessages()
        },
        onError(error) {
          console.log(error);
        },
      }
    )
    
    setIsBotProcessing(true)


    handleSubmit(e);

    // here we want to also save user message to our database;


    setActiveChatId(chatId as string);
  };

  // const reloadMessage = (e: React.FormEvent<HTMLFormElement>) => {
  //   try {
  //     console.log("re 1");
  //     handleSubmitInFunction()
  //     console.log("re 2");
  //   } catch (error) {
  //     console.log("error");
  //     console.log(error);
  //   }
  // };

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


  useEffect(() => {
    console.log(`chat chanegd to ${chatId}`);
    console.log(aiMessages);
    setIsBotProcessing(false)
    stop()
    
    
  }, [chatId]);

  const assistantMessages = aiMessages.filter((message) => message.role === ChatRole.assistant);
  const combinedMessages = activeChatId === chatId ? [...dbMessages, ...assistantMessages] : dbMessages;


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

        {/* Display the reload button if there are no assistant messages */}
        {!isLoading && !(combinedMessages.length === 0) && !(combinedMessages[combinedMessages.length-1]?.role === 'assistant') && (
          <div className="flex justify-center mt-3">
            <button
              onClick={() => {
                const lastDbMessage = dbMessages[dbMessages.length - 1];
                if (lastDbMessage) {
                  setIsBotProcessing(true)
                  
                  console.log("append messages");
                  console.log(aiMessages);
                  console.log(lastDbMessage);

                  append(lastDbMessage);

                  console.log(aiMessages);
            
                  reload();
                }
              }
              }
              className="text-blue-500 m-2"
            >
              Reload Message
            </button>
          </div>
          )}

      </AutoScrollContainer>

      {/* Input box */}
      <div className="h-[55px] bg-accent px-2 m-2">
        <form className="w-full h-full flex items-center" onSubmit={handleSubmitInFunction}>
          <input
            className="h-full w-full bg-white border rounded-md p-2"
            placeholder="Say something..."
            value={input}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className={`btn h-full p-2 rounded-lg ${isBotProcessing ? 'bg-red-500 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-700'} text-white ml-2`}
            // disabled={isBotProcessing}
          >
            {isBotProcessing ? (
              <div className="flex items-center">
                <Loader2 className="animate-spin mr-2 text-white" size={16} />
                Stop
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CurrentChat;
