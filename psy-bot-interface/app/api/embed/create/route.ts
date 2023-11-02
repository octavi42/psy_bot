import { HTTPMethod, fetcher } from "~/lib/fetcher";
import { PrismaClient, SaveState } from "@prisma/client";
import { objectsRouter } from "./../../../../src/server/api/routers/object"
import { AppRouter, appRouter } from "~/server/api/root";
import { TRPCError, initTRPC } from "@trpc/server";
import { createTRPCContext } from "~/server/api/trpc";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

const prisma = new PrismaClient();

type ContextType = {
  data: Array<string>;
  uuids: Array<string>;
  fileType: string;
  yt_id: string;
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

    let savedObject;

  try {
    console.log("the catched data:");
    console.log(classId);
    console.log(endpoint);
    console.log(requestParams);
    

    // Parse the JSON data from the request body

    // await updateProcessStateInDatabase(userId, "saving", "Saving...");

    // Continue with your code to make the fetch request
    const context: ContextType = await fetcher<ContextType>(endpoint, HTTPMethod.POST, false, requestParams);


    

    if (!context) {
        await updateProcessStateInDatabase(userId, "saved", "Failed to fetch data from external service");
      return new Response("Error: Failed to fetch data from external service", { status: 500 });
    }

    // Save the object to the database
    savedObject = await saveObjectToDatabase(requestParams.match, context, userId, title, description);

    // Handle database save errors
    // if (!savedObject) {

    //     // Delete the object from another service
    //     const deleteResult = await deleteObjectFromService(requestParams.match, classId);

    //     if (deleteResult.status === "success") {
    //         await updateProcessStateInDatabase(userId, "saved", "Failed to save object to the database");
    //     return new Response(
    //         JSON.stringify({ savedObject, message: "Successfully deleted from the external service" }),
    //         { status: 200, headers: { "Content-Type": "application/json" } }
    //     );
    //     } else {
    //         await updateProcessStateInDatabase(userId, "saved", "Failed to save object to the database");
    //     // Handle deletion errors
    //     return new Response(
    //         JSON.stringify({ savedObject, message: "Error deleting from the external service" }),
    //         { status: 501, headers: { "Content-Type": "application/json" } }
    //     );
    //     }
    // }

  } catch (error) {
    // Handle any exception or error
    // await updateProcessStateInDatabase(userId, "saved", "Internal server error");
    // console.error(error);
    // return new Response("Error: Internal server error", { status: 500 });
  }

  // await updateProcessStateInDatabase(userId, "saved", "Success!");

  return new Response(JSON.stringify({ savedObject, message: "Success!" }), { status: 200, headers: { "Content-Type": "application/json" } })
}

async function saveObjectToDatabase(match: string, context: ContextType, userId: string, title: string, description: string) {

  // type Context = {
  //   user?: {
  //     id: string;
  //   };
  // };
  
  // const t = initTRPC.context<Context>().create();

  // const isAuthed = t.middleware((opts) => {
  //   const { ctx } = opts;
  //   if (!ctx.user) {
  //     throw new TRPCError({
  //       code: 'UNAUTHORIZED',
  //       message: 'You are not authorized',
  //     });
  //   }
   
  //   return opts.next({
  //     ctx: {
  //       // Infers that the `user` is non-nullable
  //       user: ctx.user,
  //     },
  //   });
  // });

  // const protectedProcedure = t.procedure.use(isAuthed);


  const objectClient = createTRPCProxyClient({
    links: [
      httpBatchLink({
        url: "http://localhost:3000/api/trpc",
      })
    ],
    transformer: undefined,
  });


  // const t = initTRPC.create()
  // const router = t.router({
  //   secret: protectedProcedure.query((opts) => opts.ctx.user),
  //   objects: objectsRouter,
  // });

  // const authorizedCaller = router.createCaller({
  //   user: {
  //     id: userId,
  //   },
  // });
  // const result = await authorizedCaller.secret();

  // console.log("result:");
  // console.log(result);

  try {
    
    console.log("chg");
    
    

    // const result = ();

    const object = await objectClient.object.getAll.query()

    console.log("saved obj 2:");
    console.log(object);
    

    // const savedObject = await prisma.object.create({
    //   data: {
    //     id: match,
    //     createdByUserId: userId,
    //     title: title,
    //     description: description,
    //     youtube_id: context.yt_id,
    //     type: context.fileType,
    //   },
    // });


    // 


    // const transcriptions = context.data;
    // const uuids = context.uuids;

    // if (!transcriptions || !uuids) {
    //   throw new Error("Transcriptions not provided");
    // }

    // for (let i=0; i<transcriptions.length; i++) {
    //   const savedTranscription = await prisma.transcriptions.create({
    //     data: {
    //       id: uuids[i],
    //       objectId: match,
    //       text: transcriptions[i] + '',
    //     },
    //   });

    //   if (!savedTranscription) {
    //     throw new Error("Failed to save transcription to the database");
    //   }
    // }

    // return savedObject;
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
