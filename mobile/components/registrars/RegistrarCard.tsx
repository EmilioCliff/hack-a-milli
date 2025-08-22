import { Image, View } from 'react-native';
import { Card } from '../ui/card';
import { NAV_THEME } from '~/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../ui/text';
import { Badge } from '../ui/badge';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { Button } from '../ui/button';
import { Registrar } from '~/lib/types';
import { format } from 'date-fns';
import { Linking } from 'react-native';

export default function RegistrarCard(props: Registrar) {
	return (
		<Card className="mt-4 overflow-hidden pb-4">
			<LinearGradient
				colors={[
					NAV_THEME.kenyaFlag.red.front,
					NAV_THEME.kenyaFlag.green.mid,
				]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				locations={[0, 1]}
				style={{ marginBottom: 14 }}
			>
				<Image
					style={{
						width: '100%',
						height: 200,
						resizeMode: 'cover',
					}}
					source={{ uri: props.logo_url }}
				/>
			</LinearGradient>
			<View className="px-2">
				<View className="flex-row mb-2 flex-wrap items-start justify-between">
					<Text className="text-xl flex-shrink flex-1 font-bold">
						{props.name}
					</Text>
					<Badge className="flex-row gap-2 items-center bg-secondary">
						<Feather name="shield" size={16} color="white" />
						<Text className="font-bold">Verified</Text>
					</Badge>
				</View>
				<View className="flex-row mb-4">
					<View className="flex-row flex-1 gap-2 items-center">
						<Feather name="map-pin" size={16} color="#6b7280" />
						<Text className="text-gray-500">{props.address}</Text>
					</View>
					<View className="flex-row flex-1 gap-2 items-center">
						<Feather name="calendar" size={16} color="#6b7280" />
						<Text className="text-gray-500">
							{format(props.created_at, 'yyyy-MM-dd')}
						</Text>
					</View>
				</View>
				<Text className="text-lg font-bold mb-2">Specialities: </Text>
				<View className="flex-row gap-2 mb-4">
					<Badge variant={'outline'}>
						<Text>Web Hosting</Text>
					</Badge>
					<Badge variant={'outline'}>
						<Text>SLL Certificates</Text>
					</Badge>
					<Badge variant={'outline'}>
						<Text>Email Services</Text>
					</Badge>
				</View>
				<Text className="text-lg font-bold mb-2">Key Features: </Text>
				<View className="flex-row mb-4">
					<View className="flex-1">
						<Text className="text-sm text-gray-600">
							· 24/7 Support
						</Text>
						<Text className="text-sm text-gray-600">
							· Domain Transfer
						</Text>
					</View>
					<View className="flex-1">
						<Text className="text-sm text-gray-600">
							· Free DNS
						</Text>
						<Text className="text-sm text-gray-600">
							· Bulk Rergistration
						</Text>
					</View>
				</View>
				<View className="bg-gray-100 p-4 rounded-lg mb-4">
					<Text className="text-lg font-bold mb-2">
						Contact Information:
					</Text>
					<View className="flex-row gap-2 items-center">
						<Feather name="phone" size={14} color="#6b7280" />
						<Text className="text-gray-700">
							{props.phone_number}
						</Text>
					</View>
					<View className="flex-row gap-2 items-center">
						<FontAwesome
							name="envelope-o"
							size={14}
							color="#6b7280"
						/>
						<Text className="text-gray-700">{props.email}</Text>
					</View>
					<View className="flex-row gap-2 items-center">
						<Feather name="globe" size={14} color="#6b7280" />
						<Text className="text-gray-700">
							{props.website_url}
						</Text>
					</View>
				</View>
				<View className="flex-row gap-2">
					<Button
						onPress={() => Linking.openURL(props.website_url)}
						className="flex-row items-center gap-2 flex-1"
					>
						<Feather name="external-link" size={18} color="white" />
						<Text className="font-bold">Visit Website</Text>
					</Button>
					<Button
						onPress={() =>
							Linking.openURL(`tel:${props.phone_number}`)
						}
						variant={'outline'}
						className="flex-row items-center gap-2 flex-1"
					>
						<Feather name="phone" size={18} color="black" />
						<Text className="font-bold">Contact</Text>
					</Button>
				</View>
			</View>
		</Card>
	);
}
