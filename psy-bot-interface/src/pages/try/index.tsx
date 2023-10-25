'use client'

import { Message } from "ai";
import React, { useEffect, useState } from "react";
import StoredChat from "~/components/StoredChat";
import Script from 'next/script';
import dynamic from "next/dynamic";

const MAX_MESSAGE_AGE_MS = 24 * 60 * 60 * 1000; // Max age of messages: 24 hours


const TryBot = () => {

const [isClient, setIsClient] = useState(false);

const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {

    if (isClient) {
      localStorage.setItem("messages", JSON.stringify(messages));
    }
  }, [messages]);
  

useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
    }

    setIsClient(true);
}, []);

  return (
    <div>
      {/* Pass the array of messages to the StoredChat component */}
      <button
        onClick={() => {
          const newMessage = {
            content: "hello",
            role: "user",
          } as Message;
          setMessages([...messages, newMessage]);
        }}
      >
        Add Message
      </button>
      <StoredChat initialMessages={messages} setMessages={setMessages}/>
    </div>
  );
};

export default TryBot;