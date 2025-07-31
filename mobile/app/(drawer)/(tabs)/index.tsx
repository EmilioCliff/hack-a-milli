import { ScrollView, View } from 'react-native';
import AvailableDomain from '~/components/home/AvailableDomain';
import Carousel from '~/components/home/Carousel';
import ChooseRegistar from '~/components/home/ChooseRegistar';
import SearchDomain from '~/components/home/SearchDomain';
import TakenDomain from '~/components/home/TakenDomain';
import AppSafeView from '~/components/shared/AppSafeView';
import HomeHeader from '~/components/shared/HomeHeader';
import KenyaWave from '~/components/shared/KenyaWave';
import { Card, CardContent, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';

export default function Home() {
	return (
		<AppSafeView>
			<HomeHeader />
			<ScrollView
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
			>
				<Carousel />
				<SearchDomain />
				{/* <View className="px-4 my-4 gap-2">
					<Text className="font-extrabold font-2xl">
						Search Results
					</Text>
					<AvailableDomain />
					<TakenDomain />
					<ChooseRegistar />
				</View> */}
				<View className="flex px-4 gap-2 flex-row justify-evenly">
					<Card className="py-2 px-6 items-center">
						<CardTitle className="text-2xl text-primary">
							125K+
						</CardTitle>
						<Text>Active</Text>
						<Text>Domain</Text>
					</Card>
					<Card className="py-2 px-6 items-center">
						<CardTitle className="text-2xl text-secondary">
							45
						</CardTitle>
						<Text>Registars</Text>
					</Card>
					<Card className="py-2 px-6 items-center">
						<CardTitle className="text-2xl text-primary">
							99.9%
						</CardTitle>
						<Text>Uptime</Text>
					</Card>
				</View>
				<View className="relative mt-14 px-4 pb-6">
					<View
						style={{ padding: 8 }}
						className="z-10 bg-white/40 rounded-lg"
					>
						<Card className="py-4 px-4 items-center text-center">
							<CardTitle className="font-extrabold">
								NEWS & UPDATES
							</CardTitle>
							<Text numberOfLines={1} ellipsizeMode="tail">
								Newsletters, Product News, Social Media, Public
							</Text>
						</Card>
					</View>
					<View className="absolute bottom-0">
						<KenyaWave />
					</View>
				</View>
				{/* <ThemeToggle /> */}
			</ScrollView>
		</AppSafeView>
	);
}
