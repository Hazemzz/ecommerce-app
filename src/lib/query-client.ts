import { QueryClient } from "@tanstack/react-query";

export function getQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: 1,
                staleTime: 1000 * 30,
                refetchOnWindowFocus: false
            }
        }
    });
}
