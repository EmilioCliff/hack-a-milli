import { AuditLogTableSchema } from '@/components/audit logs/AuditLogTableSchema';
import { DataTable } from '@/components/table/data-table';
import { useNavigate } from 'react-router-dom';

// ...existing imports...
export const logs: {
	id: number;
	action: string;
	entity_type: string;
	entity_id: number;
	old_values?: any;
	new_values?: any;
	performed_by: number;
	performed_at: string;
	severity: 'info' | 'warning' | 'critical';
	user: {
		name: string;
		email: string;
		avatar?: string;
	};
}[] = [
	{
		id: 1,
		action: 'role_created',
		entity_type: 'role',
		entity_id: 2,
		old_values: null,
		new_values: {
			name: 'staff',
			description: 'Staff with standard permissions',
		},
		performed_by: 1,
		performed_at: '2025-08-30T09:00:00Z',
		severity: 'info',
		user: {
			name: 'Jane Doe',
			email: 'jane.doe@example.com',
			avatar: 'https://example.com/avatars/jane.jpg',
		},
	},
	{
		id: 2,
		action: 'permission_granted',
		entity_type: 'permission',
		entity_id: 5,
		old_values: { granted: false },
		new_values: { granted: true },
		performed_by: 1,
		performed_at: '2025-08-30T09:05:00Z',
		severity: 'info',
		user: {
			name: 'Jane Doe',
			email: 'jane.doe@example.com',
			avatar: 'https://example.com/avatars/jane.jpg',
		},
	},
	{
		id: 3,
		action: 'user_assigned_role',
		entity_type: 'user_role',
		entity_id: 3,
		old_values: { roles: ['guest'] },
		new_values: { roles: ['guest', 'staff'] },
		performed_by: 2,
		performed_at: '2025-08-30T09:10:00Z',
		severity: 'warning',
		user: {
			name: 'John Smith',
			email: 'john.smith@example.com',
			avatar: 'https://example.com/avatars/john.jpg',
		},
	},
	{
		id: 4,
		action: 'role_deleted',
		entity_type: 'role',
		entity_id: 4,
		old_values: { name: 'temp_role' },
		new_values: null,
		performed_by: 1,
		performed_at: '2025-08-30T09:15:00Z',
		severity: 'critical',
		user: {
			name: 'Jane Doe',
			email: 'jane.doe@example.com',
			avatar: 'https://example.com/avatars/jane.jpg',
		},
	},
	{
		id: 5,
		action: 'permission_revoked',
		entity_type: 'permission',
		entity_id: 6,
		old_values: { granted: true },
		new_values: { granted: false },
		performed_by: 3,
		performed_at: '2025-08-30T09:20:00Z',
		severity: 'warning',
		user: {
			name: 'Alice Kim',
			email: 'alice.kim@example.com',
			avatar: 'https://example.com/avatars/alice.jpg',
		},
	},
	{
		id: 6,
		action: 'user_assigned_role',
		entity_type: 'user_role',
		entity_id: 5,
		old_values: { roles: ['staff'] },
		new_values: { roles: ['admin'] },
		performed_by: 2,
		performed_at: '2025-08-30T09:25:00Z',
		severity: 'critical',
		user: {
			name: 'John Smith',
			email: 'john.smith@example.com',
			avatar: 'https://example.com/avatars/john.jpg',
		},
	},
];
const severity = [
	{ label: 'Info', value: 'info' },
	{ label: 'Warning', value: 'warning' },
	{ label: 'Critical', value: 'critical' },
];

function AuditLogs() {
	const navigate = useNavigate();
	return (
		<div className="space-y-6 p-4 bg-gray-100">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Audit Logs
					</h1>
					<p className="text-muted-foreground">
						Track all security and permission changes in the system
					</p>
				</div>
			</div>

			<DataTable
				data={logs}
				columns={AuditLogTableSchema}
				searchableColumns={[
					{
						id: 'action',
						title: 'Actions',
					},
					{
						id: 'performed_by',
						title: 'Name, Email',
					},
				]}
				facetedFilterColumns={[
					{
						id: 'severity',
						title: 'Severity',
						options: severity,
					},
				]}
			/>
		</div>
	);
}

export default AuditLogs;
