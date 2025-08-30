import { z } from 'zod';

export const jobPostingSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().min(1).max(255),
	department_id: z.number().int().positive(),
	department_name: z.string().max(100),
	location: z.string(),
	employment_type: z.string(),
	content: z.string(),
	salary_range: z.string().nullable().optional(),
	start_date: z.iso.datetime(),
	end_date: z.iso.datetime(),
	show_case: z.boolean().default(false),
	published: z.boolean().default(false),
	published_at: z.iso.datetime().nullable().optional(),
	updated_by: z.number().int().positive(),
	created_by: z.number().int().positive(),
	deleted_by: z.number().int().positive().nullable().optional(),
	deleted_at: z.iso.datetime().nullable().optional(),
	updated_at: z.iso.datetime(),
	created_at: z.iso.datetime(),

	number_of_applicants: z.number().int().positive().default(0),
});

export type JobPosting = z.infer<typeof jobPostingSchema>;

export const jobPostingFormSchema = z.object({
	title: z.string().min(3, 'Job title must be at least 3 characters'),
	departmentId: z.number().int().positive({
		message: 'Department is required',
	}),
	location: z.string().min(2, 'Location is required'),
	employmentType: z.enum([
		'full_time',
		'part_time',
		'contract',
		'internship',
	]),
	content: z
		.string()
		.min(10, 'Job description must be at least 10 characters'),
	salaryRange: z.string().optional(),
	startDate: z.string().datetime({ message: 'Invalid start date' }),
	endDate: z.string().datetime({ message: 'Invalid end date' }),
	showCase: z.boolean().default(false),
	published: z.boolean().default(false),
});

export type JobPostingFormType = z.infer<typeof jobPostingFormSchema>;
