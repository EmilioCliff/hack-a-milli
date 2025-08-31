import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { MoreHorizontal, Eye, Edit, Download, Trash2 } from 'lucide-react';
import { CompanyDoc } from './DocumentSchema';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import DataTableColumnHeader from '../table/data-table-column-header';

const truncateContent = (content: string, length = 60) =>
	content.length > length ? content.slice(0, length) + '...' : content;

export const DocumentTableSchema = (
	// setDeleteDocument: (doc: CompanyDoc) => void,
	navigate: (to: string) => void,
): ColumnDef<CompanyDoc>[] => [
	{
		accessorKey: 'title',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Title" />
		),
		cell: ({ row }) => (
			<span className="font-medium">{row.original.title}</span>
		),
		filterFn: (row, _columnId, filterValue) => {
			const doc = row.original;
			if (!filterValue) return true;
			const search = filterValue.toLowerCase();
			return doc.title.toLowerCase().includes(search);
		},
		enableSorting: false,
	},
	{
		accessorKey: 'content',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Content Overview" />
		),
		cell: ({ row }) => (
			<div className="text-sm text-muted-foreground max-w-xs">
				{truncateContent(row.original.content)}
			</div>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'status',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => (
			<Badge
				className="font-semibold"
				variant={
					row.original.status === 'published'
						? 'default'
						: 'secondary'
				}
			>
				{row.original.status}
			</Badge>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'min_read',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Min Read" />
		),
		cell: ({ row }) => (
			<div className="text-sm">
				{row.original.min_read.toLocaleString()} min read
			</div>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'created_at',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Created" />
		),
		cell: ({ row }) => (
			<span className="text-sm text-muted-foreground">
				{format(row.original.created_at, 'MMM dd, yyyy, hh:mm a')}
			</span>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'updated_at',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Last Updated" />
		),
		cell: ({ row }) => (
			<span className="text-sm text-muted-foreground">
				{row.original.updated_at
					? format(row.original.updated_at, 'MMM dd, yyyy, hh:mm a')
					: 'N/A'}
			</span>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'actions',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Actions" />
		),
		cell: ({ row }) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="bg-background border shadow-md"
				>
					<DropdownMenuItem
						className="gap-2"
						onClick={() =>
							navigate(`/documents/${row.original.id}`)
						}
					>
						<Eye className="h-4 w-4" />
						View Document
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2"
						onClick={() =>
							navigate(`/documents/edit/${row.original.id}`)
						}
					>
						<Edit className="h-4 w-4" />
						Edit Document
					</DropdownMenuItem>
					<DropdownMenuItem className="gap-2">
						<Download className="h-4 w-4" />
						Export Document
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 text-destructive"
						// onClick={() => setDeleteDocument(row.original)}
					>
						<Trash2 className="h-4 w-4" />
						Delete Document
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
		enableSorting: false,
	},
];

const statusLabels: Record<string, string> = {
	published: 'Published',
	draft: 'Draft',
	archived: 'Archived',
};

export const getStatusLabel = (status: string) => {
	return statusLabels[status] || 'Unknown';
};
