import { z } from 'zod';

export const CompanyDocSchema = z.object({
	id: z.number().int().optional(),
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	content: z.string().min(1, 'Content is required'),
	is_public: z.boolean().default(false),
	status: z.string().default('draft'),
	min_read: z.number().int().nonnegative().default(0),
	created_at: z.string(),
	updated_at: z.string().optional(),
	deleted_at: z.string().nullable().optional(),
});

export type CompanyDoc = z.infer<typeof CompanyDocSchema>;

export const CompanyDocFormSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	content: z.string().min(1, 'Content is required'),
	description: z.string().optional(),
	type: z.string(),
	size: z.number().int().nonnegative().optional(),
	is_public: z.boolean().default(false),
	status: z.enum(['draft', 'published', 'archived']).default('draft'),
	word_count: z.number().int().nonnegative().default(0),
});

export type CompanyDocForm = z.infer<typeof CompanyDocFormSchema>;
