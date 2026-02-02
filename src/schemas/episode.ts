import { z } from 'zod';

export const EpisodeSchema = z.object({
  id: z.number(),
  name: z.string(),
  air_date: z.string(),
  episode: z.string(),
  characters: z.array(z.string()),
  url: z.string().url(),
  created: z.string(),
});

export type Episode = z.infer<typeof EpisodeSchema>;
