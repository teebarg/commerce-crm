import { defaultShouldDehydrateQuery, QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { type TRPCClientError } from "@trpc/client";
import SuperJSON from "superjson";
import { signOut } from "next-auth/react";

function handleUnauthorizedError(error: unknown) {
    if (typeof window === "undefined") return;

    const pathname = window.location.pathname;
    // Don't redirect if already on auth pages
    if (pathname.startsWith("/auth/")) return;

    const maybe = error as Partial<TRPCClientError<any>> & {
        data?: { code?: string };
    } & {
        shape?: { data?: { code?: string } };
    };

    const code = maybe?.data?.code ?? maybe?.shape?.data?.code;

    if (code === "UNAUTHORIZED") {
        console.log("UNAUTHORIZED error detected, signing out...");

        signOut({
            callbackUrl: `/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`,
            redirect: true,
        }).catch((err) => {
            console.error("Error during signOut:", err);
            // Fallback to direct redirect if signOut fails
            window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`;
        });
    }
}

export const createQueryClient = () =>
    new QueryClient({
        queryCache: new QueryCache({
            onError: (error) => {
                console.error("Query error:", error);
                handleUnauthorizedError(error);
            },
        }),
        mutationCache: new MutationCache({
            onError: (error) => {
                console.error("Mutation error:", error);
                handleUnauthorizedError(error);
            },
        }),
        defaultOptions: {
            queries: {
                // With SSR, we usually want to set some default staleTime
                // above 0 to avoid refetching immediately on the client
                staleTime: 30 * 1000,
                // Don't retry on auth errors
                retry: (failureCount, error: any) => {
                    const maybe = error as Partial<TRPCClientError<any>> & {
                        data?: { code?: string };
                    } & {
                        shape?: { data?: { code?: string } };
                    };

                    const code = maybe?.data?.code ?? maybe?.shape?.data?.code;

                    // Don't retry UNAUTHORIZED or FORBIDDEN errors
                    if (code === "UNAUTHORIZED" || code === "FORBIDDEN") {
                        return false;
                    }

                    return failureCount < 3;
                },
                // Prevent refetch on window focus for auth-sensitive queries
                refetchOnWindowFocus: false,
            },
            mutations: {
                // Don't retry mutations by default
                retry: false,
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
