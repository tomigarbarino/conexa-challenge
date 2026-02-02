import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useEpisodeComparison } from '@/features/episodes/hooks/useEpisodeComparison';
import { useComparisonStore } from '@/store/comparison.store';
import axiosInstance from '@/lib/axios';
import { Character } from '@/schemas/character';

vi.mock('@/lib/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockCharacterA: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: null,
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Earth', url: '' },
  image: 'https://example.com/rick.png',
  episode: [
    'https://rickandmortyapi.com/api/episode/1',
    'https://rickandmortyapi.com/api/episode/2',
    'https://rickandmortyapi.com/api/episode/3',
  ],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z',
};

const mockCharacterB: Character = {
  id: 2,
  name: 'Morty Smith',
  status: 'Alive',
  species: 'Human',
  type: null,
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Earth', url: '' },
  image: 'https://example.com/morty.png',
  episode: [
    'https://rickandmortyapi.com/api/episode/2',
    'https://rickandmortyapi.com/api/episode/3',
    'https://rickandmortyapi.com/api/episode/4',
  ],
  url: 'https://rickandmortyapi.com/api/character/2',
  created: '2017-11-04T18:50:21.651Z',
};

const mockEpisodes = [
  { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01', characters: [], url: 'https://rickandmortyapi.com/api/episode/1', created: '' },
  { id: 2, name: 'Lawnmower Dog', air_date: 'December 9, 2013', episode: 'S01E02', characters: [], url: 'https://rickandmortyapi.com/api/episode/2', created: '' },
  { id: 3, name: 'Anatomy Park', air_date: 'December 16, 2013', episode: 'S01E03', characters: [], url: 'https://rickandmortyapi.com/api/episode/3', created: '' },
  { id: 4, name: 'M. Night Shaym-Aliens!', air_date: 'January 13, 2014', episode: 'S01E04', characters: [], url: 'https://rickandmortyapi.com/api/episode/4', created: '' },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe('useEpisodeComparison', () => {
  beforeEach(() => {
    useComparisonStore.setState({
      selectedCharA: null,
      selectedCharB: null,
    });
    vi.mocked(axiosInstance.get).mockReset();
  });

  it('should return empty columns when no characters selected', () => {
    const { result } = renderHook(() => useEpisodeComparison(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.columns).toEqual({
      left: [],
      middle: [],
      right: [],
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('should return empty columns when compareKey is null', () => {
    useComparisonStore.setState({
      selectedCharA: mockCharacterA,
      selectedCharB: mockCharacterB,
    });

    const { result } = renderHook(() => useEpisodeComparison(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.columns).toEqual({
      left: [],
      middle: [],
      right: [],
    });
  });

  it('should categorize episodes correctly into left, middle, right', async () => {
    useComparisonStore.setState({
      selectedCharA: mockCharacterA,
      selectedCharB: mockCharacterB,
    });

    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: mockEpisodes,
    });

    const { result } = renderHook(() => useEpisodeComparison(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.columns.left).toHaveLength(1);
    expect(result.current.columns.left[0].id).toBe(1);

    expect(result.current.columns.middle).toHaveLength(2);
    expect(result.current.columns.middle.map(e => e.id)).toEqual([2, 3]);

    expect(result.current.columns.right).toHaveLength(1);
    expect(result.current.columns.right[0].id).toBe(4);
  });

  it('should call API with correct episode IDs', async () => {
    useComparisonStore.setState({
      selectedCharA: mockCharacterA,
      selectedCharB: mockCharacterB,
    });

    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: mockEpisodes,
    });

    renderHook(() => useEpisodeComparison(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalled();
    });

    const callUrl = vi.mocked(axiosInstance.get).mock.calls[0][0];
    expect(callUrl).toContain('/episode/');
    expect(callUrl).toMatch(/1.*2.*3.*4|1,2,3,4/);
  });

  it('should handle API returning single episode object', async () => {
    const singleCharacter: Character = {
      ...mockCharacterA,
      episode: ['https://rickandmortyapi.com/api/episode/1'],
    };

    useComparisonStore.setState({
      selectedCharA: singleCharacter,
      selectedCharB: { ...mockCharacterB, episode: [] },
    });

    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: mockEpisodes[0],
    });

    const { result } = renderHook(() => useEpisodeComparison(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.columns.left).toHaveLength(1);
  });

  it('should handle API errors gracefully', async () => {
    useComparisonStore.setState({
      selectedCharA: mockCharacterA,
      selectedCharB: mockCharacterB,
    });

    vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useEpisodeComparison(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.error?.message).toBe('Network error');
  });
});
