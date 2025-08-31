import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import DataTableColumnHeader from '../table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import {
	Bell,
	BellOff,
	Monitor,
	Smartphone,
	Tablet,
	Trash2,
} from 'lucide-react';
import { DeviceToken } from './DeviceSchema';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export const DeviceTableSchema = (
	navigate: (to: string) => void,
): ColumnDef<DeviceToken>[] => [
	{
		accessorKey: 'user',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="User" />
		),
		cell: ({ row }) => {
			const device = row.original;
			return (
				<div className="flex items-center gap-3">
					<Avatar className="w-10 h-10">
						<AvatarImage src={device.user.avatar_url || ''} />
						<AvatarFallback className="bg-primary text-primary-foreground">
							{device.user.full_name
								.split(' ')
								.map((n) => n[0])
								.join('')}
						</AvatarFallback>
					</Avatar>
					<div className="text-start">
						<p className="font-medium text-foreground">
							{device.user.full_name}
						</p>
						<p className="text-sm text-muted-foreground">
							{device.user.email}
						</p>
					</div>
				</div>
			);
		},
		filterFn: (row, _columnId, filterValue) => {
			const user = row.original.user;
			if (!filterValue) return true;

			const search = filterValue.toLowerCase();
			return (
				user.full_name.toLowerCase().includes(search) ||
				user.email.toLowerCase().includes(search)
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: 'platform',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Platform" />
		),
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				{getPlatformIcon(row.original.platform)}
				<Badge variant="secondary" className="font-semibold">
					{getPlatformLabel(row.original.platform)}
				</Badge>
			</div>
		),
		filterFn: (row, _columnId, filterValue: string[]) => {
			if (filterValue.length === 0) return true;
			return filterValue.includes(row.original.platform);
		},
		enableSorting: false,
	},
	{
		accessorKey: 'device_token',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Device Token" />
		),
		cell: ({ row }) => (
			<code className="text-xs bg-muted px-2 py-1 rounded">
				{truncateToken(row.original.device_token)}
			</code>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'active',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Active" />
		),
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				{row.original.active ? (
					<Bell className="h-3 w-3 text-green-500" />
				) : (
					<BellOff className="h-3 w-3 text-muted-foreground" />
				)}
				<Badge
					className="font-semibold"
					variant={row.original.active ? 'default' : 'secondary'}
				>
					{row.original.active ? 'Active' : 'Inactive'}
				</Badge>
			</div>
		),
		filterFn: (row, _columnId, filterValue: string[]) => {
			if (filterValue.length === 0) return true;
			const isActive = filterValue.includes('active');
			return isActive ? row.original.active : !row.original.active;
		},
		enableSorting: false,
	},
	{
		accessorKey: 'last_used',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Last Used" />
		),
		cell: ({ row }) => (
			<p>
				{row.original.last_used
					? format(
							new Date(row.original.last_used),
							'MMM dd, yyyy, hh:mm a',
					  )
					: '—'}
			</p>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'created_at',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Registered" />
		),
		cell: ({ row }) => (
			<p className="text-muted-foreground">
				{row.original.created_at
					? format(row.original.created_at, 'MMM dd, yyyy, hh:mm a')
					: '—'}
			</p>
		),
		enableSorting: true,
	},
	{
		accessorKey: 'actions',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Actions" />
		),
		cell: ({ row }) => (
			<div className="flex gap-2">
				<Button size={'sm'} variant={'ghost'}>
					Deactivate
				</Button>
				<Button
					size={'icon'}
					variant={'outline'}
					onClick={() => navigate(`/devices/${row.original.id}`)}
				>
					<Trash2 />
				</Button>
			</div>
		),
		enableSorting: false,
	},
];

const getPlatformIcon = (platform: string) => {
	switch (platform.toLowerCase()) {
		case 'ios':
			return <Smartphone className="h-4 w-4" />;
		case 'android':
			return <Smartphone className="h-4 w-4" />;
		case 'web':
			return <Monitor className="h-4 w-4" />;
		default:
			return <Tablet className="h-4 w-4" />;
	}
};

const getPlatformLabel = (platform: string) => {
	switch (platform.toLowerCase()) {
		case 'ios':
			return 'iOS';
		case 'android':
			return 'Android';
		case 'web':
			return 'Web';
		default:
			return 'Unknown';
	}
};

const truncateToken = (token: string) => {
	return `${token.slice(0, 8)}...${token.slice(-8)}`;
};
