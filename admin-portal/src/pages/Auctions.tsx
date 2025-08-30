import { Button } from '@/components/ui/button';
import { Gavel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuctionStats from '@/components/auctions/AuctionStats';
import { AuctionTableSchema } from '@/components/auctions/AuctionTableSchema';
import { DataTable } from '@/components/table/data-table';
import RecentBids from '@/components/auctions/RecentBids';

const auctions = [
	{
		id: 1,
		domain: 'premiumgold.com',
		category: 'gold',
		description: 'Exclusive premium gold-level domain for luxury brands.',
		current_bid: 2500.0,
		start_price: 1000.0,
		start_time: '2025-08-25T10:00:00Z',
		end_time: '2025-09-05T10:00:00Z',
		watchers: 15,
		bids_count: 8,
		status: 'active',
		created_by: 1,
		created_at: '2025-08-20T12:00:00Z',
		updated_by: 1,
		updated_at: '2025-08-28T12:00:00Z',
	},
	{
		id: 2,
		domain: 'fastsilver.net',
		category: 'silver',
		description: 'Perfect domain for a tech or fintech startup.',
		current_bid: 850.0,
		start_price: 500.0,
		start_time: '2025-08-22T09:00:00Z',
		end_time: '2025-09-03T09:00:00Z',
		watchers: 10,
		bids_count: 4,
		status: 'completed',
		created_by: 2,
		created_at: '2025-08-19T08:00:00Z',
		updated_by: 2,
		updated_at: '2025-08-28T08:00:00Z',
	},
	{
		id: 3,
		domain: 'platinumbrands.org',
		category: 'platinum',
		description: 'Domain suitable for corporate and global enterprises.',
		current_bid: 10000.0,
		start_price: 5000.0,
		start_time: '2025-08-21T11:00:00Z',
		end_time: '2025-09-10T11:00:00Z',
		watchers: 25,
		bids_count: 12,
		status: 'cancelled',
		created_by: 3,
		created_at: '2025-08-18T11:00:00Z',
		updated_by: 3,
		updated_at: '2025-08-28T11:00:00Z',
	},
	{
		id: 4,
		domain: 'goldrush.io',
		category: 'gold',
		description: 'A short, memorable name ideal for crypto or mining.',
		current_bid: 4200.0,
		start_price: 2000.0,
		start_time: '2025-08-20T15:00:00Z',
		end_time: '2025-09-06T15:00:00Z',
		watchers: 8,
		bids_count: 6,
		status: 'active',
		created_by: 1,
		created_at: '2025-08-17T10:00:00Z',
		updated_by: 1,
		updated_at: '2025-08-28T10:00:00Z',
	},
	{
		id: 5,
		domain: 'silversolutions.co',
		category: 'silver',
		description: 'Ideal for consulting and professional services.',
		current_bid: 1200.0,
		start_price: 600.0,
		start_time: '2025-08-24T13:00:00Z',
		end_time: '2025-09-07T13:00:00Z',
		watchers: 5,
		bids_count: 3,
		status: 'active',
		created_by: 2,
		created_at: '2025-08-20T09:00:00Z',
		updated_by: 2,
		updated_at: '2025-08-28T09:00:00Z',
	},
	{
		id: 6,
		domain: 'platinumventures.com',
		category: 'platinum',
		description: 'A top-tier domain name perfect for investments.',
		current_bid: 22000.0,
		start_price: 15000.0,
		start_time: '2025-08-19T14:00:00Z',
		end_time: '2025-09-12T14:00:00Z',
		watchers: 40,
		bids_count: 20,
		status: 'active',
		created_by: 4,
		created_at: '2025-08-16T14:00:00Z',
		updated_by: 4,
		updated_at: '2025-08-28T14:00:00Z',
	},
	{
		id: 7,
		domain: 'goldenhub.org',
		category: 'gold',
		description: 'Community-driven domain for networks and groups.',
		current_bid: 900.0,
		start_price: 400.0,
		start_time: '2025-08-23T12:00:00Z',
		end_time: '2025-09-04T12:00:00Z',
		watchers: 6,
		bids_count: 2,
		status: 'active',
		created_by: 3,
		created_at: '2025-08-18T12:00:00Z',
		updated_by: 3,
		updated_at: '2025-08-28T12:00:00Z',
	},
	{
		id: 8,
		domain: 'silverstack.app',
		category: 'silver',
		description: 'Catchy domain for a SaaS or fintech platform.',
		current_bid: 1500.0,
		start_price: 700.0,
		start_time: '2025-08-26T16:00:00Z',
		end_time: '2025-09-09T16:00:00Z',
		watchers: 12,
		bids_count: 5,
		status: 'active',
		created_by: 2,
		created_at: '2025-08-21T16:00:00Z',
		updated_by: 2,
		updated_at: '2025-08-28T16:00:00Z',
	},
];

const categories = [
	{
		value: 'gold',
		label: 'Gold',
	},
	{
		value: 'silver',
		label: 'Silver',
	},
	{
		value: 'platinum',
		label: 'Platinum',
	},
];

const status = [
	{
		value: 'active',
		label: 'ACTIVE',
	},
	{
		value: 'completed',
		label: 'COMPLETED',
	},
	{
		value: 'cancelled',
		label: 'CANCELLED',
	},
];

function Auctions() {
	const navigate = useNavigate();
	return (
		<div className="space-y-6 p-4 bg-gray-100">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Domain Auctions
					</h1>
					<p className="text-muted-foreground">
						Manage certified .ke domain registrars and their Manage
						premium .ke domain auctions and bidding
					</p>
				</div>
				<Button className="gradient-primary cursor-pointer hover:accent-hover shadow-glow">
					<Gavel className="w-4 h-4 mr-2" />
					Create New Auction
				</Button>
			</div>

			<AuctionStats auctions={auctions} />

			<DataTable
				data={auctions}
				columns={AuctionTableSchema(navigate)}
				searchableColumns={[
					{
						id: 'domain',
						title: 'Domain',
					},
				]}
				facetedFilterColumns={[
					{
						id: 'category',
						title: 'Category',
						options: categories,
					},
					{
						id: 'status',
						title: 'Status',
						options: status,
					},
				]}
			/>

			<RecentBids />
		</div>
	);
}

export default Auctions;
