import { z } from 'zod';

export const BlogSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().max(255),
	author: z.string(),
	cover_img: z.string(),
	topic: z.string().max(100),
	description: z.string(),
	content: z.string(),
	views: z.number().int().nonnegative().default(0),
	min_read: z.number().int().positive(),
	published: z.boolean().default(false),
	published_at: z.iso.datetime().nullable(),
});

export type Blog = z.infer<typeof BlogSchema>;

export const BlogFormSchema = z.object({
	title: z.string().min(3).max(255),
	author: z.number().int().positive(),
	cover_img: z.url('Cover image must be a valid URL'),
	topic: z.string().min(2).max(100),
	description: z.string().min(10),
	content: z.string().min(20),
	min_read: z.number().int().positive(),
	published: z.boolean().optional(),
	published_at: z.iso.datetime().optional().nullable(),
});

export type BlogForm = z.infer<typeof BlogFormSchema>;
