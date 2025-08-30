import { z } from 'zod';

export const registrarSchema = z.object({
	id: z.number().int().positive(),
	email: z.email().max(50),
	name: z.string().min(1).max(100),
	logo_url: z.url(),
	address: z.string().min(1),
	status: z.string().default('active'),
	specialities: z.array(z.string()).default([]),
	phone_number: z.string().min(7).max(50),
	website_url: z.url(),
	updated_by: z.number().int().positive(),
	created_by: z.number().int().positive(),
	deleted_by: z.number().int().nullable().optional(),
	deleted_at: z.iso.datetime().nullable().optional(),
	updated_at: z.iso.datetime(),
	created_at: z.iso.datetime(),
});

export type Registrar = z.infer<typeof registrarSchema>;

export const registrarFormSchema = z.object({
	email: z.email('Invalid email address').max(50),
	name: z.string().min(2, 'Name is too short').max(100),
	status: z.string().default('active'),
	logo_url: z.string().url('Must be a valid URL'),
	address: z.string().min(5, 'Address is too short'),
	specialities: z.array(z.string()).optional(),
	phone_number: z
		.string()
		.min(7, 'Phone number is too short')
		.max(50, 'Phone number too long'),
	website_url: z.string().url('Must be a valid website URL'),
});
export type RegistrarFormInput = z.infer<typeof registrarFormSchema>;
