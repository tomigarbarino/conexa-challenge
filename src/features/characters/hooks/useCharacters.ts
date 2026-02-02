import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { ApiResponseSchema } from '@/schemas/character';

interface UseCharactersParams {
  name?: string;
  page?: number;
}

export function useCharacters({ name, page = 1 }: UseCharactersParams = {}) {
  const trimmedName = name?.trim();
  
  return useQuery({
    queryKey: ['characters', { name: trimmedName || '', page }],
    queryFn: async () => {
      const params: Record<string, any> = { page };
      if (trimmedName) {
        params.name = trimmedName;
      }

      try {
        const response = await axiosInstance.get('/character', { params });
        return ApiResponseSchema.parse(response.data);
      } catch (error: any) {
        // La API de Rick and Morty retorna 404 cuando no hay resultados
        if (error.response?.status === 404) {
          return {
            info: {
              count: 0,
              pages: 0,
              next: null,
              prev: null,
            },
            results: [],
          };
        }
        throw error;
      }
    },
    retry: false, // No reintentar en 404
    staleTime: 1000 * 60 * 10, // 10 minutos
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
