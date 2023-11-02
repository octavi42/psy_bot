import { Chat } from "@prisma/client";
import { api } from "~/utils/api";

interface ChatLabelProps {
    chatId: string
}

const ChatLabel = ( {chatId}: ChatLabelProps) => {
    
    const { data: chatsData } = api.chat.getChats.useQuery();
    const selectedChat = chatsData?.find((chat) => chat.id === chatId) as Chat;

    return (
        <div className="flex flex-row p-4 bg-white border border-gray-100">
            <span className="font-semibold text-gray-800">Selected chat:</span>
            <span className="ml-2 font-bold text-blue-600">
                {selectedChat && selectedChat.name}
            </span>
        </div>
    )

}

export default ChatLabel