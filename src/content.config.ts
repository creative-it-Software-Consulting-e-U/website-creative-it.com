import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    brief: z.string(),
    publishedAt: z.date(),
    coverImage: z.string().url().nullable().optional(),
    readTimeInMinutes: z.number().int().nonnegative(),
    tags: z.array(z.string()).default([]),
    ctaHeadline: z.string().optional(),
    service: z.enum(["aws-serverless", "agentic-ai", "fractional-cto", "cloud-optimization"]).optional(),
  }),
});

export const collections = { blog };
