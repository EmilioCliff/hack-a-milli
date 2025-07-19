import { View } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Feather } from '@expo/vector-icons';

export default function SearchDomain() {
	return (
		<View className="flex gap-4 m-4 p-6 rounded-3xl bg-primary ">
			<View className="absolute bottom-5 left-4 w-12 h-12 bg-white/15 rounded-full animate-bounce"></View>
			<View className="flex flex-row justify-between items-center">
				<View>
					<Text className="font-bold text-3xl  text-white">
						Find Your Perfect
					</Text>
					<View className="flex flex-row gap-2">
						<Text className="text-xl text-white">.ke Domain</Text>
						<View className="relative">
							<Text className="text-xl text-white animate-pulse">
								.ke
							</Text>
							<View className="absolute -top-1 left-3/4 w-2 h-2 bg-green-400 rounded-full animate-ping"></View>
						</View>
					</View>
				</View>
				<View className="bg-white/40 p-2 mb-2 rounded-full">
					<Feather
						className="animate-spin"
						style={{ animationDuration: '8s' }}
						name="globe"
						size={28}
						color="white"
					/>
				</View>
			</View>
			<Text className="text-white">
				Secure your Kenyan digital identity with our trusted registarts
			</Text>
			<View>
				<View className="p-4 bg-white/20 rounded-lg">
					<View className="flex flex-row gap-2 justify-between">
						<Input placeholder=".ke" className="flex-1" />
						<Button className="bg-secondary">
							<Text>Search</Text>
						</Button>
					</View>
					<View className="flex flex-row gap-6 mt-4">
						<Text className="text-white">.ke</Text>
						<Text className="text-white">.ke</Text>
						<Text className="text-white">.ke</Text>
						<Text className="text-white">.ke</Text>
					</View>
				</View>
			</View>
		</View>
	);
}
