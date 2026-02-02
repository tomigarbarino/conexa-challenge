import axios from 'axios';
import axiosInstance from '@/lib/axios';
import { ApiResponseSchema, type ApiResponse } from '@/schemas/character';

export interface FetchCharactersParams {
  name?: string;
  page?: number;
}

interface CharacterQueryParams {
  page: number;
  name?: string;
}

/**
 * Fetches characters from the Rick & Morty API.
 * Used by both server-side prefetching and client-side React Query.
 */
export async function fetchCharacters({ 
  name = '', 
  page = 1 
}: FetchCharactersParams = {}): Promise<ApiResponse> {
  const trimmedName = name.trim();
  const params: CharacterQueryParams = { page };
  
  if (trimmedName) {
    params.name = trimmedName;
  }

  try {
    const response = await axiosInstance.get('/character', { params });
    return ApiResponseSchema.parse(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
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
}

/**
 * Generates the query key for characters.
 * MUST match exactly between prefetch and useQuery for hydration to work.
 */
export function getCharactersQueryKey(params: FetchCharactersParams = {}) {
  const { name = '', page = 1 } = params;
  return ['characters', { name: name.trim() || '', page }] as const;
}
