import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router"; // Import useRouter
import React from "react";
import { api } from "~/utils/api";
import { Input } from "./ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { SelectContent, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const ChatList = () => {
  const { data: sessionData } = useSession();
  const router = useRouter(); // Initialize the router

  const { data: chatData, isLoading: isChatLoading, refetch: refetchChats } = api.chat.getAll.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );

  const deleteChatMutation = api.chat.deleteChat.useMutation();

  const { toast } = useToast()

  const handleDeleteChat = (chatId: string) => {
    try {
      deleteChatMutation.mutate({ chatId }, {
        onSuccess: () => {
          refetchChats();
        }
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again" onClick={() => {handleDeleteChat}}>Try again</ToastAction>,
      })
      console.error("Mutation Error:", error);
    }
  };

  const handleSelectChat = (chatId: string) => {
    // Programmatically navigate to the selected chat URL
    router.push(`/chats/${chatId}`);
  };

  return (
      
    <div className="p-4">
        {chatData?.map((chat) => (
          <>
            <div
              key={chat.id}
              className=" rounded-md h-16 flex justify-between items-center hover:bg-gray-200 transition ease-in-out delay-150 cursor-pointer"
              onClick={() => handleSelectChat(chat.id)} // Call handleSelectChat on click
            >
              <p className="m-4">{chat.name}</p>
              <Button
                variant="ghost"
                className="hover:bg-red-400 m-4"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event from bubbling to the parent div
                  handleDeleteChat(chat.id);
                }}
              >
                Delete
              </Button>
            </div>
            <Separator className="m-1 bg-transparent" />
          </>
          ))}
      </div>

  );
};

export default ChatList;
