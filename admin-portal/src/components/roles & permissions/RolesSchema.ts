import { z } from 'zod';

// Resource
export const RbacResourceSchema = z.object({
	id: z.number().int(),
	name: z.string().min(1),
	description: z.string().min(1),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});
export type RbacResource = z.infer<typeof RbacResourceSchema>;

// Action
export const RbacActionSchema = z.object({
	id: z.number().int(),
	name: z.string().min(1),
	description: z.string().min(1),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});
export type RbacAction = z.infer<typeof RbacActionSchema>;

// Role
export const RbacRoleSchema = z.object({
	id: z.number().int(),
	name: z.string().min(1),
	description: z.string().min(1),
	is_system_role: z.boolean(),
	is_active: z.boolean(),
	created_by: z.number().int(),
	updated_by: z.number().int().nullable().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});
export type RbacRole = z.infer<typeof RbacRoleSchema>;

// Permission
export const RbacPermissionSchema = z.object({
	id: z.number().int(),
	resource_id: z.number().int(),
	action_id: z.number().int(),
	description: z.string().min(1),
	created_at: z.string().optional(),
});
export type RbacPermission = z.infer<typeof RbacPermissionSchema>;

// RolePermission
export const RbacRolePermissionSchema = z.object({
	role_id: z.number().int(),
	permission_id: z.number().int(),
	granted_by: z.number().int(),
	granted_at: z.string().optional(),
});
export type RbacRolePermission = z.infer<typeof RbacRolePermissionSchema>;
