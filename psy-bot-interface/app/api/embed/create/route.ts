import { HTTPMethod, fetcher } from "~/lib/fetcher";
import { PrismaClient, SaveState } from "@prisma/client";

const prisma = new PrismaClient();

type ContextType = {
  data: string;
  uuid: string;
  fileType: string;
  // other properties as needed
};

type DeleteReqData = {
  id: string;
  class: string;
  sender: string;
};

type DeleteResponse = {
  status: string;
  message: string;
};

export async function POST(req: Request) {
    
    const { classId, userId, title, description, endpoint, ...requestParams } = await req.json();
    
  try {
    // Parse the JSON data from the request body

    await updateProcessStateInDatabase(userId, "saving", "Saving...");

    // Continue with your code to make the fetch request
    const context: ContextType = await fetcher<ContextType>(endpoint, HTTPMethod.POST, false, requestParams);

    if (!context) {
        await updateProcessStateInDatabase(userId, "saved", "Failed to fetch data from external service");
      return new Response("Error: Failed to fetch data from external service", { status: 500 });
    }

    // Save the object to the database
    const savedObject = await saveObjectToDatabase(context, userId, title, description);

    // Handle database save errors
    if (!savedObject) {

        // Delete the object from another service
        const deleteResult = await deleteObjectFromService(context.uuid, classId);

        if (deleteResult.status === "success") {
            await updateProcessStateInDatabase(userId, "saved", "Failed to save object to the database");
        return new Response(
            JSON.stringify({ savedObject, message: "Successfully deleted from the external service" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
        } else {
            await updateProcessStateInDatabase(userId, "saved", "Failed to save object to the database");
        // Handle deletion errors
        return new Response(
            JSON.stringify({ savedObject, message: "Error deleting from the external service" }),
            { status: 501, headers: { "Content-Type": "application/json" } }
        );
        }
    }

  } catch (error) {
    // Handle any exception or error
    await updateProcessStateInDatabase(userId, "saved", "Internal server error");
    console.error(error);
    return new Response("Error: Internal server error", { status: 500 });
  }
}

async function saveObjectToDatabase(context: ContextType, userId: string, title: string, description: string) {
  try {
    const savedObject = await prisma.objects.create({
      data: {
        id: context.uuid,
        createdByUserId: userId,
        title: title,
        description: description,
        transcription: context.data,
        type: context.fileType,
      },
    });

    return savedObject;
  } catch (error) {
    console.error("Error saving to the database:", error);
    return null;
  }
}

async function updateProcessStateInDatabase(uuid: string, state: string, message: string) {
  try {
    // Update the process state in the database
    await prisma.savingProcess.update({
      where: { userId: uuid },
      data: { state: state as SaveState, message: message },
    });
  } catch (error) {
    console.error("Error updating process state in the database:", error);
  }
}

async function deleteObjectFromService(uuid: string, classId: string): Promise<DeleteResponse> {
  const requestData: DeleteReqData = {
    id: uuid,
    class: classId,
    sender: "null",
  };

  try {
    const deleteContext: DeleteResponse = await fetcher<DeleteResponse>("delete-object", HTTPMethod.POST, false, requestData);

    return deleteContext;
  } catch (error) {
    console.error("Error deleting from the external service:", error);
    return { status: "error", message: "Error deleting from the external service" };
  }
}
