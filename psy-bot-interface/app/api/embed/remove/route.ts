import { HTTPMethod, fetcher } from "~/lib/fetcher";

export const runtime = "edge";

type ContextType = {
    status: string,
    message: string
    // other properties as needed
};


export async function POST(req: Request) {
    try {
        // Parse the JSON data from the request body
        const { ...requestParams } = await req.json();

        console.log("params: ", requestParams);
        // console.log("user: ", user);

        // Continue with your code to make the fetch request

        const context: ContextType = await fetcher<ContextType>("delete-object", HTTPMethod.POST, false, requestParams);

        if (!context) {
            // Handle error here if needed
            return new Response("Error", { status: 500 });
        }

        // Handle the response data as needed
        console.log(context);

        return new Response(JSON.stringify(context.message), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        // Handle any exception or error
        console.error(error);
        return new Response("Error", { status: 500 });
    }
}