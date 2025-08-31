// import {
// 	RbacResource,
// 	RbacAction,
// 	RbacRole,
// 	RbacPermission,
// 	RbacRolePermission,
// } from '@/components/roles & permissions/RolesSchema';
// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Button } from '@/components/ui/button';

// export const resources: RbacResource[] = [
// 	{ id: 1, name: 'users', description: 'User management' },
// 	{ id: 2, name: 'blogs', description: 'Blog posts management' },
// 	{ id: 3, name: 'events', description: 'Events management' },
// 	{ id: 4, name: 'news', description: 'Newsletter management' },
// 	{ id: 5, name: 'career', description: 'Career management' },
// 	{ id: 6, name: 'merch', description: 'Merchandise management' },
// 	{ id: 7, name: 'orders', description: 'Orders management' },
// 	{ id: 8, name: 'payments', description: 'Payments management' },
// 	{ id: 9, name: 'registrars', description: 'Registrars management' },
// 	{ id: 10, name: 'roles', description: 'Role management' },
// 	{ id: 11, name: 'auctions', description: 'Auction management' },
// 	{ id: 12, name: 'chats', description: 'Gemini chat management' },
// 	{
// 		id: 13,
// 		name: 'company-docs',
// 		description: 'Company Documents managements',
// 	},
// 	{ id: 14, name: 'departments', description: 'Department management' },
// ];

// // Actions
// export const actions: RbacAction[] = [
// 	{ id: 1, name: 'create', description: 'Create new records' },
// 	{ id: 2, name: 'read:any', description: 'Read any record' },
// 	{ id: 3, name: 'read:own', description: 'Read only own record' },
// 	{ id: 4, name: 'update:any', description: 'Update any record' },
// 	{ id: 5, name: 'update:own', description: 'Update only own record' },
// 	{ id: 6, name: 'delete', description: 'Delete records' },
// 	{ id: 7, name: 'publish', description: 'Publish/unpublish content' },
// ];

// // Roles
// export const roles: RbacRole[] = [
// 	{
// 		id: 1,
// 		name: 'admin',
// 		description: 'Full administrative access',
// 		is_system_role: true,
// 		is_active: true,
// 		created_by: 1,
// 	},
// 	{
// 		id: 2,
// 		name: 'staff',
// 		description: 'Staff with standard permissions',
// 		is_system_role: false,
// 		is_active: true,
// 		created_by: 1,
// 	},
// 	{
// 		id: 3,
// 		name: 'guest',
// 		description: 'Minimal public access',
// 		is_system_role: true,
// 		is_active: true,
// 		created_by: 1,
// 	},
// ];

// // Permissions (just a few for demo)
// export const permissions: RbacPermission[] = [
// 	{ id: 1, resource_id: 1, action_id: 1, description: 'users:create' },
// 	{ id: 2, resource_id: 1, action_id: 2, description: 'users:read:any' },
// 	{ id: 3, resource_id: 2, action_id: 2, description: 'blogs:read:any' },
// 	{ id: 4, resource_id: 3, action_id: 2, description: 'events:read:any' },
// 	{ id: 5, resource_id: 2, action_id: 7, description: 'blogs:publish' },
// 	{ id: 6, resource_id: 3, action_id: 7, description: 'events:publish' },
// ];

// // RolePermissions (admin has all, staff has some, guest has some)
// export const rolePermissions: RbacRolePermission[] = [
// 	{ role_id: 1, permission_id: 1, granted_by: 1 },
// 	{ role_id: 1, permission_id: 2, granted_by: 1 },
// 	{ role_id: 1, permission_id: 3, granted_by: 1 },
// 	{ role_id: 1, permission_id: 4, granted_by: 1 },
// 	{ role_id: 1, permission_id: 5, granted_by: 1 },
// 	{ role_id: 1, permission_id: 6, granted_by: 1 },
// 	{ role_id: 2, permission_id: 2, granted_by: 1 },
// 	{ role_id: 2, permission_id: 3, granted_by: 1 },
// 	{ role_id: 2, permission_id: 5, granted_by: 1 },
// 	{ role_id: 3, permission_id: 3, granted_by: 1 },
// ];

