import { QueryClient } from "@tanstack/react-query";

// usage:    https://tanstack.com/query/v4/docs/framework/react/quick-start
// defaults: https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults

/**
 * Global React Query client.
 * */
export const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // defalt: true
      retry: 3, // default: 3
      staleTime: 1000 * 60 * 8, // default: 1000 * 60 * 5
      refetchOnMount: true, // default: true
      refetchOnReconnect: true, // default: true
      refetchInterval: false, // or a time in milliseconds for polling | defalt: false
      refetchIntervalInBackground: false, // Continue polling in background | default: false
      gcTime: 1000 * 60 * 60 * 24, // Time until inactive cache data is deleted from memory | default: 1000 * 60 * 60 * 24
      /*queryFn: async () => {
        // Default fetch/query function if needed
      },*/
    },
  },
});
