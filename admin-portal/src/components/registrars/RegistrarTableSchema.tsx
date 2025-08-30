import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import DataTableColumnHeader from '../table/data-table-column-header';
import { Button } from '../ui/button';
import {
	Edit,
	Eye,
	Globe,
	Mail,
	MapPin,
	MoreHorizontal,
	Phone,
} from 'lucide-react';
import { Registrar } from './RegistrarSchema';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const RegistrarTableSchema = (
	navigate: (to: string) => void,
): ColumnDef<Registrar>[] => [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Registrar" />
		),
		cell: ({ row }) => {
			const registrar = row.original;
			return (
				<div className="flex items-center gap-3">
					<Avatar className="w-10 h-10">
						<AvatarImage src={registrar.logo_url || ''} />
						<AvatarFallback className="bg-primary text-primary-foreground">
							{registrar.name
								.split(' ')
								.map((n) => n[0])
								.join('')}
						</AvatarFallback>
					</Avatar>
					<div className="text-start">
						<p className="font-medium text-foreground">
							{registrar.name}
						</p>
						<div className="flex flex-row items-center gap-2">
							<Globe className="w-4 h-4 text-muted-foreground" />
							<a
								href={row.original.website_url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-accent hover:underline"
							>
								{extractDomain(registrar.website_url)}
							</a>
						</div>
					</div>
				</div>
			);
		},
		filterFn: (row, _columnId, filterValue) => {
			const registrar = row.original;
			if (!filterValue) return true;

			const search = filterValue.toLowerCase();
			return (
				registrar.name.toLowerCase().includes(search) ||
				registrar.website_url.toLowerCase().includes(search)
			);
		},
		enableSorting: true,
	},
	{
		accessorKey: 'Contact',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Contact" />
		),
		cell: ({ row }) => (
			<div>
				<div className="flex flex-row gap-2 items-center">
					<Mail className="w-4 h-4 text-muted-foreground" />
					<p>{row.original.email}</p>
				</div>
				<div className="flex flex-row gap-2 items-center">
					<Phone className="w-4 h-4 text-muted-foreground" />
					<p>{row.original.phone_number}</p>
				</div>
				<div className="flex flex-row gap-2 items-center">
					<MapPin className="w-4 h-4 text-muted-foreground" />
					<p>{row.original.address}</p>
				</div>
			</div>
		),
		filterFn: (row, _columnId, filterValue) => {
			const registrar = row.original;
			if (!filterValue) return true;

			const search = filterValue.toLowerCase();
			return (
				registrar.email.toLowerCase().includes(search) ||
				registrar.address.toLowerCase().includes(search)
			);
		},
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
		accessorKey: 'specialities',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Specialities" />
		),
		cell: ({ row }) => {
			const specialities = row.original.specialities || [];
			const shown = specialities.slice(0, 2);
			const remaining = specialities.length - shown.length;

			return (
				<div className="flex flex-wrap gap-1">
					{shown.map((s, i) => (
						<Badge key={i} variant="outline">
							{s}
						</Badge>
					))}
					{remaining > 0 && (
						<Badge variant="secondary">+{remaining}</Badge>
					)}
				</div>
			);
		},
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
						<DropdownMenuItem>
							<Eye className="w-4 h-4 mr-2" />
							View Registrar
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								navigate(`/users/${row.original.id}/edit`)
							}
						>
							<Edit className="w-4 h-4 mr-2" />
							Edit Registrar
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		enableSorting: false,
	},
];

const statusLabels: Record<Registrar['status'], string> = {
	active: 'Active',
	inactive: 'Inactive',
	suspended: 'Suspended',
};

const statusBadgeVariant: Record<
	Registrar['status'],
	'default' | 'secondary' | 'destructive'
> = {
	active: 'default',
	inactive: 'secondary',
	suspended: 'destructive',
};

function extractDomain(url: string) {
	try {
		const hostname = new URL(url).hostname;
		return hostname.replace(/^www\./, ''); // remove 'www.'
	} catch (e) {
		return url; // fallback if it's not a valid URL
	}
}
