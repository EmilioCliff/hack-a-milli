import { ColumnDef } from '@tanstack/react-table';
import DataTableColumnHeader from '../table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { Eye, MoreHorizontal, Users, Gavel, Coins, Square } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Auction } from './AuctionSchema';

export const AuctionTableSchema = (
	navigate: (to: string) => void,
): ColumnDef<Auction>[] => [
	{
		accessorKey: 'domain',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Domain" />
		),
		cell: ({ row }) => (
			<div className="font-medium text-foreground">
				{row.original.domain}
			</div>
		),
		filterFn: (row, _, filterValue) => {
			const domain = row.original.domain.toLowerCase();
			const search = filterValue.toLowerCase();
			return domain.includes(search);
		},
		enableSorting: true,
	},
	{
		accessorKey: 'category',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Category" />
		),
		cell: ({ row }) => (
			<Badge variant={categoryBadgeVariant[row.original.category]}>
				{categoryLabels[row.original.category]}
			</Badge>
		),
		enableSorting: true,
	},
	{
		accessorKey: 'current_bid',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Current Bid" />
		),
		cell: ({ row }) => (
			<>
				<div className="flex items-center gap-1">
					<Coins className="w-4 h-4 text-muted-foreground" />
					<span>KES {row.original.current_bid.toLocaleString()}</span>
				</div>
				<p className="text-muted-foreground">
					Start: KES {row.original.start_price.toLocaleString()}
				</p>
			</>
		),
		enableSorting: true,
	},

	{
		accessorKey: 'bids_count',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Bids" />
		),
		cell: ({ row }) => (
			<div className="flex items-center gap-1">
				<Gavel className="w-4 h-4 text-muted-foreground" />
				<span>{row.original.bids_count}</span>
			</div>
		),
		enableSorting: true,
	},
	{
		accessorKey: 'watchers',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Watchers" />
		),
		cell: ({ row }) => (
			<div className="flex items-center gap-1">
				<Users className="w-4 h-4 text-muted-foreground" />
				<span>{row.original.watchers}</span>
			</div>
		),
		enableSorting: true,
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
		accessorKey: 'end_time',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Ends At" />
		),
		cell: ({ row }) => {
			const end = new Date(row.original.end_time);
			return (
				<div className="flex items-center gap-1">
					<span>{end.toLocaleString()}</span>
				</div>
			);
		},
		enableSorting: true,
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
								navigate(`/auctions/${row.original.id}`)
							}
						>
							<Eye className="w-4 h-4 mr-2" />
							View Details
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								navigate(`/auctions/${row.original.id}`)
							}
						>
							<Users className="w-4 h-4 mr-2" />
							View Bidders
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() =>
								navigate(`/auctions/${row.original.id}/edit`)
							}
							className="text-destructive focus:bg-transparent focus:text-destructive"
						>
							<Square className="w-4 h-4 mr-2 text-destructive" />
							End Early
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		enableSorting: false,
	},
];

const statusLabels: Record<Auction['status'], string> = {
	active: 'Active',
	completed: 'Completed',
	cancelled: 'Cancelled',
};

const statusBadgeVariant: Record<
	Auction['status'],
	'default' | 'secondary' | 'destructive'
> = {
	active: 'default',
	completed: 'secondary',
	cancelled: 'destructive',
};

const categoryLabels: Record<Auction['category'], string> = {
	gold: 'Gold',
	silver: 'Silver',
	platinum: 'Platinum',
};

const categoryBadgeVariant: Record<
	Auction['category'],
	'default' | 'secondary' | 'destructive'
> = {
	gold: 'default',
	silver: 'secondary',
	platinum: 'destructive',
};
