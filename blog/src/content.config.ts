import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const postSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  category: z.string().min(1),
  categories: z
    .union([z.array(z.string()), z.string().transform((value) => [value])])
    .default([]),
  tags: z.array(z.string()).min(1),
  summary: z.string().min(1).max(220),
  description: z.string().optional(),
  draft: z.boolean().default(false),
  updated: z.coerce.date().optional(),
  canonical: z.url().optional(),
  sourcePath: z.string().optional(),
  sourceModified: z.coerce.date().optional(),
  generator: z.string().optional(),
});

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.pub.{md,mdx}',
    base: './content',
    generateId: ({ entry }) => entry.replace(/\\/g, '/').replace(/\.(md|mdx)$/, ''),
  }),
  schema: postSchema,
});

const notebooks = defineCollection({
  loader: glob({
    pattern: '**/*.pub.md',
    base: './src/content/generated',
    generateId: ({ entry }) => entry.replace(/\\/g, '/').replace(/\.md$/, ''),
  }),
  schema: postSchema,
});

export const collections = { posts, notebooks };
