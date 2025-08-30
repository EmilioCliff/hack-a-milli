import { BookOpenIcon, ShoppingCart, UserCheck, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const stats = [
	{
		title: 'Total Users',
		value: '24,847',
		icon: Users,
	},
	{
		title: 'Active Registrars',
		value: '156',
		icon: UserCheck,
	},
	{
		title: 'Domain Auctions',
		value: '1,234',
		icon: ShoppingCart,
	},
	{
		title: 'Published Blogs',
		value: '23',
		icon: BookOpenIcon,
	},
];

function DashboardStats() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat, index) => (
				<Card
					key={index}
					className="shadow-soft transition-smooth hover:shadow-medium"
				>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							{stat.title}
						</CardTitle>
						<stat.icon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-foreground">
							{stat.value}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

export default DashboardStats;
