import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { api } from "~/utils/api";
import ChatList from "./ChatList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label, Separator } from "@radix-ui/react-dropdown-menu";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const UserChats = () => {
  const { data: sessionData } = useSession();

  const { data: chatData, isLoading: isChatLoading, refetch: refetchChats } = api.chat.getAll.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );

  const createChatMutation = api.chat.createChat.useMutation({
    onSuccess: () => {
      refetchChats();
    }
  });

  const [chatName, setChatName] = useState<string>("");

  const createChat = () => {
    try {
      createChatMutation.mutate({
        name: chatName, // Use the chatName state for the chat name
      });
      setChatName(""); // Clear the chat name input
    } catch (error) {
      console.error("Mutation Error:", error);
    }
  };

  const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
  )

  return (
    <div className="justify-items-stretch flex flex-col content-evenly bg-white p-4 rounded-md h-screen ">
      <div className="basis-0">
        <h2 className="text-xl font-semibold mb-4">User Chats</h2>
      </div>

      <div className="basis-auto h-16 flex my-4">
        <Input
          type="text"
          placeholder="Enter chat name"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          className="w-full h-full border p-1 rounded-md focus:outline-none text-center"
        />
        <Button
          onClick={createChat}
          className="ml-2 p-2 h-full"
        >
          Create
        </Button>
      </div>
      {/* <ChatList /> */}

        <ScrollArea className="relative w-full rounded-md border bottom-0 basis-full no-scrollbar">
          <ChatList />
        </ScrollArea>
    </div>


    // <Card className="felx w-full h-screen overflow-hidden">
    //   <CardHeader className="felx-auto">
    //     <CardTitle>Chats</CardTitle>
    //     <CardDescription>Create a new chat</CardDescription>
    //   </CardHeader>
    //   <CardContent className="felx-auto">
    //     <form>
    //       <div className="grid w-full items-center gap-4">
    //         <div className="flex flex-col space-y-1.5">
    //           <Label>Name</Label>
    //           <div className="flex">
    //             <Input id="name" placeholder="Name of your project" />
    //             <Button className="mx-2">Create</Button>
    //           </div>
    //         </div>
    //         <div className="flex flex-col space-y-1.5">
              
    //         </div>
    //       </div>
    //     </form>
    //   </CardContent>
    //   <CardFooter className="felx-1">
    //     <ChatList />
    //   </CardFooter>
    // </Card>
  );
};

export default UserChats;
