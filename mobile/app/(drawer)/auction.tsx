import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';
import DomainCard from '~/components/auction/DomainCard';
import ModalToLogo from '~/components/modal/ModalToLogo';
import AppSafeView from '~/components/shared/AppSafeView';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Text } from '~/components/ui/text';

const data = [
	{
		id: 1,
		domain: 'techhub.com',
		category: 'gold',
		description: 'A premium domain for technology startups.',
		current_bid: 45000,
		start_price: 1000,
		start_time: '2025-08-20T10:00:00Z',
		end_time: '2025-08-27T10:00:00Z',
		watchers: '23',
		bids_count: '12',
		status: 'active',
		top_three_bidders: [
			{
				id: 1,
				auction_id: 1,
				user_identifier: 101,
				amount: 4500,
				user_id: 'u1',
				created_at: '2025-08-20T12:15:00Z',
			},
			{
				id: 2,
				auction_id: 1,
				user_identifier: 102,
				amount: 4200,
				user_id: 'u2',
				created_at: '2025-08-21T09:45:00Z',
			},
			{
				id: 3,
				auction_id: 1,
				user_identifier: 103,
				amount: 4000,
				user_id: 'u3',
				created_at: '2025-08-22T14:30:00Z',
			},
		],
	},
	{
		id: 2,
		domain: 'greenliving.org',
		category: 'bronze',
		description:
			'Ideal domain for sustainability and eco-friendly projects.',
		current_bid: 3200,
		start_price: 800,
		start_time: '2025-08-21T14:00:00Z',
		end_time: '2025-08-28T14:00:00Z',
		watchers: '15',
		bids_count: '9',
		status: 'active',
		top_three_bidders: [
			{
				id: 4,
				auction_id: 2,
				user_identifier: 104,
				amount: 3200,
				user_id: 'u4',
				created_at: '2025-08-21T15:10:00Z',
			},
			{
				id: 5,
				auction_id: 2,
				user_identifier: 105,
				amount: 3000,
				user_id: 'u5',
				created_at: '2025-08-22T11:20:00Z',
			},
			{
				id: 6,
				auction_id: 2,
				user_identifier: 106,
				amount: 2800,
				user_id: 'u6',
				created_at: '2025-08-23T08:40:00Z',
			},
		],
	},
	{
		id: 3,
		domain: 'fitlife.net',
		category: 'silver',
		description: 'Perfect domain for a fitness or lifestyle brand.',
		current_bid: 1500,
		start_price: 500,
		start_time: '2025-08-19T09:00:00Z',
		end_time: '2025-08-26T09:00:00Z',
		watchers: '10',
		bids_count: '7',
		status: 'active',
		top_three_bidders: [
			{
				id: 7,
				auction_id: 3,
				user_identifier: 107,
				amount: 1500,
				user_id: 'u7',
				created_at: '2025-08-19T10:00:00Z',
			},
			{
				id: 8,
				auction_id: 3,
				user_identifier: 108,
				amount: 1400,
				user_id: 'u8',
				created_at: '2025-08-20T13:15:00Z',
			},
			{
				id: 9,
				auction_id: 3,
				user_identifier: 109,
				amount: 1300,
				user_id: 'u9',
				created_at: '2025-08-21T16:45:00Z',
			},
		],
	},
	{
		id: 4,
		domain: 'foodiesdelight.co',
		category: 'bronze',
		description:
			'Domain for restaurants, food bloggers, or delivery services.',
		current_bid: 2750,
		start_price: 700,
		start_time: '2025-08-18T12:00:00Z',
		end_time: '2025-08-25T12:00:00Z',
		watchers: '18',
		bids_count: '11',
		status: 'active',
		top_three_bidders: [
			{
				id: 10,
				auction_id: 4,
				user_identifier: 110,
				amount: 2750,
				user_id: 'u10',
				created_at: '2025-08-18T13:30:00Z',
			},
			{
				id: 11,
				auction_id: 4,
				user_identifier: 111,
				amount: 2600,
				user_id: 'u11',
				created_at: '2025-08-19T09:10:00Z',
			},
			{
				id: 12,
				auction_id: 4,
				user_identifier: 112,
				amount: 2500,
				user_id: 'u12',
				created_at: '2025-08-20T18:00:00Z',
			},
		],
	},
	{
		id: 5,
		domain: 'luxuryhomes.io',
		category: 'gold',
		description: 'Premium domain for luxury real estate listings.',
		current_bid: 8000,
		start_price: 2000,
		start_time: '2025-08-22T16:00:00Z',
		end_time: '2025-08-29T16:00:00Z',
		watchers: '30',
		bids_count: '15',
		status: 'active',
		top_three_bidders: [
			{
				id: 13,
				auction_id: 5,
				user_identifier: 113,
				amount: 8000,
				user_id: 'u13',
				created_at: '2025-08-22T17:25:00Z',
			},
			{
				id: 14,
				auction_id: 5,
				user_identifier: 114,
				amount: 7700,
				user_id: 'u14',
				created_at: '2025-08-23T12:40:00Z',
			},
			{
				id: 15,
				auction_id: 5,
				user_identifier: 115,
				amount: 7500,
				user_id: 'u15',
				created_at: '2025-08-24T15:55:00Z',
			},
		],
	},
];

