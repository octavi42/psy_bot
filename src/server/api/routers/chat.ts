import { log } from "console";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const chatRouter = createTRPCRouter({
    getAll: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.chat.findMany({
            where: {
                createdByUserId: ctx.session?.user.id,
            }
        });
    }),

    createChat: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { name } = input;

      console.log()
      console.log("ctx.session.user.id", ctx.session);
      console.log()

      return ctx.prisma.chat.create({
        data: {
          name,
          createdByUserId: ctx.session.user.id,
        },
      });
    }),

    getMessages: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      const { chatId } = input;

      return ctx.prisma.messages.findMany({
        where: {
          chatId: chatId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
});