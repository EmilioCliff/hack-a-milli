import { ColumnDef } from '@tanstack/react-table';
import DataTableColumnHeader from '../table/data-table-column-header';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { ProductCategory } from './ProductSchema';

export const CategoryTableSchema: ColumnDef<ProductCategory>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="ID" />
		),
		cell: ({ row }) => <span>{row.original.id}</span>,
		enableSorting: true,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Category" />
		),
		cell: ({ row }) => (
			<p className="font-medium text-foreground">{row.original.name}</p>
		),
		filterFn: (row, _columnId, filterValue) => {
			const name = row.original.name.toLowerCase();
			return name.includes(filterValue.toLowerCase());
		},
		enableSorting: true,
	},
	{
		accessorKey: 'description',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Description" />
		),
		cell: ({ row }) => (
			<p className="text-muted-foreground truncate max-w-xs">
				{row.original.description || 'No description'}
			</p>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'actions',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Actions" />
		),
		cell: () => (
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
					// onClick={() =>
					// 	navigate(`/categories/${row.original.id}/edit`)
					// }
					>
						<Edit className="w-4 h-4 mr-2" />
						Edit Category
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="text-destructive">
						<Trash2 className="w-4 h-4 mr-2" />
						Delete Category
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
		enableSorting: false,
	},
];
