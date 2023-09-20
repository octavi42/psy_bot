import { ChatRole } from "@prisma/client";
import { log } from "console";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const chatRouter = createTRPCRouter({
    getChats: protectedProcedure.query(({ ctx }) => {
      return ctx.prisma.chat.findMany({
        where: {
          createdByUserId: ctx.session?.user.id,
        },
      });
    }),

    getAll: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.chat.findMany({
            
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
      return ctx.prisma.chat.create({
        data: {
          name,
          createdByUserId: ctx.session.user.id,
        },
      });
    }),

    deleteChat: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { chatId } = input;

      return ctx.prisma.chat.delete({
        where: {
          id: chatId,
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
          createdAt: "asc",
        },
      });
    }),

    saveChatMessage: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        text: z.string(),
        role: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { chatId, text, role } = input;

      return ctx.prisma.messages.create({
        data: {
          text: text,
          role: role as ChatRole,
          chatId: chatId,
        },
      });
    }),

    deleteChatMessage: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(({ ctx, input }) => {
      const { id } = input

      return ctx.prisma.messages.delete({
        where: {
          id: id as string
        }
      })
    })
});