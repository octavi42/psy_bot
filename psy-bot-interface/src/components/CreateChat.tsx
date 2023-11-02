import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/utils/api";

const CreateChat = () => {
    const { toast } = useToast()
    const { data: sessionData } = useSession();
    const [chatName, setChatName] = useState<string>("");

    const { refetch: refetchChats } = api.chat.getAll.useQuery(
        undefined,
        { enabled: sessionData?.user !== undefined }
    );

    const createChatMutation = api.chat.createChat.useMutation({  
        onSuccess: () => {
            console.log("success");
            refetchChats();
        },
        onError: (error) => {
            console.log("error");
            toast({
                variant: "destructive",
                title: "Error creating a new Chat",
                description: error + "",
            })
        },
        onMutate: () => {
            throw new Error("err");
        }
    });

    const createChat = () => {
        try {
        createChatMutation.mutate({
            name: chatName, // Use the chatName state for the chat name
        });
        setChatName(""); // Clear the chat name input
        } catch {
        console.log("ajdshgkjsa");
        }
    };


    return (
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
    )
}

export default CreateChat;