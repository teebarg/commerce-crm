import { defaultShouldDehydrateQuery, QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { type TRPCClientError } from "@trpc/client";
import SuperJSON from "superjson";

function redirectToSignInIfUnauthorized(error: unknown) {
    if (typeof window === "undefined") return;
    const pathname = window.location.pathname;
    if (pathname.startsWith("/auth/signin")) return;
    const maybe = error as Partial<TRPCClientError<any>> & { data?: { code?: string } } & { shape?: { data?: { code?: string } } };
    const code = maybe?.data?.code ?? maybe?.shape?.data?.code;
    if (code === "UNAUTHORIZED") {
        const callbackUrl = encodeURIComponent(window.location.href);
        window.location.href = `/auth/signin?callbackUrl=${callbackUrl}`;
    }
}

export const createQueryClient = () =>
    new QueryClient({
        queryCache: new QueryCache({ onError: redirectToSignInIfUnauthorized }),
        mutationCache: new MutationCache({ onError: redirectToSignInIfUnauthorized }),
        defaultOptions: {
            queries: {
                // With SSR, we usually want to set some default staleTime
                // above 0 to avoid refetching immediately on the client
                staleTime: 30 * 1000,
            },
            dehydrate: {
                serializeData: SuperJSON.serialize,
                shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending",
            },
            hydrate: {
                deserializeData: SuperJSON.deserialize,
            },
        },
    });
