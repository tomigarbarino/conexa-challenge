import { z } from 'zod';

export const CharacterSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(['Alive', 'Dead', 'unknown']),
  species: z.string(),
  type: z.string().nullable(),
  gender: z.enum(['Female', 'Male', 'Genderless', 'unknown']),
  origin: z.object({
    name: z.string(),
    url: z.string(),
  }),
  location: z.object({
    name: z.string(),
    url: z.string(),
  }),
  image: z.string().url(),
  episode: z.array(z.string()),
  url: z.string().url(),
  created: z.string(),
});

export const ApiResponseSchema = z.object({
  info: z.object({
    count: z.number(),
    pages: z.number(),
    next: z.string().url().nullable(),
    prev: z.string().url().nullable(),
  }),
  results: z.array(CharacterSchema),
});

export type Character = z.infer<typeof CharacterSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
