import { TextInput, View } from 'react-native';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Auction } from '~/lib/types';
import { s, vs } from 'react-native-size-matters';
import CountDown from './CountDown';
import { timeSince } from '~/lib/utils';
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';
import AppShowMessage from '../shared/AppShowMessage';

interface domainCardProps {
	data: Auction;
	isLiked: boolean;
	toggleLike: (id: number) => void;
	onBid: (auctionId: number, amount: number) => void;
}

const DomainCard = (props: domainCardProps) => {
	const [bidAmount, setBidAmount] = useState('');

	const handleQuickBid = (increment: number) => {
		const base = props.data.current_bid;
		const newAmount = base + increment + 1;
		setBidAmount(newAmount.toString());
	};

	const handleBid = () => {
		if (!bidAmount) {
			AppShowMessage({
				message: 'Please enter a bid amount',
				type: 'warning',
			});
			return;
		}

		const numericValue = Number(bidAmount);
		if (isNaN(numericValue)) return;

		props.onBid(props.data.id, numericValue);
	};

	return (
		<Card className="p-4 mt-6">
			<View className="flex-row items-center justify-between">
				<Text className="font-bold text-2xl">{props.data.domain}</Text>
				<Badge variant={'outline'} className="flex-row gap-2">
					{/* <AntDesign name="eye" size={18} color="black" /> */}
					<Feather name="eye" size={14} color="black" />
					<Text>{props.data.watchers}</Text>
				</Badge>
			</View>
			<Text className="text-gray-600">{props.data.description}</Text>
			<View className="flex-row items-center justify-around mt-4">
				<View className="items-center">
					<Text className="text-secondary font-extrabold text-lg">
						KES {props.data.current_bid.toLocaleString()}
					</Text>
					<Text className=" text-gray-500">Current Bid</Text>
				</View>
				<View className="items-center">
					<Text className="text-secondary font-extrabold text-lg">
						{props.data.bids_count}
					</Text>
					<Text className=" text-gray-500">Bidders</Text>
				</View>
			</View>
			<View
				className="flex-row self-center min-w-[60%] justify-center items-center mt-4 bg-primary gap-2 rounded-lg"
				style={{
					paddingHorizontal: s(6),
					paddingVertical: vs(4),
					width: 'auto',
				}}
			>
				<Entypo name="stopwatch" size={14} color="white" />
				{<CountDown endTime={props.data.end_time} />}
			</View>
			<Text className="mt-6 text-lg font-semibold">
				Quick Bid Increments:
			</Text>
			<View className="flex-row gap-2">
				<View className="flex-1 gap-2">
					<Button
						className="flex-1"
						variant={'outline'}
						onPress={() => handleQuickBid(5000)}
					>
						<Text>+KES 5,000</Text>
					</Button>
					<Button
						className="flex-1"
						variant={'outline'}
						onPress={() => handleQuickBid(25000)}
					>
						<Text>+KES 25,000</Text>
					</Button>
				</View>
				<View className="flex-1 gap-2">
					<Button
						className="flex-1"
						variant={'outline'}
						onPress={() => handleQuickBid(10000)}
					>
						<Text>+KES 10,000</Text>
					</Button>
					<Button
						className="flex-1"
						variant={'outline'}
						onPress={() => handleQuickBid(50000)}
					>
						<Text>+KES 50,000</Text>
					</Button>
				</View>
			</View>
			<Text className="mt-6 text-lg font-semibold">
				Custom Bid Amount:
			</Text>
			<View className="flex-row items-center gap-2 mb-2">
				<TextInput
					placeholder={`Min: ${props.data.current_bid}`}
					value={bidAmount}
					onChangeText={setBidAmount}
					keyboardType="numeric"
					className="border flex-1 border-gray-300 rounded-md px-2 h-full py-2"
				/>

				<Button
					className="flex-row gap-2"
					onPress={handleBid}
					variant={'default'}
				>
					<FontAwesome name="gavel" size={16} color="white" />
					<Text className="font-bold text-lg">Bid</Text>
				</Button>
			</View>
			<Text className="mt-6 text-lg font-semibold">Recent Bids</Text>
			{props.data.top_four_bids?.map((item, idx) => (
				<View
					key={idx}
					className="mt-2 flex-row justify-between p-2 bg-gray-200/30 rounded-md"
				>
					<Text className="font-extrabold">
						{item.user_identifier + '  '}
						<Text className="font-light text-gray-700">
							{timeSince(item.created_at)}
						</Text>
					</Text>
					<Text className="font-extrabold text-secondary">
						KES {item.amount.toLocaleString()}
					</Text>
				</View>
			))}
			<View className="flex-row gap-2 mt-6">
				<Button
					onPress={handleBid}
					className="flex-row items-center gap-4 flex-1"
				>
					<FontAwesome name="gavel" size={16} color="white" />
					<Text className="font-bold">Place Bid</Text>
				</Button>

				<Button
					className="flex-row items-center gap-4 flex-1"
					variant={'outline'}
					onPress={() => {
						props.toggleLike(props.data.id);
					}}
				>
					{props.isLiked ? (
						<FontAwesome name="heart" size={18} color="red" />
					) : (
						<FontAwesome name="heart-o" size={18} color="black" />
					)}
					<Text className="font-bold">Watch</Text>
				</Button>
			</View>
		</Card>
	);
};

export default DomainCard;
