import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { UserRole, SaveState } from '@prisma/client';
import { type } from "os";

export const saveStateRouter = createTRPCRouter({

    getState: protectedProcedure
        .query(async ({ ctx }) => {
            if (!ctx.session.user) {
                throw new Error("Unauthorized");
            }
      
            if (!(ctx.session.user.role as UserRole)) {
                throw new Error("Failed to get the role");
            }
      
            if ((ctx.session.user.role !== UserRole.admin) && (ctx.session.user.role !== UserRole.contributor)) {
                throw new Error("Not admin or contributor");
            }
        
            const process = await ctx.prisma.savingProcess.findUnique({
                where: { userId: ctx.session.user.id },
            });
        
            return process;
        }),

    createState: protectedProcedure
        .mutation(async ({ ctx }) => {

            if (!ctx.session.user) {
                throw new Error("Unauthorized");
            }
      
            if ((ctx.session.user.role !== UserRole.admin) && (ctx.session.user.role !== UserRole.contributor)) {
                throw new Error("Not admin or contributor");
            }
        
            const createdProcess = await ctx.prisma.savingProcess.create({
                data: { userId: ctx.session.user.id },
            });
        
            return createdProcess;
        }),

    changeState: protectedProcedure
        .input(
            z.object({
                state: z.string(),
                message: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // assign the state of type string or SaveState
            const { message, state } = input;

            if (!ctx.session.user) {
                throw new Error("Unauthorized");
            }

            if (!(ctx.session.user.role as UserRole)) {
                throw new Error("Failed to get the role");
            }
      
            if ((ctx.session.user.role !== UserRole.admin) && (ctx.session.user.role !== UserRole.contributor)) {
                throw new Error("Not admin or contributor");
            }
        
            // Update the transcription field
            const updatedObject = await ctx.prisma.savingProcess.update({
              where: { userId: ctx.session.user.id },
              data: { state: state as SaveState, message: message },
            });
        
            return updatedObject;
          }),
          
});
