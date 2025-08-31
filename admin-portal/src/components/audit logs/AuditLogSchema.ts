import { z } from 'zod';

export const RbacAuditLogSchema = z.object({
	id: z.number().int(),
	action: z.string().min(1, 'Action is required'),
	entity_type: z.string().min(1, 'Entity type is required'),
	entity_id: z.number().int(),
	old_values: z.any().nullable().optional(),
	new_values: z.any().nullable().optional(),
	performed_by: z.number().int(),
	performed_at: z.string(),
	severity: z.string().default('info'),
	user: z.object({
		name: z.string().min(1, 'Name is required'),
		email: z.email('Email must be valid'),
		avatar: z.url('Avatar must be a valid URL').optional(),
	}),
});

export type RbacAuditLog = z.infer<typeof RbacAuditLogSchema>;
