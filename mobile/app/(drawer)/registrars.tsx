import { AntDesign, Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FlatList, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ModalToLogo from '~/components/modal/ModalToLogo';
import RegistrarCard from '~/components/registrars/RegistrarCard';
import AppSafeView from '~/components/shared/AppSafeView';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select';
import { Text } from '~/components/ui/text';
import { NAV_THEME } from '~/constants/colors';

const data = [
	{
		id: 1,
		companyLogo: 'https://picsum.photos/200/200',
		title: 'Kenya Network Information Centre (KeNIC)',
		location: 'Nairobi, Kenya',
		registeredDate: '2002-10-12',
		contactInfo: {
			contactNumber: '+254 700 111 000',
			email: 'info@kenic.or.ke',
			websiteUrl: 'https://www.kenic.or.ke',
		},
	},
	{
		id: 2,
		companyLogo: 'https://picsum.photos/200/200',
		title: 'Safaricom PLC',
		location: 'Westlands, Nairobi, Kenya',
		registeredDate: '1997-05-23',
		contactInfo: {
			contactNumber: '+254 722 002 100',
			email: 'corporate@safaricom.co.ke',
			websiteUrl: 'https://www.safaricom.co.ke',
		},
	},
	{
		id: 3,
		companyLogo: 'https://picsum.photos/200/200',
		title: 'Truehost Cloud Kenya',
		location: 'Mombasa Road, Nairobi, Kenya',
		registeredDate: '2016-09-14',
		contactInfo: {
			contactNumber: '+254 739 755 571',
			email: 'support@truehost.co.ke',
			websiteUrl: 'https://www.truehost.co.ke',
		},
	},
	{
		id: 4,
		companyLogo: 'https://picsum.photos/200/200',
		title: 'Webhost Kenya',
		location: 'Moi Avenue, Nairobi, Kenya',
		registeredDate: '2014-03-09',
		contactInfo: {
			contactNumber: '+254 723 123 456',
			email: 'support@webhostkenya.co.ke',
			websiteUrl: 'https://www.webhostkenya.co.ke',
		},
	},
];

export default function RegistrarsPage() {
	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 12,
		right: 12,
	};

	return (
		<AppSafeView>
			<View className="flex-1 px-4">
				<FlatList
					data={data}
					keyExtractor={(item) => item.id.toString()}
					ListHeaderComponent={() => (
						<>
							<ModalToLogo
								title="KENIC Accredited Registrars"
								subtitle="Choose from our trusted network of domain registrars"
								icon={
									<Octicons
										name="organization"
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
								<View className="flex-row gap-2">
									<Select
										defaultValue={{
											value: 'all services',
											label: 'All Services',
										}}
										className="w-1/2"
									>
										<SelectTrigger>
											<SelectValue
												className="text-foreground text-sm native:text-lg"
												placeholder="Select a service"
											/>
										</SelectTrigger>
										<SelectContent insets={contentInsets}>
											<SelectItem
												label="All Services"
												value="all services"
											>
												All Services
											</SelectItem>
											<SelectItem
												label="Web Hosting"
												value="web hosting"
											>
												Web Hosting
											</SelectItem>
											<SelectItem
												label="SSL Certificates"
												value="ssl certificates"
											>
												SSL Certificates
											</SelectItem>
											<SelectItem
												label="Email Services"
												value="email services"
											>
												Email Services
											</SelectItem>
										</SelectContent>
									</Select>
									<Select
										defaultValue={{
											value: 'all location',
											label: 'All Location',
										}}
										className="w-1/2"
									>
										<SelectTrigger>
											<SelectValue
												className="text-foreground text-sm native:text-lg"
												placeholder="Select location"
											/>
										</SelectTrigger>
										<SelectContent insets={contentInsets}>
											<SelectItem
												label="All Location"
												value="all location"
											>
												All Location
											</SelectItem>
											<SelectItem
												label="Nairobi"
												value="nairobi"
											>
												Nairobi
											</SelectItem>
											<SelectItem
												label="Mombasa"
												value="mombasa"
											>
												Mombasa
											</SelectItem>
											<SelectItem
												label="Kisumu"
												value="kisumu"
											>
												Kisumu
											</SelectItem>
										</SelectContent>
									</Select>
								</View>
							</Card>
						</>
					)}
					ListFooterComponent={() => (
						<View className="rounded-lg overflow-hidden mt-6">
							<LinearGradient
								colors={[
									NAV_THEME.kenyaFlag.red.front,
									NAV_THEME.kenyaFlag.green.mid,
								]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								locations={[0, 1]}
								style={{ padding: 12, alignItems: 'center' }}
							>
								<Octicons
									name="organization"
									size={32}
									color="white"
								/>
								<Text className="mt-2 text-white text-xl font-bold">
									Become a KENIC Registrar
								</Text>
								<Text className="my-4 text-white text-center text-sm">
									Join our network of trusted domain
									registrars and grow your business
								</Text>
								<Button className="bg-white mb-4">
									<Text className="text-black">
										Learn More
									</Text>
								</Button>
							</LinearGradient>
						</View>
					)}
					renderItem={({ item, index }) => (
						<RegistrarCard {...item} />
					)}
					showsVerticalScrollIndicator={false}
				/>
			</View>
		</AppSafeView>
	);
}
