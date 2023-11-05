import { error } from "console";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Object_Type } from "@prisma/client";

export const objectsRouter = createTRPCRouter({
  
  getAll: protectedProcedure
    // .input(
    //   z
    //     .object({
    //       filter: z.string().optional(),
    //       user: z.string().optional(),
    //     })
    //     .nullish(),
    // )
    .query(async ({ ctx, input }) => {

      console.log("3323");
      
      
      // const { filter, user } = input || { filter: "", user: "" };

      // if (!filter) return error("No filter provided");

      // let userByNames: any[] = [];
      // let result = [];

      // if (user) { userByNames = await findUserByName(user, ctx) }

      // if (!userByNames) { result = await filterResultByUser(filter, userByNames, ctx) }
      // else { result = await filterResult(filter, ctx)}
      
      
      
      // return result

      return ctx.prisma.object.findMany();

    }),

    createObject: protectedProcedure
  .input(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      obj_type: z.string(),
      object: z.record(z.unknown()),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { title, description, obj_type, object } = input;

    try {
      const { specific_obj, specific_obj_id } = await objectSelection(obj_type, ctx);

      const createdSpecificObject = specific_obj.create({
        data: object,
      });

      const createdSpecificRelationalObject = await ctx.prisma.specific_Object.create({
        data: {
          [specific_obj_id]: createdSpecificObject.id,
          type: obj_type as Object_Type,
        },
      });

      if (!createdSpecificRelationalObject) {
        throw new Error("Failed to create specific relational object");
      }

      const createdObject = await ctx.prisma.object.create({
        data: {
          title: title,
          description: description,
          saved_status: "Sending data for processing",
          createdByUserId: ctx.session.user.id,
          specific_object_id: createdSpecificRelationalObject.id as string,
          // add other attributes here
        },
      });

      if (!createdObject) {
        throw new Error("Failed to create the main object");
      }

      console.log("Attributes and values of actualObject:");
      // Iterate and log attributes and values if needed

      console.log("Backend object id:", createdObject.id);

      return createdObject.id;

    } catch (error) {
      console.error("Error creating object:", error);
      throw error; // Rethrow the error to handle it at a higher level if needed
    }
  })
  ,



    createTranscriptionObject: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          transcriptions: z.array(z.string()).optional(),
          uuids: z.array(z.string()).optional()
        })
      )
      .mutation(({ ctx, input }) => {
        const { id, transcriptions, uuids } = input;

        if (!transcriptions || !uuids) {
          throw new Error("Transcriptions not provided");
        }

        for (let i=0; i<transcriptions.length; i++) {
          ctx.prisma.transcriptions.create({
            data: {
              id: uuids[i],
              objectId: id,
              text: transcriptions[i] + '',
            },
          });
        }

        return "Success";
      }),


    changeTranscription: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          transcription: z.string()
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, transcription } = input;
    
        const existingObject = await ctx.prisma.objects.findUnique({
          where: { id },
        });
    
        if (!existingObject) {
          throw new Error(`Object with ID ${id} not found.`);
        }
    
        // Update the transcription field
        const updatedObject = await ctx.prisma.objects.update({
          where: { id },
          data: { transcription: transcription },
        });
    
        return updatedObject;
      }),

    deleteObject: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id } = input;

      return ctx.prisma.objects.delete({
        where: {
            id: id,
        },
      });
    }),
});


async function filterResultByUser(type: string, userByNames?: any, ctx?: any) {
  let result: string | any[] | PromiseLike<any[]> = [];

  for (const userByName of userByNames) {
    const where: any = {
      createdByUserId: userByName.id,
    };

    if (type !== "All") {
      where["type"] = type as any;
    }

    const objects = await ctx.prisma.objects.findMany({
      where: where,
    });

    for (const object of objects) result.push(object);
  }

  return result;
}


async function filterResult(type: string, ctx?: any){
  const where: any = {};

  if (type !== "All") {
    where["type"] = type as any;
  }

  const result = await ctx.prisma.objects.findMany({
    where: where,
  });

  return result
}


async function findUserByName(name: string, ctx: any) {
  const userByNames = await ctx.prisma.user.findMany({
    where: {
      name: {
        contains: name.toLowerCase(),
      },
    },
  });

  return userByNames;
}


async function objectSelection(obj_type: string, ctx: any) {

  let specific_obj: any;
  let specific_obj_id: any;

  switch (obj_type) {
    case "Youtube":
      specific_obj = ctx.prisma.youtube_Object
      specific_obj_id = "youtube_object_id"
      
      break;
      
    case "QA":
      specific_obj = ctx.prisma.qA_Object
      specific_obj_id = "qa_object_id"
      
      break;
      
    case "File":
      specific_obj = ctx.prisma.file_Object   
      specific_obj_id = "file_object_id"

      break;
    
    case "Audio":
      specific_obj = ctx.prisma.audio_Object
      specific_obj_id = "audio_object_id"

      break;

    case "Database":
      specific_obj = ctx.prisma.database_Object
      specific_obj_id = "database_object_id"

      break;
    
    case "About":
      specific_obj = ctx.prisma.about_Object
      specific_obj_id = "about_object_id"

      break;

    default:
      return Promise.reject("None or wrong object type provided");
  }
  
  return {specific_obj, specific_obj_id}

}


// Example usage
const input = {
  id: "123",
  title: "Sample Object",
  description: "A sample object description",
  type: "Sample Type",
  actualObject: {
    attr1: "Value1",
    attr2: "Value2",
    attr3: "Value3",
    // Additional attributes with unknown names and values
  },
};