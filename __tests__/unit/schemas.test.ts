import { describe, it, expect } from 'vitest';
import { EpisodeSchema, EpisodesResponseSchema } from '@/schemas/episode';
import { CharacterSchema, ApiResponseSchema } from '@/schemas/character';

describe('Zod Schemas', () => {
  describe('EpisodeSchema', () => {
    const validEpisode = {
      id: 1,
      name: 'Pilot',
      air_date: 'December 2, 2013',
      episode: 'S01E01',
      characters: ['https://rickandmortyapi.com/api/character/1'],
      url: 'https://rickandmortyapi.com/api/episode/1',
      created: '2017-11-10T12:56:33.798Z',
    };

    it('should parse valid episode', () => {
      const result = EpisodeSchema.safeParse(validEpisode);
      expect(result.success).toBe(true);
    });

    it('should fail on missing id', () => {
      const episodeWithoutId = {
        name: validEpisode.name,
        air_date: validEpisode.air_date,
        episode: validEpisode.episode,
        characters: validEpisode.characters,
        url: validEpisode.url,
        created: validEpisode.created,
      };
      const result = EpisodeSchema.safeParse(episodeWithoutId);
      expect(result.success).toBe(false);
    });

    it('should fail on invalid url', () => {
      const invalid = { ...validEpisode, url: 'not-a-url' };
      const result = EpisodeSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should fail on wrong type for characters', () => {
      const invalid = { ...validEpisode, characters: 'not-an-array' };
      const result = EpisodeSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('EpisodesResponseSchema', () => {
    const validEpisode = {
      id: 1,
      name: 'Pilot',
      air_date: 'December 2, 2013',
      episode: 'S01E01',
      characters: [],
      url: 'https://rickandmortyapi.com/api/episode/1',
      created: '2017-11-10T12:56:33.798Z',
    };

    it('should normalize single object to array', () => {
      const result = EpisodesResponseSchema.parse(validEpisode);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    it('should keep array as array', () => {
      const result = EpisodesResponseSchema.parse([validEpisode, validEpisode]);
      expect(result).toHaveLength(2);
    });
  });

  describe('CharacterSchema', () => {
    const validCharacter = {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive' as const,
      species: 'Human',
      type: null,
      gender: 'Male' as const,
      origin: {
        name: 'Earth (C-137)',
        url: 'https://rickandmortyapi.com/api/location/1',
      },
      location: {
        name: 'Citadel of Ricks',
        url: 'https://rickandmortyapi.com/api/location/3',
      },
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      episode: ['https://rickandmortyapi.com/api/episode/1'],
      url: 'https://rickandmortyapi.com/api/character/1',
      created: '2017-11-04T18:48:46.250Z',
    };

    it('should parse valid character', () => {
      const result = CharacterSchema.safeParse(validCharacter);
      expect(result.success).toBe(true);
    });

    it('should fail on invalid status', () => {
      const invalid = { ...validCharacter, status: 'Invalid' };
      const result = CharacterSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should fail on invalid gender', () => {
      const invalid = { ...validCharacter, gender: 'Invalid' };
      const result = CharacterSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should accept all valid status values', () => {
      expect(CharacterSchema.safeParse({ ...validCharacter, status: 'Alive' }).success).toBe(true);
      expect(CharacterSchema.safeParse({ ...validCharacter, status: 'Dead' }).success).toBe(true);
      expect(CharacterSchema.safeParse({ ...validCharacter, status: 'unknown' }).success).toBe(true);
    });
  });

  describe('ApiResponseSchema', () => {
    it('should parse valid API response', () => {
      const validResponse = {
        info: {
          count: 826,
          pages: 42,
          next: 'https://rickandmortyapi.com/api/character?page=2',
          prev: null,
        },
        results: [],
      };
      const result = ApiResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });

    it('should fail on missing info', () => {
      const invalid = { results: [] };
      const result = ApiResponseSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
