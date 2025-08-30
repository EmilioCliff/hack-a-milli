import { Gavel } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

const bids = [
	{
		id: 1,
		auctionId: 1,
		domain: 'premium.ke',
		bidder: 'TechCorp Kenya',
		amount: 'KES 125,000',
		timestamp: '2024-01-15 14:30',
		status: 'Winning',
	},
	{
		id: 2,
		auctionId: 1,
		domain: 'premium.ke',
		bidder: 'Digital Solutions',
		amount: 'KES 120,000',
		timestamp: '2024-01-15 13:45',
		status: 'Outbid',
	},
	{
		id: 3,
		auctionId: 2,
		domain: 'finance.ke',
		bidder: 'Capital Bank',
		amount: 'KES 85,000',
		timestamp: '2024-01-15 16:20',
		status: 'Winning',
	},
];

function RecentBids() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Bids</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{bids.map((bid) => (
						<div
							key={bid.id}
							className="flex items-center justify-between p-4 border rounded-lg"
						>
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
									<Gavel className="w-5 h-5 text-primary" />
								</div>
								<div>
									<p className="font-medium text-foreground">
										{bid.bidder}
									</p>
									<p className="text-sm text-muted-foreground">
										bid on {bid.domain}
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-bold text-accent">
									{bid.amount}
								</p>
								<p className="text-sm text-muted-foreground">
									{bid.timestamp}
								</p>
							</div>
							<Badge
								className={
									bid.status === 'Winning'
										? 'bg-green-100 text-green-800'
										: 'bg-red-100 text-red-800'
								}
							>
								{bid.status}
							</Badge>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default RecentBids;
