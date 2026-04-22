import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum(['Comportamiento', 'Futuro', 'Producción', 'Casos']),
    lang: z.enum(['es', 'en']).default('es'),
    draft: z.boolean().default(false),
  }),
});

const cases = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    client: z.string(),
    industry: z.string(),
    year: z.number(),
    description: z.string(),
    descriptionEn: z.string().optional(),
    slug: z.string(),
    slugEn: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, cases };
