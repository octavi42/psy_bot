import { UseChatHelpers } from "ai/react/dist";
import React from "react";
import { Loader2 } from "lucide-react";
import { api } from "~/utils/api";
import { ChatRole } from "@prisma/client";
import { Message } from "ai";

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

          console.log("11111");

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
    <div>
    <div className="h-[55px] bg-accent px-2 m-2">
      <form
        className="w-full h-full flex items-center"
        onSubmit={handleSubmit}
      >
        <input
          className="h-full w-full bg-white border rounded-md p-2"
          placeholder="Say something..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
          }}
        />
        <button
          type="submit"
          className={`btn h-full p-2 rounded-lg ${
            isLoading ? "bg-red-500 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-700"
          } text-white ml-2`}
        //   disabled={isLoading}
        >
          {isLoading ? (
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
}
