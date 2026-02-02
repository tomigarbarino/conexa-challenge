import { QueryClient, isServer } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Returns the appropriate QueryClient based on environment.
 * - Server: Creates a new instance per request (avoids sharing state between users)
 * - Client: Returns a singleton (persists cache across navigations)
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

// Legacy export for backwards compatibility with QueryProvider
export const queryClient = getQueryClient();
