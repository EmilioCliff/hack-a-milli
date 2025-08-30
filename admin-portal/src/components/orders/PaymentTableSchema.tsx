import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import DataTableColumnHeader from '../table/data-table-column-header';
import { Button } from '../ui/button';
import { Eye, Edit, MoreHorizontal, Wallet, User } from 'lucide-react';
import { Payment } from './PaymentSchema';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Payment table schema
export const PaymentTableSchema = (
	navigate: (to: string) => void,
): ColumnDef<Payment>[] => [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Payment ID" />
		),
		cell: ({ row }) => {
			const payment = row.original;
			return (
				<div className="flex flex-col">
					<p className="font-medium text-foreground">
						PMNT #{payment.id}
					</p>
					<p className="text-sm text-muted-foreground">
						Order #{payment.order_id}
					</p>
				</div>
			);
		},
		enableSorting: true,
	},
	{
		accessorKey: 'user_id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="User" />
		),
		cell: ({ row }) => {
			const payment = row.original;
			return (
				<div className="flex items-center gap-2">
					<User className="w-4 h-4 text-muted-foreground" />
					<p>
						{payment.user_id ? `User #${payment.user_id}` : 'Guest'}
					</p>
				</div>
			);
		},
		enableSorting: true,
	},
	{
		accessorKey: 'amount',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Amount" />
		),
		cell: ({ row }) => {
			const payment = row.original;
			return (
				<div className="flex items-center gap-2">
					<Wallet className="w-4 h-4 text-muted-foreground" />
					<p className="font-medium">
						KES {payment.amount.toFixed(2)}
					</p>
				</div>
			);
		},
		enableSorting: true,
	},
	{
		accessorKey: 'payment_method',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Method" />
		),
		cell: ({ row }) => {
			const method = row.original.payment_method;
			return <p>{paymentMethodsLabes[method]}</p>;
		},
		filterFn: (row, _, filterValues: string[]) => {
			const method = row.original.payment_method;
			return filterValues.includes(method);
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
				<Badge variant={status ? 'default' : 'destructive'}>
					{status ? 'Completed' : 'Failed'}
				</Badge>
			);
		},
		filterFn: (row, _, filterValues: string[]) => {
			const status = row.original.status ? 'completed' : 'failed';
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
			const payment = row.original;
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
							onClick={() => navigate(`/payments/${payment.id}`)}
						>
							<Eye className="w-4 h-4 mr-2" />
							View Payment
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								navigate(`/payments/${payment.id}/edit`)
							}
						>
							<Edit className="w-4 h-4 mr-2" />
							Edit Payment
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		enableSorting: false,
	},
];

const paymentMethodsLabes: Record<string, string> = {
	mpesa: 'M-Pesa',
	card: 'Card',
	bank: 'Bank Transfer',
};
