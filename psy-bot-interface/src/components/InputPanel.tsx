import { UseChatHelpers } from "ai/react/dist";
import React from "react";
import { Loader2 } from "lucide-react";
import { api } from "~/utils/api";
import { ChatRole } from "@prisma/client";
import { Message } from "ai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface InputPanelProps
    extends Pick<
    UseChatHelpers,
        | 'append'
        | 'isLoading'
        | 'reload'
        | 'messages'
        | 'stop'
        | 'input'
        | 'setInput'
        | 'chatId'
        | 'setMessages'
    > {
    id?: string
}


export function InputPanel({
    id,
    isLoading,
    stop,
    append,
    reload,
    input,
    setInput,
    messages,
    chatId,
    setMessages
}: InputPanelProps) {

    const { mutate: saveChatMessage } = api.chat.saveChatMessage.useMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setInput("");

        e.preventDefault();
        e.stopPropagation();

        if (isLoading) {
            stop();
            return;
        }
    
        if (!input.trim()) {
          return;
        }

        if (!chatId) {
          const message = {
            content: input,
            role: 'user',
          } as Message;

          const existingArray = JSON.parse(localStorage.getItem("messages") || "[]");
          existingArray.push(message);
          localStorage.setItem("messages", JSON.stringify(existingArray));

          // console.log(message);
          
          

          setMessages([...messages, message]);

          await append({
            content: input,
            role: 'user',
          });
        } else {
          saveChatMessage(
            {
              chatId: chatId as string,
              role: "user",
              text: input as string,
            },
            {
              onError(error) {
                console.log(error);
              },
            }
          );

          await append({
            id,
            content: input,
            role: 'user',
          });
        }
      };

  return (
    <div className="h-[55px] bg-accent px-2 m-2 bg-white">
      <form
        className="w-full h-full flex items-center"
        onSubmit={handleSubmit}
      >
        {/* add a cinditional rendering to the input box depending if the last message from the db is from the bot */}

        {/* { messages[messages.length - 1]?.role === "user" ? (
          <Input
            className="h-full w-full"
            placeholder="Say something..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
            }}
          />
        ) : (
          <Button variant={"link"} onClick={async () => {
            await append({
              id,
              content: messages[messages.length - 1]?.content as string,
              role: 'user',
            });
            reload
          }} className="w-full">reload</Button>
        )} */}


          <Input
            className="h-full w-full"
            placeholder="Say something..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
            }}
          />

        {/* <Button
          type="submit"
          variant="outline"
          className={`className="relative inline-flex items-center justify-center inline-block p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group" ${
            isLoading ? "bg-red-500 hover:bg-red-700 text-white" : 
            "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 focus:animate-pulse"
          } ml-2 hover:text-white`}

          
          
          // disabled={isLoading}
        >
          

          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="animate-spin mr-2 text-white" size={16} />
              Stop
            </div>
          ) : (
            'Submit'
          )}
        </Button> */}


        <Button 
          className={`h-full m-2" ${
            isLoading ? "relative inline-flex items-center justify-center  p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group" : 
            "relative inline-flex items-center justify-center  p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group"
          } ml-2 hover:text-white`}>
        
        {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="z-10 animate-spin mr-2 text-white" size={16} />
              <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-red-500 rounded-full blur-md ease"></span>
              <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
              <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-red-600 rounded-full blur-md"></span>
              <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-red-800 rounded-full blur-md"></span>
              </span>
              <span className="relative text-white">Stop</span>
            </div>
          ) : (
            <>
              <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-blue-500 rounded-full blur-md ease"></span>
              <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
              <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-blue-600 rounded-full blur-md"></span>
              <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-blue-800 rounded-full blur-md"></span>
              </span>
              <span className="relative text-white">Send</span>
            </>
          )}

          </Button>
      </form>
    </div>
  );
}
