import { z } from 'zod';

export const NewsUpdateSchema = z.object({
	id: z.number().int(),
	title: z.string().max(255),
	topic: z.string().max(255),
	author: z.string().max(100),
	date: z.string(),
	min_read: z.number().int().nonnegative(),
	excerpt: z.string(),
	content: z.string(),
	cover_img: z.url(),
	published: z.boolean().optional(),
	published_at: z.iso.date().optional().nullable(),
});

export type NewsUpdate = z.infer<typeof NewsUpdateSchema>;

export const NewsUpdateFormSchema = z.object({
	title: z.string().min(1, 'Title is required').max(255),
	topic: z.string().min(1, 'Topic is required').max(255),
	date: z.preprocess(
		(arg) =>
			typeof arg === 'string' || arg instanceof Date
				? new Date(arg)
				: arg,
		z.date(),
	),
	min_read: z
		.number()
		.int()
		.nonnegative('Minimum read time must be positive'),
	excerpt: z.string().min(1, 'Excerpt is required'),
	content: z.string().min(1, 'Content is required'),
	cover_img: z.url('Cover image must be a valid URL'),
	published: z.boolean().optional(),
});
