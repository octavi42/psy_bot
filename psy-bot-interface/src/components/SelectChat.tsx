import React from "react";

interface Chat {
  id: string;
  name: string;
}

interface SelectChatModalProps {
  chats: Chat[];
  onClose: () => void;
  onSelect: (chatId: string) => void;
}

const SelectChatModal = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">Select a Chat</h2>
      </div>
    </div>
  );
};

export default SelectChatModal;
