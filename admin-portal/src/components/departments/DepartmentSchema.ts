import { z } from 'zod';

export const DepartmentSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().min(1, 'Department name is required'),
	description: z.string().max(500).optional(),
	staff_count: z.number().int().nonnegative().default(0),
	status: z.string().default('active'),
});

export const DepartmentFormSchema = z.object({
	name: z.string().min(1, 'Department name is required'),
});

export type Department = z.infer<typeof DepartmentSchema>;
export type DepartmentForm = z.infer<typeof DepartmentFormSchema>;
