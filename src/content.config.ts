import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    brief: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    metaDescription: z.string().optional(),
    coverImage: z.string().nullable().optional(),
    coverWidth: z.number().int().positive().optional(),
    coverHeight: z.number().int().positive().optional(),
    readTimeInMinutes: z.number().int().nonnegative(),
    tags: z.array(z.string()).default([]),
    ctaHeadline: z.string().optional(),
    service: z.enum(["aws-serverless", "agentic-ai", "fractional-cto", "cloud-optimization"]).optional(),
  }),
});

export const collections = { blog };
