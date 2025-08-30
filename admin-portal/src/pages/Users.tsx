import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { DataTable } from '@/components/table/data-table';
import { UserTableSchema } from '@/components/users/UserTableSchema';
import { useNavigate } from 'react-router-dom';

export const sampleUsers = [
	{
		id: 1,
		email: 'james.kiprotich@kenic.or.ke',
		full_name: 'James Kiprotich',
		phone_number: '+254722123456',
		address: 'Westlands, Nairobi',
		password_hash: '$2b$10$abcd1234567890abcdef',
		role: ['Admin', 'Technical Manager'],
		department_id: 1,
		department_name: 'Technical Operations',
		active: true,
		account_verified: true,
		multifactor_authentication: true,
		refresh_token: 'rt_admin_james_2024',
		last_login: '2024-08-29T08:30:00Z',
		avatar_url:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
		updated_by: null,
		created_by: 1,
		updated_at: '2024-08-29T10:15:00Z',
		created_at: '2023-01-15T09:00:00Z',
	},
	{
		id: 2,
		email: 'grace.wanjiku@kenic.or.ke',
		full_name: 'Grace Wanjiku',
		phone_number: '+254733987654',
		address: 'Kileleshwa, Nairobi',
		password_hash: '$2b$10$efgh5678901234567890',
		role: ['Staff', 'Registry Manager'],
		department_id: 2,
		department_name: 'Domain Registry',
		active: true,
		account_verified: true,
		multifactor_authentication: true,
		refresh_token: 'rt_staff_grace_2024',
		last_login: '2024-08-29T07:45:00Z',
		avatar_url:
			'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
		updated_by: 1,
		created_by: 1,
		updated_at: '2024-08-25T14:20:00Z',
		created_at: '2023-03-10T11:30:00Z',
	},
	{
		id: 3,
		email: 'david.mwangi@kenic.or.ke',
		full_name: 'David Mwangi',
		phone_number: '+254711567890',
		address: 'Karen, Nairobi',
		password_hash: '$2b$10$ijkl9012345678901234',
		role: ['Staff', 'Security Analyst'],
		department_id: 3,
		department_name: 'Cybersecurity',
		active: true,
		account_verified: true,
		multifactor_authentication: true,
		refresh_token: 'rt_staff_david_2024',
		last_login: '2024-08-28T16:22:00Z',
		avatar_url:
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
		updated_by: 1,
		created_by: 1,
		updated_at: '2024-08-20T09:10:00Z',
		created_at: '2023-06-22T13:15:00Z',
	},
	{
		id: 4,
		email: 'sarah.akinyi@kenic.or.ke',
		full_name: 'Sarah Akinyi',
		phone_number: '+254788234567',
		address: 'Lavington, Nairobi',
		password_hash: '$2b$10$mnop3456789012345678',
		role: ['Staff'],
		department_id: 4,
		department_name: 'Customer Relations',
		active: true,
		account_verified: true,
		multifactor_authentication: false,
		refresh_token: 'rt_staff_sarah_2024',
		last_login: '2024-08-29T09:10:00Z',
		avatar_url:
			'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
		updated_by: 2,
		created_by: 1,
		updated_at: '2024-08-28T11:45:00Z',
		created_at: '2023-08-14T10:20:00Z',
	},
	{
		id: 5,
		email: 'michael.ochieng@kenic.or.ke',
		full_name: 'Michael Ochieng',
		phone_number: '+254700123789',
		address: null,
		password_hash: '$2b$10$qrst7890123456789012',
		role: ['Guest'],
		department_id: null,
		department_name: null,
		active: false,
		account_verified: false,
		multifactor_authentication: false,
		refresh_token: '',
		last_login: '2024-07-15T14:30:00Z',
		avatar_url: null,
		updated_by: 1,
		created_by: 2,
		updated_at: '2024-08-01T16:00:00Z',
		created_at: '2024-07-10T12:00:00Z',
	},
	{
		id: 6,
		email: 'ann.nyokabi@kenic.or.ke',
		full_name: 'Ann Nyokabi',
		phone_number: '+254755445566',
		address: 'Upper Hill, Nairobi',
		password_hash: '$2b$10$uvwx1234567890123456',
		role: ['Admin', 'Policy Manager'],
		department_id: 5,
		department_name: 'Policy & Governance',
		active: true,
		account_verified: true,
		multifactor_authentication: true,
		refresh_token: 'rt_admin_ann_2024',
		last_login: '2024-08-29T06:15:00Z',
		avatar_url:
			'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
		updated_by: 1,
		created_by: 1,
		updated_at: '2024-08-27T13:30:00Z',
		created_at: '2022-11-05T08:45:00Z',
	},
	{
		id: 7,
		email: 'peter.kamau@kenic.or.ke',
		full_name: 'Peter Kamau',
		phone_number: '+254766778899',
		address: 'Kilimani, Nairobi',
		password_hash: '$2b$10$yzab5678901234567890',
		role: ['Staff', 'Network Engineer'],
		department_id: 1,
		department_name: 'Technical Operations',
		active: true,
		account_verified: true,
		multifactor_authentication: true,
		refresh_token: 'rt_staff_peter_2024',
		last_login: '2024-08-28T23:45:00Z',
		avatar_url:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
		updated_by: 1,
		created_by: 1,
		updated_at: '2024-08-26T17:20:00Z',
		created_at: '2023-09-30T14:10:00Z',
	},
];

