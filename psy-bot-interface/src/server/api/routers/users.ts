import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { UserRole, SaveState } from '@prisma/client';
import { type } from "os";

export const usersRouter = createTRPCRouter({

    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            if (!(ctx.session.user.role as UserRole)) {
                throw new Error("Failed to get the role");
            }
      
            if (ctx.session.user.role !== UserRole.admin) {
                throw new Error("Not admin");
            }
        
            const users = await ctx.prisma.user.findMany();

            const returnUsers = users.map((user) => {
                return {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    image: user.image,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            })
        
            return returnUsers;
        }),
        

    getById: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { id } = input;

            const user = await ctx.prisma.user.findUnique({
                where: {
                    id: id
                }
            });

            if (!user) throw new Error("User not found");

            const returnUser = {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email,
                emailVerified: user.emailVerified,
                image: user.image,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }

            return returnUser;
        })
});
