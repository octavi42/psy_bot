import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const objectsRouter = createTRPCRouter({
  
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.objects.findMany();
  }),

  createChatObject: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        transcription: z.string(),
        fileType: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { title, description, transcription, fileType } = input;

      return ctx.prisma.objects.create({
        data: {
            title: title,
            description: description,
            transcription: transcription,
            type: fileType,
        },
      });
    }),
});
