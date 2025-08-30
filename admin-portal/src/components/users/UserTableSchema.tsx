import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import DataTableColumnHeader from '../table/data-table-column-header';
import { User } from './UserSchema';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { Edit, MoreHorizontal, Shield, Trash2 } from 'lucide-react';

export const UserTableSchema = (
	navigate: (to: string) => void,
): ColumnDef<User>[] => [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="User" />
		),
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-3">
					<Avatar className="w-10 h-10">
						<AvatarImage src={user.avatar_url || ''} />
						<AvatarFallback className="bg-primary text-primary-foreground">
							{user.full_name
								.split(' ')
								.map((n) => n[0])
								.join('')}
						</AvatarFallback>
					</Avatar>
					<div className="text-start">
						<p className="font-medium text-foreground">
							{user.full_name}
						</p>
						<p className="text-sm text-muted-foreground">
							{user.email}
						</p>
					</div>
				</div>
			);
		},
		filterFn: (row, _columnId, filterValue) => {
			const user = row.original;
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
		accessorKey: 'role',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Role" />
		),
		cell: ({ row }) => (
			<Badge className={getRoleColor(row.original.role[0])}>
				{row.original.role[0]}
			</Badge>
		),
		filterFn: (row, _, filterValues: string[]) => {
			const cellValue = row.original.role;
			return filterValues.includes(String(cellValue[0]).toLowerCase());
		},
		enableSorting: false,
	},
	{
		accessorKey: 'department_name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Department" />
		),
		cell: ({ row }) => (
			<p className="text-start">
				{row.original.department_name || 'Guest'}
			</p>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'active',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Active" />
		),
		cell: ({ row }) => (
			<Badge
				variant="outline"
				className={
					row.original.active
						? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
						: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
				}
			>
				{row.original.active ? 'Active' : 'Inactive'}
			</Badge>
		),
		filterFn: (row, id, filterValues: string[]) => {
			return filterValues.includes(Boolean(row.getValue(id)).toString());
		},
		enableSorting: false,
	},
	{
		accessorKey: 'last_login',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Last Login" />
		),
		cell: ({ row }) => (
			<p>
				{row.original.last_login
					? format(row.original.last_login, 'ppp')
					: 'N/A'}
			</p>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'actions',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Actions" />
		),
		cell: ({ row }) => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<MoreHorizontal className="w-4 h-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() =>
								navigate(`/users/${row.original.id}/edit`)
							}
						>
							<Edit className="w-4 h-4 mr-2" />
							Edit User
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								navigate(`/users/${row.original.id}/edit`)
							}
						>
							<Shield className="w-4 h-4 mr-2" />
							Manage Permissions
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-destructive">
							<Trash2 className="w-4 h-4 mr-2" />
							Delete User
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		enableSorting: false,
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
