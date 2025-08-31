import { z } from 'zod';

export const DeviceTokenSchema = z.object({
	id: z.number().int(),
	user_id: z.number().int(),
	device_token: z.string().min(1, 'Device token is required'),
	platform: z.string().min(1, 'Platform is required'),
	active: z.boolean(),
	created_at: z.string().optional(),
	last_used: z.string().optional(),
	user: z.object({
		full_name: z.string().min(1, 'User name is required'),
		email: z.email('Email must be valid'),
		avatar_url: z.url('Profile picture must be a valid URL').optional(),
	}),
});

export type DeviceToken = z.infer<typeof DeviceTokenSchema>;
