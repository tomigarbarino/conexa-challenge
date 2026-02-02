import { describe, it, expect } from 'vitest';
import { normalizeEpisodeResponse, extractIdsFromUrls } from '@/lib/adapters';

describe('Adapters', () => {
  describe('normalizeEpisodeResponse', () => {
    const validEpisode = {
      id: 1,
      name: 'Pilot',
      air_date: 'December 2, 2013',
      episode: 'S01E01',
      characters: ['https://rickandmortyapi.com/api/character/1'],
      url: 'https://rickandmortyapi.com/api/episode/1',
      created: '2017-11-10T12:56:33.798Z',
    };

    it('should return array when given an array', () => {
      const result = normalizeEpisodeResponse([validEpisode]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should wrap single object in array', () => {
      const result = normalizeEpisodeResponse(validEpisode);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Pilot');
    });

    it('should throw on invalid data', () => {
      expect(() => normalizeEpisodeResponse({ invalid: 'data' })).toThrow();
    });

    it('should handle multiple episodes', () => {
      const episode2 = { ...validEpisode, id: 2, name: 'Lawnmower Dog' };
      const result = normalizeEpisodeResponse([validEpisode, episode2]);
      expect(result).toHaveLength(2);
    });
  });

  describe('extractIdsFromUrls', () => {
    it('should extract numeric IDs from URLs', () => {
      const urls = [
        'https://rickandmortyapi.com/api/episode/1',
        'https://rickandmortyapi.com/api/episode/2',
        'https://rickandmortyapi.com/api/episode/3',
      ];
      const result = extractIdsFromUrls(urls);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return empty array for empty input', () => {
      const result = extractIdsFromUrls([]);
      expect(result).toEqual([]);
    });

    it('should filter out invalid URLs', () => {
      const urls = [
        'https://rickandmortyapi.com/api/episode/1',
        'https://rickandmortyapi.com/api/episode/invalid',
        'https://rickandmortyapi.com/api/episode/3',
      ];
      const result = extractIdsFromUrls(urls);
      expect(result).toEqual([1, 3]);
    });

    it('should handle different URL formats', () => {
      const urls = [
        'https://example.com/42',
        'https://api.example.com/items/100',
      ];
      const result = extractIdsFromUrls(urls);
      expect(result).toEqual([42, 100]);
    });
  });
});
