import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { draftRouter } from "@/server/api/routers/draft";
import { userRouter } from "@/server/api/routers/user";
import { pushNotificationRouter } from "@/server/api/routers/push";
import { orderRouter } from "@/server/api/routers/order";
import { productRouter } from "@/server/api/routers/product";
import { categoryRouter } from "@/server/api/routers/category";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    draft: draftRouter,
    user: userRouter,
    push: pushNotificationRouter,
    order: orderRouter,
    product: productRouter,
    category: categoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
