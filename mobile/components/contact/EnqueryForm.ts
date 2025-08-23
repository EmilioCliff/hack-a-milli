import { z } from 'zod';

export const EnqueryFormSchema = z.object({
	first_name: z.string({ message: 'First name is required' }),
	last_name: z.string({ message: 'Last name is required' }),
	email: z.email({ message: 'Invalid email address' }),
	subject: z.string({ message: 'Subject is required' }),
	message: z.string({ message: 'Message is required' }),
});

export type EnqueryFormType = z.infer<typeof EnqueryFormSchema>;
