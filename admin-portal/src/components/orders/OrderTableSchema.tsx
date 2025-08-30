import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import DataTableColumnHeader from '../table/data-table-column-header';
import { Button } from '../ui/button';
import {
	Eye,
	Edit,
	Mail,
	MapPin,
	MoreHorizontal,
	Phone,
	Wallet,
} from 'lucide-react';
import { Order } from './OrderSchema';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const OrderTableSchema = (
	navigate: (to: string) => void,
): ColumnDef<Order>[] => [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Order" />
		),
		cell: ({ row }) => {
			const order = row.original;
			return (
				<div className="flex flex-col">
					<p className="font-medium text-foreground">
						Order #{order.id}
					</p>
					<p className="text-sm text-muted-foreground">
						{order.order_details.first_name}{' '}
						{order.order_details.last_name}
					</p>
				</div>
			);
		},
		enableSorting: true,
	},
	{
		accessorKey: 'contact',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Contact" />
		),
		cell: ({ row }) => {
			const details = row.original.order_details;
			return (
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<Mail className="w-4 h-4 text-muted-foreground" />
						<p>{details.email}</p>
					</div>
					<div className="flex items-center gap-2">
						<Phone className="w-4 h-4 text-muted-foreground" />
						<p>{details.phone_number}</p>
					</div>
					<div className="flex items-center gap-2">
						<MapPin className="w-4 h-4 text-muted-foreground" />
						<p>
							{details.address}, {details.city},{' '}
							{details.postal_code}
						</p>
					</div>
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: 'payment',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Payment" />
		),
		cell: ({ row }) => {
			const order = row.original;
			const details = order.order_details;
			return (
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<Wallet className="w-4 h-4 text-muted-foreground" />
						<p className="font-medium">
							KES {order.amount.toFixed(2)}
						</p>
					</div>
					<p className="text-sm text-muted-foreground">
						{details.payment_method}
					</p>
					<Badge
						variant={
							order.payment_status ? 'default' : 'destructive'
						}
					>
						{order.payment_status ? 'Paid' : 'Unpaid'}
					</Badge>
				</div>
			);
		},
		filterFn: (row, _, filterValues: string[]) => {
			const status = row.original.payment_status ? 'paid' : 'unpaid';
			return filterValues.includes(status);
		},
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
				<Badge variant={statusBadgeVariant[status] || 'secondary'}>
					{statusLabels[status] || status}
				</Badge>
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
		cell: ({ row }) => {
			const order = row.original;
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
							onClick={() => navigate(`/orders/${order.id}`)}
						>
							<Eye className="w-4 h-4 mr-2" />
							View Order
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => navigate(`/orders/${order.id}/edit`)}
						>
							<Edit className="w-4 h-4 mr-2" />
							Edit Order
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		enableSorting: false,
	},
];

// Status labels & badge variants
const statusLabels: Record<string, string> = {
	pending: 'Pending',
	processing: 'Processing',
	delivering: 'Delivering',
	delivered: 'Delivered',
	cancelled: 'Cancelled',
};

const statusBadgeVariant: Record<
	string,
	'default' | 'secondary' | 'destructive'
> = {
	pending: 'secondary',
	processing: 'default',
	delivering: 'default',
	delivered: 'default',
	cancelled: 'destructive',
};
