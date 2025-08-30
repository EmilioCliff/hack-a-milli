import { z } from 'zod';

export const userSchema = z.object({
	id: z.number().int().positive(),
	email: z.email(),
	full_name: z.string().min(1).max(100),
	phone_number: z.string().min(5).max(50),
	address: z.string().max(100).nullable(),
	password_hash: z.string(),
	role: z.array(z.string()),
	department_id: z.number().int().positive().nullable(),
	department_name: z.string().max(100).nullable(),
	active: z.boolean().default(true),
	account_verified: z.boolean().default(false),
	multifactor_authentication: z.boolean().default(false),
	refresh_token: z.string().default(''),
	last_login: z.iso.datetime().nullable().optional(),
	avatar_url: z.url().nullable().default(''),
	updated_by: z.number().int().positive().nullable().optional(),
	created_by: z.number().int().positive(),
	updated_at: z.iso.datetime(),
	created_at: z.iso.datetime(),
});

export type User = z.infer<typeof userSchema>;

export const userFormSchema = z
	.object({
		fullName: z
			.string()
			.min(2, { message: 'Full name must be at least 2 characters' }),
		phoneNumber: z
			.string()
			.length(10, 'Phone number must be exactly 10 digits')
			.regex(/^\d+$/, 'Phone number must contain only digits'),
		email: z.email({ message: 'Invalid email address' }),
		address: z.string().max(100).optional(),
		departmentId: z.number().int().positive().optional(),
		role: z.enum(['guest', 'staff', 'admin']), // single-select for forms, array at DB-level
		password: z
			.string()
			.min(6, { message: 'Password must be at least 6 characters' }),
		confirmPassword: z.string().min(6),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Passwords do not match',
	});

export type UserFormType = z.infer<typeof userFormSchema>;
