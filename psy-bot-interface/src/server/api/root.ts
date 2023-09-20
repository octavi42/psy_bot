import { exampleRouter } from "~/server/api/routers/example";
import { chatRouter } from "~/server/api/routers/chat";
import { objectsRouter } from "~/server/api/routers/object";
import { createTRPCRouter } from "~/server/api/trpc";
import { object } from "zod";
import { saveStateRouter } from "./routers/save_state";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  chat: chatRouter,
  object: objectsRouter,
  saveState: saveStateRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
