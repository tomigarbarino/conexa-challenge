import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { fetchCharacters, getCharactersQueryKey } from '@/features/characters/api/fetchCharacters';
import { ComparatorLayout } from '@/components/layout/ComparatorLayout';

function ComparatorSkeleton() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: getCharactersQueryKey({ name: '', page: 1 }),
    queryFn: () => fetchCharacters({ name: '', page: 1 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ComparatorSkeleton />}>
        <ComparatorLayout />
      </Suspense>
    </HydrationBoundary>
  );
}
