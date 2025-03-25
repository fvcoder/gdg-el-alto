import { glob } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";

const people = defineCollection({
  loader: glob({ pattern: "*.json", base: "src/content/people" }),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    image: z.string(),
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
    location: reference("location"),
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

const schedule = defineCollection({
  loader: glob({ pattern: "*.json", base: "src/content/schedule" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    stageId: reference("stage"),
    eventId: reference("event"),
    speakers: z.array(reference("people")),
    startDate: z.string(),
    endDate: z.string().optional(),
  }),
});

const location = defineCollection({
  loader: glob({ pattern: "*.json", base: "src/content/location" }),
  schema: z.object({
    name: z.string(),
    direction: z.string(),
    image: z.string(),
    url: z.string().url().optional(),
  }),
});

const stage = defineCollection({
  loader: glob({ pattern: "*.json", base: "src/content/stage" }),
  schema: z.object({
    name: z.string(),
  }),
});

export const collections = { people, event, schedule, location, stage };
