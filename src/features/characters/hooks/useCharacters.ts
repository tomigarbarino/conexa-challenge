import { useQuery, keepPreviousData } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { ApiResponseSchema } from '@/schemas/character';
import { fetchCharacters, getCharactersQueryKey } from '../api/fetchCharacters';

interface UseCharactersParams {
  name?: string;
  page?: number;
}

export function useCharacters({ name = '', page = 1 }: UseCharactersParams = {}) {
  return useQuery({
    queryKey: getCharactersQueryKey({ name, page }),
    queryFn: () => fetchCharacters({ name, page }),
    retry: false,
    staleTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
  });
}

export function useCharacterById(id: number) {
  return useQuery({
    queryKey: ['characters', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/character/${id}`);
      return ApiResponseSchema.shape.results.element.parse(response.data);
    },
    enabled: !!id,
  });
}
