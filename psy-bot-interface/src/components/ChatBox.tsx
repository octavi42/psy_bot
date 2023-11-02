import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useSession } from "next-auth/react";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/router";


interface ChatBoxProps {
    id: string
    name: string
}

const ChatBox = ({ id, name }: ChatBoxProps) => {
    const { toast } = useToast()
    const { data: sessionData } = useSession();
    const router = useRouter();
    const deleteChatMutation = api.chat.deleteChat.useMutation();
    

    const { refetch: refetchChats } = api.chat.getAll.useQuery(
        undefined,
        { enabled: sessionData?.user !== undefined }
    );

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
        <div
            key={id}
            className=" rounded-md h-16 flex justify-between items-center hover:bg-gray-200 transition ease-in-out delay-150 cursor-pointer"
            onClick={() => handleSelectChat(id)} // Call handleSelectChat on click
        >
            <p className="m-4">{name}</p>
            <Button
            variant="ghost"
            className="hover:bg-red-400 m-4"
            onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling to the parent div
                handleDeleteChat(id);
            }}
            >
            Delete
            </Button>
        </div>
    )
}

export default ChatBox;