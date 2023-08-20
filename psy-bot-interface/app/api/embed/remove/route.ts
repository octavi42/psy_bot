import { HTTPMethod, fetcher } from "~/lib/fetcher";

export const runtime = "edge";

type Message = {
  role: string;
  content: string;
};


export async function POST(req: Request) {
    try {
        // Parse the JSON data from the request body
        const { match } = await req.json();

        console.log("match: ", match);
        // console.log("user: ", user);

        // Continue with your code to make the fetch request

        const context = await fetcher<{
            data: {
                data: string;
            }[];
        }>("delete-object", HTTPMethod.POST, false, {
            id: match,
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