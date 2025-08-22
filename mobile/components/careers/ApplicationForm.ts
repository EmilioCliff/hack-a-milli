import { z } from 'zod';

export const ApplicationFormSchema = z.object({
	full_name: z.string({ message: 'Full name is required' }),
	email: z.email({ message: 'Invalid email address' }),
	phone_number: z
		.string()
		.length(10, 'Phone number must be exactly 10 digits'),
	cover_letter: z.string({ message: 'Cover letter is required' }),
	resume_url: z.string(),
});

export type ApplicationFormType = z.infer<typeof ApplicationFormSchema>;
