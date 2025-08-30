import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import DataTableColumnHeader from '../table/data-table-column-header';
import { Button } from '../ui/button';
import { Eye } from 'lucide-react';
import { JobApplication } from './JobApplicationSchema';

export const JobApplicationTableSchema = (
	navigate: (to: string) => void,
): ColumnDef<JobApplication>[] => [
	{
		accessorKey: 'job_id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Job ID" />
		),
		cell: ({ row }) => (
			<p>{`JOB_${String(row.getValue('job_id')).padStart(3, '0')}`}</p>
		),
		enableSorting: true,
		enableHiding: true,
	},
	{
		accessorKey: 'full_name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Applicant" />
		),
		cell: ({ row }) => (
			<>
				<p className="font-medium text-foreground">
					{row.original.full_name}
				</p>
				<p className="text-sm text-muted-foreground">
					{row.original.email}
				</p>
			</>
		),
		filterFn: (row, _, filterValue) => {
			const fullName = row.original.full_name.toLowerCase();
			const email = row.original.email.toLowerCase();
			const search = filterValue.toLowerCase();
			return (
				fullName.includes(search) ||
				email.includes(search) ||
				row.original.phone_number.includes(search)
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: 'phone_number',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Phone" />
		),
		cell: ({ row }) => <p>{row.original.phone_number}</p>,
		enableSorting: false,
	},
	{
		accessorKey: 'status',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => {
			const status = row.original.status;
			return (
				<Badge variant={statusBadgeVariant[status]}>
					{statusLabels[status]}
				</Badge>
			);
		},
		filterFn: (row, _, filterValues: string[]) => {
			const status = row.original.status;
			return filterValues.includes(status);
		},
		enableSorting: false,
	},
	{
		accessorKey: 'submitted_at',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Submitted" />
		),
		cell: ({ row }) => (
			<p>{format(new Date(row.original.submitted_at), 'PPpp')}</p>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'resume_url',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Resume" />
		),
		cell: ({ row }) => (
			<a
				href={row.original.resume_url}
				target="_blank"
				rel="noopener noreferrer"
				className="text-blue-600 underline"
			>
				View Resume
			</a>
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
				<Button
					onClick={() => navigate(`/applications/${row.original.id}`)}
				>
					<Eye />
				</Button>
			);
		},
		enableSorting: false,
	},
];

const statusLabels: Record<JobApplication['status'], string> = {
	pending: 'Pending',
	reviewed: 'Reviewed',
	shortlisted: 'Shortlisted',
	rejected: 'Rejected',
	hired: 'Hired',
};

const statusBadgeVariant: Record<
	JobApplication['status'],
	'default' | 'secondary' | 'outline' | 'destructive'
> = {
	pending: 'secondary',
	reviewed: 'outline',
	shortlisted: 'default',
	rejected: 'destructive',
	hired: 'default',
};
