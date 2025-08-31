import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import DataTableColumnHeader from '../table/data-table-column-header';
import { Button } from '../ui/button';
import { Eye, Edit, MoreHorizontal, Newspaper } from 'lucide-react';
import { NewsUpdate } from './NewsUpdateSchema';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const NewsUpdateTableSchema = (
	navigate: (to: string) => void,
): ColumnDef<NewsUpdate>[] => [
	{
		accessorKey: 'title',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Title" />
		),
		cell: ({ row }) => {
			const news = row.original;
			return (
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 bg-kenic-red/10 rounded-lg flex items-center justify-center">
						<Newspaper className="h-4 w-4 text-kenic-red" />
					</div>
					<div>
						<div className="font-medium text-sm">{news.title}</div>
						<div className="text-xs text-muted-foreground">
							{news.excerpt}
						</div>
					</div>
				</div>
			);
		},
		filterFn: (row, _, filterValue) => {
			const title = row.original.title.toLowerCase();
			const excerpt = row.original.excerpt.toLowerCase();
			const search = filterValue.toLowerCase();
			return title.includes(search) || excerpt.includes(search);
		},
		enableSorting: true,
	},
	{
		accessorKey: 'author',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Author" />
		),
		cell: ({ row }) => <p>{row.original.author}</p>,
		enableSorting: false,
	},
	{
		accessorKey: 'topic',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Topic" />
		),
		cell: ({ row }) => <p>{row.original.topic}</p>,
		filterFn: (row, _, filterValue) => {
			const topic = row.original.topic.toLowerCase();
			const search = filterValue.toLowerCase();
			return topic.includes(search);
		},
		enableSorting: false,
	},
	{
		accessorKey: 'min_read',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Min Read" />
		),
		cell: ({ row }) => <p>{row.original.min_read} min</p>,
		enableSorting: true,
	},
	{
		accessorKey: 'published',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => (
			<Badge variant={row.original.published ? 'default' : 'outline'}>
				{row.original.published ? 'Published' : 'Draft'}
			</Badge>
		),
		filterFn: (row, _, filterValues: string[]) => {
			const status = row.original.published ? 'published' : 'draft';
			return filterValues.includes(status);
		},
		enableSorting: false,
	},
	{
		accessorKey: 'actions',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Actions" />
		),
		cell: ({ row }) => {
			const news = row.original;
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
							onClick={() => navigate(`/news/${news.id}`)}
						>
							<Eye className="w-4 h-4 mr-2" /> View
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => navigate(`/news/${news.id}/edit`)}
						>
							<Edit className="w-4 h-4 mr-2" /> Edit
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		enableSorting: false,
	},
];