interface IdomainCategory {
	id: number;
	name: string;
	label: string;
	icon: keyof typeof Feather.glyphMap;
}

const domainCategories: IdomainCategory[] = [
	{
		id: 1,
		name: 'all',
		label: 'All',
		icon: 'filter',
	},
	{
		id: 2,
		name: 'gold',
		label: 'Gold',
		icon: 'star',
	},
	{
		id: 3,
		name: 'bronze',
		label: 'Bronze',
		icon: 'award',
	},
	{
		id: 4,
		name: 'silver',
		label: 'Silver',
		icon: 'pocket',
	},
];

const Auction = () => {
	const [domainCategory, setDomainCategory] = useState('gold');
	return (
		<AppSafeView>
			<View className="flex-1 px-4">
				<FlatList
					data={data}
					keyExtractor={(item) => item.id.toString()}
					ListHeaderComponent={() => (
						<>
							<ModalToLogo
								title="Domain Auctions"
								subtitle="Bid on premium .KE domains"
								icon={
									<FontAwesome
										name="gavel"
										size={32}
										color="white"
									/>
								}
							/>
							<Card className="p-4 mt-6">
								<View className="flex-row gap-2 items-center mb-4">
									<AntDesign
										name="filter"
										size={18}
										color="black"
									/>
									<Text className="font-bold">
										Filter by:
									</Text>
								</View>
								<View className="flex-row items-center gap-2 mb-2">
									<TextInput
										placeholder="john.doe@example.com"
										value={''}
										className="border flex-1 border-gray-300 rounded-md px-4 py-2 h-full"
									/>

									<Button variant={'default'}>
										<Text>Search</Text>
									</Button>
								</View>
								<View className="flex-row flex-wrap gap-2">
									{domainCategories.map((item, idx) => {
										const isSelected =
											domainCategory === item.name;
										return (
											<Button
												key={idx}
												variant={
													isSelected
														? 'default'
														: 'outline'
												}
												size={'sm'}
												onPress={() =>
													setDomainCategory(item.name)
												}
												style={{ gap: 3 }}
												className="flex-row px-2 items-center"
											>
												<Feather
													name={item.icon}
													size={16}
													color={
														isSelected
															? 'white'
															: 'black'
													}
												/>
												<Text
													className={`font-bold
														${isSelected ? '' : ''}
													`}
												>
													{item.label}
												</Text>
											</Button>
										);
									})}
								</View>
							</Card>
						</>
					)}
					renderItem={({ item, index }) => (
						<DomainCard key={index} data={item} />
					)}
					showsVerticalScrollIndicator={false}
				/>
			</View>
		</AppSafeView>
	);
};

export default Auction;
