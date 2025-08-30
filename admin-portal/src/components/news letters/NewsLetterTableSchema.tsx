import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import DataTableColumnHeader from '../table/data-table-column-header';
import { Button } from '../ui/button';
import { Eye, Edit, MoreHorizontal, FileText, Download } from 'lucide-react';
import { NewsLetter } from './NewsLetterSchema';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const NewsLetterTableSchema = (
	navigate: (to: string) => void,
): ColumnDef<NewsLetter>[] => [
	{
		accessorKey: 'title',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Title" />
		),
		cell: ({ row }) => {
			const newsletter = row.original;
			return (
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 bg-kenic-red/10 rounded-lg flex items-center justify-center">
						<FileText className="h-4 w-4 text-kenic-red" />
					</div>
					<div>
						<div className="font-medium text-sm">
							{newsletter.title}
						</div>
						<div className="text-xs text-muted-foreground">
							{newsletter.description}
						</div>
					</div>
				</div>
			);
		},
		filterFn: (row, _, filterValue) => {
			const title = row.original.title.toLowerCase();
			const search = filterValue.toLowerCase();
			return title.includes(search);
		},
		enableSorting: false,
	},
	{
		accessorKey: 'author',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Author" />
		),
		cell: ({ row }) => {
			return <p>{row.original.author}</p>;
		},
		filterFn: (row, _, filterValue) => {
			const author = row.original.author.toLowerCase();
			const search = filterValue.toLowerCase();
			return author.includes(search);
		},
		enableSorting: false,
	},
	{
		accessorKey: 'file_size',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="File Size" />
		),
		cell: ({ row }) => {
			return <p>{`${row.original.file_size.toLocaleString()} MB`}</p>;
		},
		enableSorting: true,
	},
	{
		accessorKey: 'Downloads',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Downloads" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex items-center">
					<Download className="w-4 h-4 inline mr-2 text-muted-foreground" />
					<p>{row.original.downloads.toLocaleString()}</p>
				</div>
			);
		},
		enableSorting: true,
	},
	{
		accessorKey: 'published',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Published" />
		),
		cell: ({ row }) => {
			const published = row.original.published;
			return (
				<Badge variant={published ? 'default' : 'outline'}>
					{published ? 'Published' : 'Draft'}
				</Badge>
			);
		},
		enableSorting: false,
		filterFn: (row, _, filterValues: string[]) => {
			const status = row.original.published ? 'published' : 'draft';
			return filterValues.includes(status);
		},
	},
	{
		accessorKey: 'pdf_url',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="PDF" />
		),
		cell: ({ row }) => (
			<a
				href={row.original.pdf_url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-2 text-accent hover:underline"
			>
				<FileText className="w-4 h-4" />
				View PDF
			</a>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'date',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Date" />
		),
		cell: ({ row }) => {
			const date = new Date(row.original.date);
			return <p>{date.toLocaleDateString()}</p>;
		},
		enableSorting: true,
	},
	{
		accessorKey: 'actions',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Actions" />
		),
		cell: ({ row }) => {
			const newsletter = row.original;
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
								navigate(`/newsletters/${newsletter.id}`)
							}
						>
							<Eye className="w-4 h-4 mr-2" />
							View Newsletter
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								navigate(`/newsletters/${newsletter.id}/edit`)
							}
						>
							<Edit className="w-4 h-4 mr-2" />
							Edit Newsletter
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		enableSorting: false,
	},
];