// const rolesData = {
// 	resources: [
// 		{ id: 1, name: 'users', description: 'User management' },
// 		{ id: 2, name: 'blogs', description: 'Blog posts management' },
// 		{ id: 3, name: 'events', description: 'Events management' },
// 	],
// 	actions: [
// 		{ id: 1, name: 'create', description: 'Create new records' },
// 		{ id: 2, name: 'read:any', description: 'Read any record' },
// 		{ id: 3, name: 'update:own', description: 'Update own records' },
// 	],
// 	roles: [
// 		{
// 			id: 1,
// 			name: 'admin',
// 			description: 'Full access',
// 			is_system_role: true,
// 			is_active: true,
// 		},
// 		{
// 			id: 2,
// 			name: 'staff',
// 			description: 'Staff access',
// 			is_system_role: false,
// 			is_active: true,
// 		},
// 		{
// 			id: 3,
// 			name: 'guest',
// 			description: 'Minimal access',
// 			is_system_role: true,
// 			is_active: true,
// 		},
// 	],
// 	permissions: [
// 		{ id: 1, resource_id: 1, action_id: 1, description: 'users:create' },
// 		{ id: 2, resource_id: 1, action_id: 2, description: 'users:read:any' },
// 		{ id: 3, resource_id: 2, action_id: 1, description: 'blogs:create' },
// 		{
// 			id: 4,
// 			resource_id: 2,
// 			action_id: 3,
// 			description: 'blogs:update:own',
// 		},
// 	],
// 	role_permissions: [
// 		{ role_id: 1, permission_id: 1 },
// 		{ role_id: 1, permission_id: 2 },
// 		{ role_id: 2, permission_id: 3 },
// 		{ role_id: 3, permission_id: 4 },
// 	],
// };

// function RolesAndPermissions() {
// 	const [roles, setRoles] = useState(rolesData.roles);
// 	const [rolePermissions, setRolePermissions] = useState(
// 		rolesData.role_permissions,
// 	);

// 	const togglePermission = (roleId: number, permissionId: number) => {
// 		setRolePermissions((prev) => {
// 			const exists = prev.find(
// 				(rp) =>
// 					rp.role_id === roleId && rp.permission_id === permissionId,
// 			);
// 			if (exists) {
// 				return prev.filter(
// 					(rp) =>
// 						!(
// 							rp.role_id === roleId &&
// 							rp.permission_id === permissionId
// 						),
// 				);
// 			}
// 			return [...prev, { role_id: roleId, permission_id: permissionId }];
// 		});
// 	};

// 	return (
// 		<div className="grid grid-cols-3 gap-4 p-6">
// 			{roles.map((role) => (
// 				<Card key={role.id}>
// 					<CardHeader>
// 						<CardTitle>{role.name}</CardTitle>
// 						<p className="text-sm text-muted-foreground">
// 							{role.description}
// 						</p>
// 					</CardHeader>
// 					<CardContent className="space-y-2">
// 						{rolesData.permissions.map((perm) => (
// 							<div
// 								key={perm.id}
// 								className="flex items-center space-x-2"
// 							>
// 								<Checkbox
// 									id={`perm-${role.id}-${perm.id}`}
// 									checked={rolePermissions.some(
// 										(rp) =>
// 											rp.role_id === role.id &&
// 											rp.permission_id === perm.id,
// 									)}
// 									onCheckedChange={() =>
// 										togglePermission(role.id, perm.id)
// 									}
// 								/>
// 								<label
// 									htmlFor={`perm-${role.id}-${perm.id}`}
// 									className="text-sm"
// 								>
// 									{perm.description}
// 								</label>
// 							</div>
// 						))}
// 						<Button className="mt-3 w-full">Save Changes</Button>
// 					</CardContent>
// 				</Card>
// 			))}
// 		</div>
// 	);
// }

// export default RolesAndPermissions;

import { useState } from 'react';
import {
	RbacResource,
	RbacAction,
	RbacRole,
	RbacPermission,
	RbacRolePermission,
} from '@/components/roles & permissions/RolesSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
	Shield,
	Plus,
	Edit,
	Trash2,
	Users,
	Key,
	Settings,
	Search,
	Crown,
	UserCheck,
	Eye,
	CheckCircle2,
	XCircle,
	AlertTriangle,
} from 'lucide-react';

