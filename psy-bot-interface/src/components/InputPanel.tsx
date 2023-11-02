import { UseChatHelpers } from "ai/react/dist";
import React from "react";
import { api } from "~/utils/api";
import { ChatRole } from "@prisma/client";
import { Message } from "ai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {SendButtonStyle, StopButtonStyle} from "./InputStyleButton"

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
        
        {!isLoading ? (
            <SendButtonStyle />  
          ) : (
            <StopButtonStyle />
          )}

          </Button>
      </form>
    </div>
  );
}
