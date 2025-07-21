import { createTRPCRouter } from "./Create-context";
import hiRoute from "./Example/Hi/Route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
});

export type AppRouter = typeof appRouter;
