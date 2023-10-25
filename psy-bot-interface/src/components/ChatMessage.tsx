import React from "react";
import { ChatRole } from "@prisma/client";
import { type Message } from "ai/react";

interface ChatMessageProps {
    message: Message;
}

function ChatMessage({ message }: ChatMessageProps) {
    const { content, id, role } = message;
    const messageClassName = role !== ChatRole.assistant ? "bg-accent left-0" : "bg-white right-0";
    

    const urlRegex = /https:\/\/www\.youtube\.com\/watch\?v=[^\s&]+(&t=\d+)?/g;

    // Process the content to handle YouTube links
    const messageContentWithLinks = (typeof content === "string" ? content : "").replace(
        urlRegex,
        (url) =>
            `<a href="${url}" target="_blank" style="color: CornflowerBlue;">Youtube link</a>`
    );

    return (
        <div
            key={id}
            className={`${messageClassName} my-2 flex w-full flex-row items-center gap-3 rounded-md border border-gray-200 p-2`}
        >
            <div className="flex flex-col">
                <h1
                    className={`font-semibold ${
                        role === ChatRole.assistant ? "text-blue-500" : "text-green-500"
                    }`}
                >
                    {role === ChatRole.assistant ? "Assistant" : "You"}
                </h1>
                <p
                    className="text-sm text-gray-700"
                    dangerouslySetInnerHTML={{
                        __html: messageContentWithLinks,
                    }}
                ></p>
            </div>
        </div>
    );
}

export default ChatMessage;
