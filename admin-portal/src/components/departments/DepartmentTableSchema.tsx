import { ColumnDef } from '@tanstack/react-table';
import DataTableColumnHeader from '../table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { Building2, Edit } from 'lucide-react';

import { Department } from './DepartmentSchema';

export const DepartmentTableSchema = (
	navigate: (to: string) => void,
): ColumnDef<Department>[] => [
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Department Name" />
		),
		cell: ({ row }) => (
			<div className="flex items-center gap-3">
				<div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
					<Building2 className="h-4 w-4 text-primary" />
				</div>
				<div>
					<div className="font-medium text-sm">
						{row.original.name}
					</div>
					<div className="text-xs text-muted-foreground">
						{row.original.description}
					</div>
				</div>
			</div>
		),
		filterFn: (row, _columnId, filterValue) => {
			const department = row.original;
			if (!filterValue) return true;

			const search = filterValue.toLowerCase();
			return department.name.toLowerCase().includes(search);
		},
		enableSorting: true,
	},
	{
		accessorKey: 'staff_count',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Staff Count" />
		),
		cell: ({ row }) => (
			<Badge variant="outline">
				{row.original.staff_count} employees
			</Badge>
		),
		enableSorting: true,
	},
	{
		accessorKey: 'status',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => {
			const status = row.original.status.toLowerCase();
			return (
				<div className="flex items-center gap-2">
					<div
						className={`w-2 h-2 rounded-full ${
							status === 'active'
								? 'bg-green-500'
								: 'bg-destructive'
						}`}
					></div>
					<span className="text-sm">
						{status === 'active' ? 'Active' : 'Inactive'}
					</span>
				</div>
			);
		},
		filterFn: (row, _, filterValues: string[]) => {
			const status = row.original.status;
			return filterValues.includes(status);
		},
		enableSorting: true,
	},
	{
		accessorKey: 'actions',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Actions" />
		),
		cell: ({ row }) => (
			<Button
				className="hover:bg-primary"
				size={'icon'}
				variant={'outline'}
				onClick={() => navigate(`/applications/${row.original.id}`)}
			>
				<Edit />
			</Button>
		),
		enableSorting: false,
	},
];
