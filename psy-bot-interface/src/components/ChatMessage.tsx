import React from "react";
import { ChatRole } from "@prisma/client";
import { type Message } from "ai/react";

interface ChatMessageProps {
    message: Message;
}

function ChatMessage({ message }: ChatMessageProps) {
    const { content, id, role } = message;
    const messageClassName = role !== ChatRole.assistant ? "bg-accent" : "bg-white";
    

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
            className={`${messageClassName} my-2 flex w-full flex-row items-center gap-3 rounded-md border p-2 shadow-md`}
        >
            <div className="flex flex-col">
                <h1
                    className={`font-semibold ${
                        role === ChatRole.assistant ? "text-blue-600" : "text-green-600"
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
