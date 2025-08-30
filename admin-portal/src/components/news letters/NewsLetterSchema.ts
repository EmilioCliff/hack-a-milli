import { z } from 'zod';

export const NewsLetterSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().max(255),
	author: z.string().max(100),
	description: z.string(),
	downloads: z.number().int().default(0),
	file_size: z.number().int(),
	storage_path: z.string(),
	pdf_url: z.url(),
	date: z.iso.datetime(),
	published: z.boolean().default(false),
	published_at: z.iso.datetime().nullable(),
});

export type NewsLetter = z.infer<typeof NewsLetterSchema>;
