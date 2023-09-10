import { HTTPMethod, fetcher } from "~/lib/fetcher";

export async function POST(req: Request) {
    try {
        // Parse the JSON data from the request body
        const { endpoint, ...requestParams } = await req.json();

        console.log();
        console.log("match route send req:");
        console.log(endpoint);

        // Determine the specific logic based on the "endpoint" parameter
        let responseData;
        switch (endpoint) {
            case "index-file":
                responseData = await handleIndexFileRequest(requestParams);
                break;
            case "index-url":
                responseData = await handleIndexUrlRequest(requestParams);
                break;
            case "index-qa":
                responseData = await handleIndexQARequest(requestParams);
                break;
            case "index-about":
                responseData = await handleIndexAboutRequest(requestParams);
                break;
            default:
                // Handle unknown endpoint here if needed
                return new Response("Unknown endpoint", { status: 400 });
        }

        // Continue with your code to make the fetch request
        const context = await fetcher<{
            data: {
                data: string;
            }[];
        }>(endpoint, HTTPMethod.POST, false, responseData.requestData);
        
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


// Define a type or interface for request parameters
interface RequestParams {
    match: string;
    sender: string;
    file?: string; // Optional property for index-file
    url?: string; // Optional property for index-url
    question?: string; // Optional properties for index-qa
    answer?: string;
    category?: string;
    about?: string; // Optional properties for index-about
    data?: string;
}

async function handleIndexFileRequest(requestParams: RequestParams) {
    // Implement logic to handle "index-file" request here
    // Example: { url, match, sender, file }
    // You can access the request parameters using requestParams
    const { url, match, sender, file } = requestParams;

    // Implement your logic here and return the response data
    // For example:
    const responseData: Record<string, any> = {
        message: "Handling 'index-file' request",
        requestData: {
            url,
            match,
            sender,
            file,
        },
    };

    return responseData;
}

async function handleIndexUrlRequest(requestParams: RequestParams) {
    // Implement logic to handle "index-url" request here
    // Example: { url, match, sender }
    // You can access the request parameters using requestParams
    const { url, match, sender } = requestParams;
    
    // Implement your logic here and return the response data
    // For example:
    const responseData: Record<string, any> = {
        message: "Handling 'index-url' request",
        requestData: {
            url,
            match,
            sender,
        },
    };
    
    return responseData;
}

async function handleIndexQARequest(requestParams: RequestParams) {
    // Implement logic to handle "index-qa" request here
    // Example: { url, match, sender, question, answer, category }
    // You can access the request parameters using requestParams
    const { url, match, sender, question, answer, category } = requestParams;
    
    // Implement your logic here and return the response data
    // For example:
    const responseData: Record<string, any> = {
        message: "Handling 'index-qa' request",
        requestData: {
            url,
            match,
            sender,
            question,
            answer,
            category,
        },
    };
    
    return responseData;
}

async function handleIndexAboutRequest(requestParams: RequestParams) {
    // Implement logic to handle "index-about" request here
    // Example: { url, match, sender, about, data }
    // You can access the request parameters using requestParams
    const { url, match, sender, about, data } = requestParams;
    
    // Implement your logic here and return the response data
    // For example:
    const responseData: Record<string, any> = {
        message: "Handling 'index-about' request",
        requestData: {
            url,
            match,
            sender,
            about,
            data,
        },
    };
    
    return responseData;
}