import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import axiosInstance from '@/lib/axios';
import { useComparisonStore } from '@/store/comparison.store';
import { EpisodeSchema, Episode } from '@/schemas/episode';
import { intersection, difference, union } from '@/features/episodes/utils/set-ops';

/**
 * Extrae IDs numéricos de las URLs de episodios
 * Ejemplo: "https://rickandmortyapi.com/api/episode/1" → 1
 */
function extractEpisodeIds(episodeUrls: string[]): number[] {
  return episodeUrls
    .map(url => {
      const match = url.match(/\/episode\/(\d+)$/);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((id): id is number => id !== null);
}

interface EpisodeColumns {
  left: Episode[];   // Solo Personaje A
  middle: Episode[]; // Compartidos
  right: Episode[];  // Solo Personaje B
}

interface UseEpisodeComparisonResult {
  columns: EpisodeColumns;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook optimizado que hace UN SOLO request para todos los episodios
 * y calcula las diferencias/intersecciones en memoria
 * @param compareKey - Número para trigger manual (null = no comparar)
 */
export function useEpisodeComparison(compareKey: number | null = null): UseEpisodeComparisonResult {
  const selectedCharA = useComparisonStore(state => state.selectedCharA);
  const selectedCharB = useComparisonStore(state => state.selectedCharB);

  // Extraer IDs de episodios
  const idsA = useMemo(
    () => selectedCharA ? extractEpisodeIds(selectedCharA.episode) : [],
    [selectedCharA]
  );

  const idsB = useMemo(
    () => selectedCharB ? extractEpisodeIds(selectedCharB.episode) : [],
    [selectedCharB]
  );

  // Calcular todos los IDs únicos para hacer UN SOLO request
  const allUniqueIds = useMemo(() => union(idsA, idsB), [idsA, idsB]);

  // Calcular grupos de IDs (antes del fetch)
  const idGroups = useMemo(() => ({
    onlyA: difference(idsA, idsB),
    shared: intersection(idsA, idsB),
    onlyB: difference(idsB, idsA),
  }), [idsA, idsB]);

  // Fetch bulk de episodios (UN SOLO REQUEST) - Solo cuando compareKey no es null
  const { data: episodes, isLoading, error } = useQuery({
    queryKey: ['episodes-bulk', allUniqueIds.sort().join(','), compareKey],
    queryFn: async () => {
      if (allUniqueIds.length === 0) return [];

      // API soporta múltiples IDs: /episode/1,2,3
      const idsParam = allUniqueIds.join(',');
      const response = await axiosInstance.get(`/episode/${idsParam}`);

      // Si es un solo episodio, la API retorna un objeto, no array
      const data = Array.isArray(response.data) ? response.data : [response.data];
      
      // Validar cada episodio con Zod
      return z.array(EpisodeSchema).parse(data);
    },
    enabled: allUniqueIds.length > 0 && compareKey !== null, // Solo fetch cuando se presiona el botón
    staleTime: 1000 * 60 * 15, // 15 minutos
  });

  // Organizar episodios en columnas según los grupos calculados
  const columns = useMemo<EpisodeColumns>(() => {
    if (!episodes) {
      return { left: [], middle: [], right: [] };
    }

    const episodeMap = new Map(episodes.map(ep => [ep.id, ep]));

    return {
      left: idGroups.onlyA.map(id => episodeMap.get(id)).filter((ep): ep is Episode => !!ep),
      middle: idGroups.shared.map(id => episodeMap.get(id)).filter((ep): ep is Episode => !!ep),
      right: idGroups.onlyB.map(id => episodeMap.get(id)).filter((ep): ep is Episode => !!ep),
    };
  }, [episodes, idGroups]);

  return {
    columns,
    isLoading,
    error: error as Error | null,
  };
}
