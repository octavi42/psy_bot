import { OpenAIStream, StreamingTextResponse } from "ai";
import { Readable } from "stream";

export async function POST(req: Request) {
  const message = `This is a predefined text response. It will be streamed progressively.`;

  // Function to send a message in steps
  const sendMessageInSteps = async (message: string) => {
    // Split the message into smaller parts (you can adjust the size)
    const messageParts = message.match(/.{1,50}/g) || [];

    for (const part of messageParts) {
      // Create a ReadableStream for the current part
      const textEncoder = new TextEncoder();
      const messageUint8 = textEncoder.encode(part);
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(messageUint8);
          controller.close();
        },
      });

      // Send the part of the message
      const response = new StreamingTextResponse(stream);
      await sendResponse(response);

      // Introduce a delay between parts (adjust the time as needed)
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
    }
  };

  // Function to simulate sending a response (replace this with your actual sending logic)
  const sendResponse = async (response: StreamingTextResponse) => {
    console.log('Sending response:', response);
    // Replace this with your code to send the response
  };

  // Call sendMessageInSteps with your message
  await sendMessageInSteps(message);

  // You can return a response here if needed
  return new Response("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.");
}
