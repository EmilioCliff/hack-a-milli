import { Card, CardContent } from '@/components/ui/card';
import { Gavel, Users, Clock, Eye } from 'lucide-react';
import { Auction } from './AuctionSchema';

type StatItem = {
	label: string;
	value: (auctions: Auction[]) => number;
	icon: React.ComponentType<{ className?: string }>;
	iconClass?: string;
};

const stats: StatItem[] = [
	{
		label: 'Active Auctions',
		value: (auctions) =>
			auctions.filter((a) => a.status === 'active').length,
		icon: Gavel,
		iconClass: 'text-primary',
	},
	{
		label: 'Total Bids',
		value: (auctions) => auctions.reduce((sum, a) => sum + a.bids_count, 0),
		icon: Users,
		iconClass: 'text-accent',
	},
	{
		label: 'Ending Soon',
		value: (auctions) => {
			const now = new Date();
			return auctions.filter(
				(a) =>
					a.status === 'active' &&
					new Date(a.end_time).getTime() - now.getTime() <
						1000 * 60 * 60 * 24, // within 24h
			).length;
		},
		icon: Clock,
		iconClass: 'text-orange-500',
	},
	{
		label: 'Total Watchers',
		value: (auctions) => auctions.reduce((sum, a) => sum + a.watchers, 0),
		icon: Eye,
		iconClass: 'text-primary',
	},
];

type AuctionStatsProps = {
	auctions: Auction[];
};

function AuctionStats({ auctions }: AuctionStatsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
			{stats.map((stat, i) => {
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
										{stat.value(auctions)}
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

export default AuctionStats;
