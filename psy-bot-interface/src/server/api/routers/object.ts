import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const objectsRouter = createTRPCRouter({
  
    getAll: protectedProcedure.query( async ({ ctx }) => {
      return await ctx.prisma.objects.findMany();
    }),

    createChatObject: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          transcription: z.string().optional(),
          fileType: z.string(),
        })
      )
      .mutation(({ ctx, input }) => {
        const { id, title, description, transcription, fileType } = input;

        return ctx.prisma.objects.create({
          data: {
              id: id,
              createdByUserId: ctx.session.user.id,
              title: title,
              description: description,
              transcription: transcription,
              type: fileType,
          },
        });
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
