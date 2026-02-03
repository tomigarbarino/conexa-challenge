import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchCharacters } from '../api/fetchCharacters';

interface UseInfiniteCharactersParams {
  name?: string;
}

/**
 * Infinite scroll hook for characters list.
 * Fetches pages progressively as user scrolls.
 */
export function useInfiniteCharacters({ name = '' }: UseInfiniteCharactersParams = {}) {
  const trimmedName = name.trim();

  return useInfiniteQuery({
    queryKey: ['characters', 'infinite', { name: trimmedName }],
    queryFn: ({ pageParam }) => fetchCharacters({ name: trimmedName, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.info.next) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    retry: false,
    staleTime: 1000 * 60 * 10,
  });
}
