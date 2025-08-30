import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
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
import { BookUp, Edit, Eye, EyeOff, MoreHorizontal } from 'lucide-react';
import { JobPosting } from './JobPostingSchema';

export const JobPostingTableSchema = (
	navigate: (to: string) => void,
): ColumnDef<JobPosting>[] => [
	{
		accessorKey: 'title',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Position" />
		),
		cell: ({ row }) => {
			return (
				<>
					<p className="font-medium text-foreground">
						{row.original.title}
					</p>
					<p className="text-sm text-muted-foreground">
						{row.original.location}
					</p>
				</>
			);
		},
		filterFn: (row, _, filterValue) => {
			const title = row.original.title.toLowerCase();
			const location = row.original.location.toLowerCase();
			const search = filterValue.toLowerCase();

			return title.includes(search) || location.includes(search);
		},
		enableSorting: false,
	},
	{
		accessorKey: 'department_name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Department" />
		),
		cell: ({ row }) => <p>{row.original.department_name}</p>,
		filterFn: (row, _, filterValues) => {
			const department = row.original.department_name;
			return department.includes(filterValues.toLowerCase());
		},
		enableSorting: false,
	},
	{
		accessorKey: 'employment_type',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Type" />
		),
		cell: ({ row }) => (
			<Badge variant="default">
				{' '}
				{employmentTypeLabels[row.original.employment_type] ||
					row.original.employment_type}
			</Badge>
		),
		enableSorting: false,
		filterFn: (row, id, filterValues: string[]) => {
			return filterValues.includes(String(row.getValue(id)).toString());
		},
	},
	{
		accessorKey: 'salary_range',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Salary Range" />
		),
		cell: ({ row }) => (
			<p>
				{row.original.salary_range ? row.original.salary_range : 'N/A'}
			</p>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'number_of_applicants',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Applications" />
		),
		cell: ({ row }) => (
			<p>
				{row.original.number_of_applicants === 0
					? 'No applications'
					: row.original.number_of_applicants}
			</p>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'status',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => {
			const showCased = row.original.show_case;
			const published = row.original.published;
			return (
				<Badge
					variant={
						showCased && published
							? 'default'
							: !published
							? 'secondary'
							: 'outline'
					}
				>
					{showCased && published
						? 'Active'
						: !published
						? 'Draft'
						: 'Closed'}
				</Badge>
			);
		},
		filterFn: (row, _, filterValues: string[]) => {
			const status = getJobStatus(
				row.original.show_case,
				row.original.published,
			);
			return filterValues.includes(status);
		},
		enableSorting: false,
	},
	{
		accessorKey: 'published_at',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Posted" />
		),
		cell: ({ row }) => (
			<p>
				{row.original.published
					? row.original.published_at
						? format(row.original.published_at, 'ppp')
						: 'N/A'
					: 'Not Published'}
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
								navigate(`/job-postings/${row.original.id}`)
							}
						>
							<Eye className="w-4 h-4 mr-2" />
							View Job
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								navigate(
									`/job-postings/${row.original.id}/edit`,
								)
							}
						>
							<Edit className="w-4 h-4 mr-2" />
							Edit Job
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								navigate(
									`/job-postings/${row.original.id}?tab=applications`,
								)
							}
						>
							<Edit className="w-4 h-4 mr-2" />
							View Applications
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						{!row.original.published && (
							<DropdownMenuItem>
								<BookUp className="w-4 h-4 mr-2" />
								Publish Job
							</DropdownMenuItem>
						)}
						{row.original.published && (
							<DropdownMenuItem className="text-destructive">
								<EyeOff className="w-4 h-4 mr-2" />
								Hide Job
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		enableSorting: false,
	},
];

const employmentTypeLabels: Record<string, string> = {
	full_time: 'Full Time',
	part_time: 'Part Time',
	contract: 'Contract',
	internship: 'Internship',
};

function getJobStatus(
	showCase: boolean,
	published: boolean,
): 'Active' | 'Draft' | 'Closed' {
	if (showCase && published) return 'Active';
	if (!published) return 'Draft';
	return 'Closed';
}