// Department lookup for reference
export const departments = [
	{ id: 1, name: 'Technical Operations' },
	{ id: 2, name: 'Domain Registry' },
	{ id: 3, name: 'Cybersecurity' },
	{ id: 4, name: 'Customer Relations' },
	{ id: 5, name: 'Policy & Governance' },
	{ id: 4, name: 'Customer Relations' },
	{ id: 5, name: 'Policy & Governance' },
];

// Role definitions for KENIC
export const roleDefinitions = {
	Admin: {
		description: 'Full system administrative access',
		permissions: ['read', 'write', 'delete', 'admin'],
	},
	Staff: {
		description: 'Standard employee access',
		permissions: ['read', 'write'],
	},
	Guest: {
		description: 'Limited access for external users',
		permissions: ['read'],
	},
	'Technical Manager': {
		description: 'Technical operations oversight',
		permissions: ['read', 'write', 'technical_admin'],
	},
	'Registry Manager': {
		description: 'Domain registry management',
		permissions: ['read', 'write', 'registry_admin'],
	},
	'Security Analyst': {
		description: 'Cybersecurity monitoring and analysis',
		permissions: ['read', 'write', 'security_admin'],
	},
	'Network Engineer': {
		description: 'Network infrastructure management',
		permissions: ['read', 'write', 'network_admin'],
	},
	'Policy Manager': {
		description: 'Policy development and governance',
		permissions: ['read', 'write', 'policy_admin'],
	},
};

const roles = [
	{
		value: 'admin',
		label: 'ADMIN',
	},
	{
		value: 'staff',
		label: 'STAFF',
	},
	{
		value: 'guest',
		label: 'GUEST',
	},
];

const active = [
	{
		value: 'true',
		label: 'ACTIVE',
	},
	{
		value: 'false',
		label: 'INACTIVE',
	},
];

const getRoleColor = (role: string) => {
	switch (role) {
		case 'Admin':
			return 'bg-accent text-accent-foreground';
		case 'Staff':
			return 'bg-primary text-primary-foreground';
		case 'Guest':
			return 'bg-secondary text-secondary-foreground';
		default:
			return 'bg-muted text-muted-foreground';
	}
};

const getStatusColor = (status: string) => {
	switch (status) {
		case 'Active':
			return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
		case 'Pending':
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
		case 'Inactive':
			return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
	}
};

const Users = () => {
	const navigate = useNavigate();
	return (
		<div className="space-y-6 p-4 bg-gray-100">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						User Management
					</h1>
					<p className="text-muted-foreground">
						Manage user accounts, roles, and permissions
					</p>
				</div>
				<Button className="gradient-primary cursor-pointer hover:accent-hover shadow-glow">
					<UserPlus className="w-4 h-4 mr-2" />
					Add New User
				</Button>
			</div>

			<DataTable
				data={sampleUsers}
				columns={UserTableSchema(navigate)}
				searchableColumns={[
					{
						id: 'id',
						title: 'Name',
					},
					{
						id: 'id',
						title: 'Email',
					},
				]}
				facetedFilterColumns={[
					{
						id: 'role',
						title: 'Role',
						options: roles,
					},
					{
						id: 'active',
						title: 'Active',
						options: active,
					},
				]}
			/>
		</div>
	);
};

export default Users;
