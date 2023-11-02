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
          id: z.string(),
          title: z.string(),
          description: z.string().optional(),
          obj_type: z.string(),
          
          object: z.record(z.unknown()),
        })
      )

      .mutation(async ({ ctx, input }) => {

        const { id, title, description, obj_type, object } = input;


        // if (obj_type === "Youtube") {
          const createdSpecificObject = await ctx.prisma.youtube_Object.create({
            data: {
              youtube_id: object.youtube_id as string
            },
          });

          const createdSpecificRelationalObject = await ctx.prisma.specific_Object.create({
            data: {
              youtube_object_id: createdSpecificObject.id,
              type: obj_type as Object_Type,
            }
          });

          console.log(createdSpecificRelationalObject);
        // }

        if (createdSpecificRelationalObject === undefined) {
          return
        }

        const createdObject = await ctx.prisma.object.create({
          data: {
            id: id,
            title: title,
            description: description,
            saved_status: "Sending data for processing",
            createdByUserId: ctx.session.user.id,
            specific_object_id: createdSpecificRelationalObject.id as string,

            // add a condition that determins on witch object to create

            // Other attributes here
          },
        });
    
        console.log("Attributes and values of actualObject:");
        // for (const key of Object.keys(object)) {
        //   console.log(`${key}: ${object[key]}`);
        // }
    
        // Your mutation logic here
    
        return createdObject;
      }),


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