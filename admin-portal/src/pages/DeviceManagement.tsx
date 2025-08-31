import DeviceStats from '@/components/device management/DeviceStats';
import { DeviceTableSchema } from '@/components/device management/DeviceTableSchema';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const devices = [
	{
		id: 1,
		user_id: 1,
		device_token: 'token_abc123',
		platform: 'android',
		active: true,
		created_at: '2025-08-01T10:00:00Z',
		last_used: '2025-08-30T09:00:00Z',
		user: {
			full_name: 'Jane Doe',
			email: 'jane.doe@example.com',
			avatar_url: 'https://example.com/avatars/jane.jpg',
		},
	},
	{
		id: 2,
		user_id: 2,
		device_token: 'token_def456',
		platform: 'ios',
		active: true,
		created_at: '2025-08-02T11:30:00Z',
		last_used: '2025-08-29T15:20:00Z',
		user: {
			full_name: 'John Smith',
			email: 'john.smith@example.com',
			avatar_url: 'https://example.com/avatars/john.jpg',
		},
	},
	{
		id: 3,
		user_id: 3,
		device_token: 'token_ghi789',
		platform: 'web',
		active: false,
		created_at: '2025-08-03T08:45:00Z',
		last_used: '2025-08-28T18:10:00Z',
		user: {
			full_name: 'Alice Kim',
			email: 'alice.kim@example.com',
			avatar_url: 'https://example.com/avatars/alice.jpg',
		},
	},
	{
		id: 4,
		user_id: 4,
		device_token: 'token_jkl012',
		platform: 'android',
		active: true,
		created_at: '2025-08-04T14:00:00Z',
		last_used: '2025-08-27T12:00:00Z',
		user: {
			full_name: 'Bob Lee',
			email: 'bob.lee@example.com',
			avatar_url: 'https://example.com/avatars/bob.jpg',
		},
	},
	{
		id: 5,
		user_id: 5,
		device_token: 'token_mno345',
		platform: 'ios',
		active: false,
		created_at: '2025-08-05T09:20:00Z',
		last_used: '2025-08-26T17:30:00Z',
		user: {
			full_name: 'Grace Wanjiru',
			email: 'grace.wanjiru@example.com',
			avatar_url: 'https://example.com/avatars/grace.jpg',
		},
	},
	{
		id: 6,
		user_id: 6,
		device_token: 'token_pqr678',
		platform: 'web',
		active: true,
		created_at: '2025-08-06T16:10:00Z',
		last_used: '2025-08-25T20:45:00Z',
		user: {
			full_name: 'Samuel Njoroge',
			email: 'samuel.njoroge@example.com',
			avatar_url: 'https://example.com/avatars/samuel.jpg',
		},
	},
];

const platform = [
	{
		value: 'ios',
		label: 'iOS',
	},
	{
		value: 'android',
		label: 'Android',
	},
	{
		value: 'web',
		label: 'Web',
	},
];

const status = [
	{
		value: 'active',
		label: 'Active',
	},
	{
		value: 'inactive',
		label: 'Inactive',
	},
];

function DeviceManagement() {
	const navigate = useNavigate();
	return (
		<div className="space-y-6 p-4 bg-gray-100">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Device Management
					</h1>
					<p className="text-muted-foreground">
						Manage device tokens for push notifications
					</p>
				</div>
				<Button className="bg-accent cursor-pointer hover:bg-accent shadow-glow">
					<Trash2 className="w-4 h-4 mr-2" />
					Delete Inactive Tokens
				</Button>
			</div>

			<DeviceStats />

			<DataTable
				data={devices}
				columns={DeviceTableSchema(navigate)}
				searchableColumns={[
					{
						id: 'user',
						title: 'Name, Email',
					},
				]}
				facetedFilterColumns={[
					{
						id: 'platform',
						title: 'Platform',
						options: platform,
					},
					{
						id: 'active',
						title: 'Active',
						options: status,
					},
				]}
			/>
		</div>
	);
}

export default DeviceManagement;
