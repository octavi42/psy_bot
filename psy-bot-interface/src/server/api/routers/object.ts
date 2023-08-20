import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const objectsRouter = createTRPCRouter({
  
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.objects.findMany();
  }),

  createChatObject: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        transcription: z.string(),
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
