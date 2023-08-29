import { HTTPMethod, fetcher } from "~/lib/fetcher";

import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

type Message = {
  role: string;
  content: string;
};

export async function POST(req: Request) {
  const { messages, chatId } = (await req.json()) as {
    messages: Message[];
    chatId: string;
  };

  const latestUserMessage = messages[messages.length - 1] as Message;
  const userPrompt = latestUserMessage.content;

  const context = await fetcher<{
    data: {
      data: string;
      timeframe: string;
      yt_id: string;
    }[];
  }>("search", HTTPMethod.POST, false, {
    search_query: userPrompt,
    // chat_id: chatId,
  });

  
  console.log(context.data);
  
  // const contextText = context.data.map((item) => item.data).join(" ");

  const contextText = context.data.map((item) => {
    return `${item.data} (video: ${buildYouTubeURL(item.yt_id)}) (timeframe = [${item.timeframe}])`; // Add the timeframe in square brackets
  }).join(" ");

  console.log("context");
  console.log(contextText);

  const promptWithContext = getPromptWithContext(userPrompt, contextText);

  // update the messages with the prompt with context
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  messages[messages.length - 1]!.content = promptWithContext;

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    stream: true,
    max_tokens: 2250,
    messages: messages as ChatCompletionRequestMessage[],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}

const getPromptWithContext = (userPrompt: string, context: string) => {
  return `Considering the following context: ${context}, answer the following prompt: ${userPrompt} making refereces to the context I gave you, include the youtube video link and timeframe of if it exists one. If you don't know the answer, type "I don't find anything useful for this question related to the data.`;
};

function buildYouTubeURL(videoId: string): string {
  const baseURL = "https://www.youtube.com/watch?v=";
  return baseURL + videoId;
}