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

const event = defineCollection({
  loader: glob({ pattern: "*.json", base: "src/content/event" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    image: z.string(),
    sponsors: z.array(
      z.object({
        name: z.string(),
        image: z.string(),
      }),
    ),
    faq: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ),
  }),
});

export const collections = { people, event };
