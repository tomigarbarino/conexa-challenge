import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useComparisonStore } from '@/store/comparison.store';
import { Episode } from '@/schemas/episode';
import { normalizeEpisodeResponse, extractIdsFromUrls } from '@/lib/adapters';

interface EpisodeColumns {
  left: Episode[];
  middle: Episode[];
  right: Episode[];
}

interface UseEpisodeComparisonResult {
  columns: EpisodeColumns;
  isLoading: boolean;
  error: Error | null;
}

export function useEpisodeComparison(compareKey: number | null = null): UseEpisodeComparisonResult {
  const selectedCharA = useComparisonStore(state => state.selectedCharA);
  const selectedCharB = useComparisonStore(state => state.selectedCharB);

  const idsA = useMemo(
    () => new Set(selectedCharA ? extractIdsFromUrls(selectedCharA.episode) : []),
    [selectedCharA]
  );

  const idsB = useMemo(
    () => new Set(selectedCharB ? extractIdsFromUrls(selectedCharB.episode) : []),
    [selectedCharB]
  );

  const allUniqueIds = useMemo(() => {
    return Array.from(new Set([...idsA, ...idsB]));
  }, [idsA, idsB]);

  const { data: episodes, isLoading, error } = useQuery({
    queryKey: ['episodes-bulk', allUniqueIds.sort((a, b) => a - b).join(','), compareKey],
    queryFn: async () => {
      if (allUniqueIds.length === 0) return [];

      const idsParam = allUniqueIds.join(',');
      const response = await axiosInstance.get(`/episode/${idsParam}`);

      return normalizeEpisodeResponse(response.data);
    },
    enabled: allUniqueIds.length > 0 && compareKey !== null,
    staleTime: 1000 * 60 * 15,
  });

  const columns = useMemo<EpisodeColumns>(() => {
    if (!episodes || episodes.length === 0) {
      return { left: [], middle: [], right: [] };
    }

    return {
      left: episodes.filter(ep => idsA.has(ep.id) && !idsB.has(ep.id)),
      middle: episodes.filter(ep => idsA.has(ep.id) && idsB.has(ep.id)),
      right: episodes.filter(ep => idsB.has(ep.id) && !idsA.has(ep.id)),
    };
  }, [episodes, idsA, idsB]);

  return {
    columns,
    isLoading,
    error: error as Error | null,
  };
}
