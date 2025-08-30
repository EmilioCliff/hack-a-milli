import { z } from 'zod';

export const jobApplicationSchema = z.object({
	id: z.number().int().positive(),
	job_id: z.number().int().positive(),
	full_name: z.string().min(1).max(255),
	email: z.email(),
	phone_number: z.string().min(5).max(50),
	cover_letter: z.string(),
	resume_url: z.string(),
	status: z.string(),
	comment: z.string().nullable().optional(),
	submitted_at: z.iso.datetime(),
	updated_by: z.number().int().positive().nullable().optional(),
	updated_at: z.iso.datetime(),
	created_at: z.iso.datetime(),
});

export type JobApplication = z.infer<typeof jobApplicationSchema>;

export const jobApplicationFormSchema = z.object({
	jobId: z.number().int().positive({
		message: 'Job ID is required',
	}),
	fullName: z
		.string()
		.min(2, { message: 'Full name must be at least 2 characters' }),
	email: z.string().email({ message: 'Invalid email address' }),
	phoneNumber: z
		.string()
		.length(10, 'Phone number must be exactly 10 digits')
		.regex(/^\d+$/, 'Phone number must contain only digits'),
	coverLetter: z
		.string()
		.min(20, { message: 'Cover letter must be at least 20 characters' }),
	resumeUrl: z.string().url({ message: 'Resume must be a valid URL' }),
	status: z
		.enum(['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'])
		.default('pending'),
	comment: z.string().optional(),
});

export type JobApplicationFormType = z.infer<typeof jobApplicationFormSchema>;