// RBAC Resources
const resources: RbacResource[] = [
	{ id: 1, name: 'users', description: 'User management' },
	{ id: 2, name: 'blogs', description: 'Blog posts management' },
	{ id: 3, name: 'events', description: 'Events management' },
	{ id: 4, name: 'news', description: 'Newsletter management' },
	{ id: 5, name: 'career', description: 'Career management' },
	{ id: 6, name: 'merch', description: 'Merchandise management' },
	{ id: 7, name: 'orders', description: 'Orders management' },
	{ id: 8, name: 'payments', description: 'Payments management' },
	{ id: 9, name: 'registrars', description: 'Registrars management' },
	{ id: 10, name: 'roles', description: 'Role management' },
	{ id: 11, name: 'auctions', description: 'Auction management' },
	{ id: 12, name: 'chats', description: 'Gemini chat management' },
	{
		id: 13,
		name: 'company-docs',
		description: 'Company Documents managements',
	},
	{ id: 14, name: 'departments', description: 'Department management' },
];

// RBAC Actions
const actions: RbacAction[] = [
	{ id: 1, name: 'create', description: 'Create new records' },
	{ id: 2, name: 'read:any', description: 'Read any record' },
	{ id: 3, name: 'read:own', description: 'Read only own record' },
	{ id: 4, name: 'update:any', description: 'Update any record' },
	{ id: 5, name: 'update:own', description: 'Update only own record' },
	{ id: 6, name: 'delete', description: 'Delete records' },
	{ id: 7, name: 'publish', description: 'Publish/unpublish content' },
];

// RBAC Roles
const roles: RbacRole[] = [
	{
		id: 1,
		name: 'admin',
		description: 'Full administrative access',
		is_system_role: true,
		is_active: true,
		created_by: 1,
	},
	{
		id: 2,
		name: 'staff',
		description: 'Staff with standard permissions',
		is_system_role: false,
		is_active: true,
		created_by: 1,
	},
	{
		id: 3,
		name: 'guest',
		description: 'Minimal public access',
		is_system_role: true,
		is_active: true,
		created_by: 1,
	},
];

// RBAC Permissions (demo subset)
const permissions: RbacPermission[] = [
	{ id: 1, resource_id: 1, action_id: 1, description: 'users:create' },
	{ id: 2, resource_id: 1, action_id: 2, description: 'users:read:any' },
	{ id: 3, resource_id: 2, action_id: 2, description: 'blogs:read:any' },
	{ id: 4, resource_id: 3, action_id: 2, description: 'events:read:any' },
	{ id: 5, resource_id: 2, action_id: 7, description: 'blogs:publish' },
	{ id: 6, resource_id: 3, action_id: 7, description: 'events:publish' },
];

// RBAC RolePermissions (demo subset)
const rolePermissions: RbacRolePermission[] = [
	{ role_id: 1, permission_id: 1, granted_by: 1 },
	{ role_id: 1, permission_id: 2, granted_by: 1 },
	{ role_id: 1, permission_id: 3, granted_by: 1 },
	{ role_id: 1, permission_id: 4, granted_by: 1 },
	{ role_id: 1, permission_id: 5, granted_by: 1 },
	{ role_id: 1, permission_id: 6, granted_by: 1 },
	{ role_id: 2, permission_id: 2, granted_by: 1 },
	{ role_id: 2, permission_id: 3, granted_by: 1 },
	{ role_id: 2, permission_id: 5, granted_by: 1 },
	{ role_id: 3, permission_id: 3, granted_by: 1 },
];

