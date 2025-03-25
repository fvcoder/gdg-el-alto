import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const people = defineCollection({
  loader: glob({ pattern: "*.json", base: "src/content/people" }),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    networks: z.array(
      z.object({
        provider: z.string(),
        username: z.string(),
        url: z.string().url(),
      }),
    ),
  }),
});

export const collections = { people };
