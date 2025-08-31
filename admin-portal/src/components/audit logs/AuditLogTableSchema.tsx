import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import DataTableColumnHeader from '../table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { RbacAuditLog } from './AuditLogSchema';
import { Eye } from 'lucide-react';
import { Button } from '../ui/button';

export const AuditLogTableSchema: ColumnDef<RbacAuditLog>[] = [
	{
		accessorKey: 'performed_at',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Timestamp" />
		),
		cell: ({ row }) => (
			<span className="text-sm text-muted-foreground">
				{format(row.original.performed_at, 'MMM dd, yyyy, hh:mm a')}
			</span>
		),
		enableSorting: true,
	},
	{
		accessorKey: 'action',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Action" />
		),
		cell: ({ row }) => (
			<span className="font-medium">
				{formatActionDescription(row.original)}
			</span>
		),
		filterFn: (row, _columnId, filterValue) => {
			const log = row.original;
			if (!filterValue) return true;

			const search = filterValue.toLowerCase();
			return log.action.toLowerCase().includes(search);
		},
		enableSorting: true,
	},
	{
		accessorKey: 'entity_type',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Entity" />
		),
		cell: ({ row }) => (
			<Badge className="font-semibold" variant="outline">
				{row.original.entity_type} #{row.original.entity_id}
			</Badge>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'performed_by',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Performed By" />
		),
		cell: ({ row }) => (
			<div className="flex items-center gap-3">
				<Avatar className="h-6 w-6">
					<AvatarImage src={row.original.user.avatar || ''} />
					<AvatarFallback className="bg-primary text-primary-foreground">
						{row.original.user.name
							.split(' ')
							.map((n) => n[0])
							.join('')}
					</AvatarFallback>
				</Avatar>
				<div>
					<div className="text-sm font-medium">
						{row.original.user.name}
					</div>
					<div className="text-xs text-muted-foreground">
						{row.original.user.email}
					</div>
				</div>
			</div>
		),
		filterFn: (row, _columnId, filterValue) => {
			const log = row.original;
			if (!filterValue) return true;

			const search = filterValue.toLowerCase();
			return (
				log.user.name.toLowerCase().includes(search) ||
				log.user.email.toLowerCase().includes(search)
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: 'severity',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Severity" />
		),
		cell: ({ row }) => (
			<Badge
				className="font-semibold text-xs"
				variant={
					row.original.severity === 'critical'
						? 'destructive'
						: row.original.severity === 'warning'
						? 'secondary'
						: 'default'
				}
			>
				{row.original.severity.toUpperCase()}
			</Badge>
		),
		filterFn: (row, _, filterValues: string[]) => {
			const cellValue = row.original.severity;
			return filterValues.includes(String(cellValue).toLowerCase());
		},
		enableSorting: true,
	},
	{
		accessorKey: 'changes',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Changes" />
		),
		cell: ({ row }) => (
			<div className="text-xs max-w-xs">
				{row.original.old_values && (
					<div className="text-muted-foreground">
						<strong>Before:</strong>{' '}
						{JSON.stringify(row.original.old_values, null, 0)}
					</div>
				)}
				{row.original.new_values && (
					<div className="text-foreground">
						<strong>After:</strong>{' '}
						{JSON.stringify(row.original.new_values, null, 0)}
					</div>
				)}
			</div>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'actions',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Actions" />
		),
		cell: () => (
			<Button
				className="hover:bg-primary"
				size={'icon'}
				variant={'outline'}
			>
				<Eye />
			</Button>
		),
		enableSorting: false,
	},
];

const formatActionDescription = (log: RbacAuditLog) => {
	// Format action description, e.g. "Granted Permission"
	return log.action
		.replace(/_/g, ' ')
		.replace(/\b\w/g, (l) => l.toUpperCase());
};
