import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const contentSchema = ({ image }) =>
	z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.optional(image()),
		tags: z.array(z.string()).optional(),
	});

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: contentSchema,
});

const patterns = defineCollection({
	loader: glob({ base: './src/content/patterns', pattern: '**/*.{md,mdx}' }),
	schema: contentSchema,
});

const tools = defineCollection({
	loader: glob({ base: './src/content/tools', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).optional(),
			category: z.string(),
			url: z.string().optional(),
		}),
});

const guides = defineCollection({
	loader: glob({ base: './src/content/guides', pattern: '**/*.{md,mdx}' }),
	schema: contentSchema,
});

export const collections = { blog, patterns, tools, guides };
