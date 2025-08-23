import { z } from 'zod';

export const SubscriptionFormSchema = z.object({
	full_name: z.string({ message: 'Full name is required' }).optional(),
	email: z.email({ message: 'Invalid email address' }),
});

export type SubscriptionFormType = z.infer<typeof SubscriptionFormSchema>;