export default function RolesAndPermissions() {
	const [selectedRoleId, setSelectedRoleId] = useState<number>(roles[0].id);
	const [rolePerms, setRolePerms] = useState(rolePermissions);
	const [searchTerm, setSearchTerm] = useState('');

	const selectedRole = roles.find((r) => r.id === selectedRoleId);

	const getRolePermissions = (roleId: number) =>
		rolePerms
			.filter((rp) => rp.role_id === roleId)
			.map((rp) => rp.permission_id);

	const togglePermission = (roleId: number, permissionId: number) => {
		setRolePerms((prev) => {
			const exists = prev.find(
				(rp) =>
					rp.role_id === roleId && rp.permission_id === permissionId,
			);
			if (exists) {
				return prev.filter(
					(rp) =>
						!(
							rp.role_id === roleId &&
							rp.permission_id === permissionId
						),
				);
			}
			return [
				...prev,
				{ role_id: roleId, permission_id: permissionId, granted_by: 1 },
			];
		});
	};

	const filteredRoles = roles.filter(
		(role) =>
			role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			role.description.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="flex flex-col gap-8 p-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight text-kenic-blue flex items-center gap-3">
					<Shield className="h-8 w-8" />
					Roles & Permissions
				</h1>
				<Input
					placeholder="Search roles..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="max-w-xs h-10"
				/>
			</div>

			<Tabs defaultValue="roles" className="space-y-6">
				<TabsList className="grid w-full grid-cols-3 h-12">
					<TabsTrigger
						value="roles"
						className="flex items-center gap-2 text-sm"
					>
						<Users className="h-4 w-4" />
						Roles
					</TabsTrigger>
					<TabsTrigger
						value="permissions"
						className="flex items-center gap-2 text-sm"
					>
						<Key className="h-4 w-4" />
						Permissions
					</TabsTrigger>
					<TabsTrigger
						value="resources"
						className="flex items-center gap-2 text-sm"
					>
						<Settings className="h-4 w-4" />
						Resources
					</TabsTrigger>
				</TabsList>

				<TabsContent value="roles" className="space-y-6">
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{filteredRoles.map((role) => (
							<Card
								key={role.id}
								className="hover:shadow-lg transition-all duration-200 border-2 hover:border-kenic-blue/30"
							>
								<CardHeader className="pb-4">
									<div className="flex items-center gap-3">
										{role.is_system_role ? (
											<Crown className="h-6 w-6 text-yellow-500" />
										) : (
											<UserCheck className="h-6 w-6 text-kenic-blue" />
										)}
										<div>
											<CardTitle className="text-lg text-kenic-blue">
												{role.name}
											</CardTitle>
											<p className="text-sm text-muted-foreground">
												{role.description}
											</p>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center gap-2">
										<Badge
											variant={
												role.is_active
													? 'default'
													: 'secondary'
											}
											className={
												role.is_active
													? 'bg-green-100 text-green-800'
													: ''
											}
										>
											{role.is_active ? (
												<CheckCircle2 className="h-3 w-3 mr-1" />
											) : (
												<XCircle className="h-3 w-3 mr-1" />
											)}
											{role.is_active
												? 'Active'
												: 'Inactive'}
										</Badge>
									</div>
									<div className="space-y-2">
										<span className="text-sm font-medium">
											Permissions
										</span>
										<Badge
											variant="outline"
											className="font-bold"
										>
											{getRolePermissions(role.id).length}
										</Badge>
									</div>
									<div className="flex gap-2 pt-2">
										<Button
											variant="ghost"
											size="sm"
											className="text-kenic-blue hover:text-kenic-blue/80"
										>
											<Eye className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="text-kenic-blue hover:text-kenic-blue/80"
										>
											<Edit className="h-4 w-4" />
										</Button>
										{!role.is_system_role && (
											<Button
												variant="ghost"
												size="sm"
												className="text-red-600 hover:text-red-700"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										)}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="permissions" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-xl text-kenic-blue">
								Permission Matrix
							</CardTitle>
							<p className="text-muted-foreground">
								Overview of permissions assigned to each role
							</p>
						</CardHeader>
						<CardContent>
							<div className="overflow-x-auto">
								<table className="min-w-full border">
									<thead>
										<tr>
											<th className="p-2 text-left">
												Role
											</th>
											{permissions.map((perm) => (
												<th
													key={perm.id}
													className="p-2 text-left"
												>
													{perm.description}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{roles.map((role) => (
											<tr
												key={role.id}
												className="border-t"
											>
												<td className="p-2 font-medium">
													{role.name}
												</td>
												{permissions.map((perm) => (
													<td
														key={perm.id}
														className="p-2 text-center"
													>
														{getRolePermissions(
															role.id,
														).includes(perm.id) ? (
															<CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
														) : (
															<XCircle className="h-4 w-4 text-gray-300 mx-auto" />
														)}
													</td>
												))}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="resources" className="space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						{resources.map((resource) => (
							<Card
								key={resource.id}
								className="border-2 hover:border-kenic-blue/30 transition-all duration-200"
							>
								<CardHeader className="pb-4">
									<CardTitle className="text-lg text-kenic-blue">
										{resource.name}
									</CardTitle>
									<p className="text-sm text-muted-foreground">
										{resource.description}
									</p>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<span className="text-sm font-medium">
											Available Actions:
										</span>
										<div className="flex flex-wrap gap-2">
											{actions.map((action) => (
												<Badge
													key={action.id}
													variant="outline"
													className="text-xs"
												>
													{action.name}
												</Badge>
											))}
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
