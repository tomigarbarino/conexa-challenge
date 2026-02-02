import { Episode, EpisodeSchema } from '@/schemas/episode';
import { z } from 'zod';

export function normalizeEpisodeResponse(data: unknown): Episode[] {
  if (Array.isArray(data)) {
    return z.array(EpisodeSchema).parse(data);
  }
  return [EpisodeSchema.parse(data)];
}

export function extractIdsFromUrls(urls: string[]): number[] {
  return urls
    .map(url => Number(url.split('/').pop()))
    .filter(id => !isNaN(id));
}
