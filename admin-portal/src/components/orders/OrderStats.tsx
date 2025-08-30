import { Card, CardContent } from '@/components/ui/card';
import {
	Package,
	Truck,
	CheckCircle,
	XCircle,
	Wallet,
	Clock,
} from 'lucide-react';
import { Order } from './OrderSchema';
import { Payment } from './PaymentSchema';

type StatItem<T> = {
	label: string;
	value: (items: T[]) => number;
	icon: React.ComponentType<{ className?: string }>;
	iconClass?: string;
};

const orderStats: StatItem<Order>[] = [
	{
		label: 'Total Orders',
		value: (orders) => orders.length,
		icon: Package,
		iconClass: 'text-primary',
	},
	{
		label: 'Pending Orders',
		value: (orders) => orders.filter((o) => o.status === 'pending').length,
		icon: Clock,
		iconClass: 'text-orange-500',
	},
	{
		label: 'Delivering Orders',
		value: (orders) =>
			orders.filter((o) => o.status === 'delivering').length,
		icon: Truck,
		iconClass: 'text-accent',
	},
	{
		label: 'Delivered Orders',
		value: (orders) =>
			orders.filter((o) => o.status === 'delivered').length,
		icon: CheckCircle,
		iconClass: 'text-green-600',
	},
];

const paymentStats: StatItem<Payment>[] = [
	{
		label: 'Total Payments',
		value: (payments) => payments.length,
		icon: Wallet,
		iconClass: 'text-primary',
	},
	{
		label: 'Paid',
		value: (payments) => payments.filter((p) => p.status).length,
		icon: CheckCircle,
		iconClass: 'text-green-600',
	},
	{
		label: 'Unpaid',
		value: (payments) => payments.filter((p) => !p.status).length,
		icon: XCircle,
		iconClass: 'text-red-500',
	},
	{
		label: 'Total Amount',
		value: (payments) =>
			Math.round(payments.reduce((sum, p) => sum + p.amount, 0)),
		icon: Wallet,
		iconClass: 'text-accent',
	},
];

type OrderStatsProps = { orders: Order[] };
type PaymentStatsProps = { payments: Payment[] };

export function OrderStats({ orders }: OrderStatsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
			{orderStats.map((stat, i) => {
				const Icon = stat.icon;
				return (
					<Card key={i}>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										{stat.label}
									</p>
									<p className="text-2xl font-bold text-foreground">
										{stat.value(orders)}
									</p>
								</div>
								<Icon className={`w-8 h-8 ${stat.iconClass}`} />
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}

export function PaymentStats({ payments }: PaymentStatsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
			{paymentStats.map((stat, i) => {
				const Icon = stat.icon;
				return (
					<Card key={i}>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										{stat.label}
									</p>
									<p className="text-2xl font-bold text-foreground">
										{stat.value(payments)}
									</p>
								</div>
								<Icon className={`w-8 h-8 ${stat.iconClass}`} />
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
