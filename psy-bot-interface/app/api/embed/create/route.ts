import { HTTPMethod, fetcher } from "~/lib/fetcher";

export const runtime = "edge";

type Message = {
  role: string;
  content: string;
};


export async function POST(req: Request) {
    try {
        // Parse the JSON data from the request body
        const { url, match, sender } = await req.json();

        console.log();
        console.log("match route send req:");
        console.log(match);

        // Continue with your code to make the fetch request

        const context = await fetcher<{
            data: {
                data: string;
            }[];
        }>("index-url", HTTPMethod.POST, false, {
            url: url,
            match: match,
            sender: sender,
        });
        
        if (!context) {
            // Handle error here if needed
            return new Response("Error", { status: 500 });
        }

        // Handle the response data as needed
        console.log(context.data);

        return new Response(JSON.stringify(context.data), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        // Handle any exception or error
        console.error(error);
        return new Response("Error", { status: 500 });
    }
}