import { HTTPMethod, fetcher } from "~/lib/fetcher";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        // Parse the JSON data from the request body
        const { userId, title, description, endpoint, ...requestParams } = await req.json();

        type ContextType = {
              data: string;
              uuid: string;
              fileType: string;
              // other properties as needed
          };

        // Continue with your code to make the fetch request
        const context: ContextType = await fetcher<ContextType>(endpoint, HTTPMethod.POST, false, requestParams);
        
        if (!context) {
            // Handle error here if needed
            return new Response("Error", { status: 500 });
        }          


        const savedObject = await prisma.objects.create({
            data: {
                // set the id to the context uuid
                id: context.uuid,
                createdByUserId: userId,
                title: title,
                description: description,
                transcription: context.data,
                type: context.fileType,
            },
          });

          console.log("savedObject: " + JSON.stringify(savedObject));

        return new Response(JSON.stringify(context), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        // Handle any exception or error
        console.error(error);
        return new Response("Error", { status: 500 });
    }
}