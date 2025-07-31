import { View, ScrollView, TextInput } from 'react-native';
import AppSafeView from '~/components/shared/AppSafeView';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import ModalToLogo from '~/components/modal/ModalToLogo';
import { Button } from '~/components/ui/button';
import { LinearGradient } from 'expo-linear-gradient';
import { NAV_THEME } from '~/constants/colors';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select';
import FAQ from '~/components/shared/FAQ';
import { Text } from '~/components/ui/text';

const faq = [
	{
		question: 'How do I register a .ke domain?',
		answer: 'You can register a .ke domain through any of our accredited registrars. Search for your desired domain and choose a registrar to complete the registration.',
	},
	{
		question: 'What documents do I need for .go.ke domains?',
		answer: 'For .go.ke domains, you need an official government letter, department authorization, legal entity proof, and authorized signatory documentation.',
	},
	{
		question: 'How long does domain registration take?',
		answer: 'Most domain registrations are processed within 24-48 hours. Restricted domains may take longer due to verification requirements.',
	},
	{
		question: 'Can I transfer my domain to another registrar?',
		answer: 'Yes, you can transfer your domain to another KENIC-accredited registrar after 60 days from the initial registration date.',
	},
];

export default function ContactPage() {
	return (
		<AppSafeView>
			<ScrollView
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
			>
				<View className="px-4 mb-6">
					<ModalToLogo
						title="Contact Support"
						subtitle="We're here to help with all your .ke domain needs"
						icon={
							<Feather
								name="headphones"
								size={32}
								color="white"
							/>
						}
					/>
					<View className="flex-row gap-4 my-4 ">
						<LinearGradient
							colors={['#dc2626', '#b91c1c']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							locations={[0, 1]}
							style={{ borderRadius: 8, flexGrow: 1 }}
						>
							<View className="p-4 items-center gap-4">
								<Feather name="phone" size={24} color="white" />
								<Text className="text-white font-bold">
									Call Now
								</Text>
							</View>
						</LinearGradient>
						<LinearGradient
							colors={['#16a34a', '#15803d']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							locations={[0, 1]}
							style={{ borderRadius: 8, flexGrow: 1 }}
						>
							<View className="flex-1 p-4 rounded-lg items-center gap-4">
								<Ionicons
									name="chatbubble-outline"
									size={24}
									color="white"
								/>
								<Text className="text-white font-bold">
									Live Chat
								</Text>
							</View>
						</LinearGradient>
					</View>
					<View className="gap-4 mt-6">
						<Card className="overflow-hidden">
							<CardHeader className="bg-blue-50">
								<View className="flex-row gap-2 items-center">
									<Feather
										name="phone"
										size={18}
										color="#1e40af"
									/>
									<Text className="text-blue-800 text-xl font-semibold">
										Phone Support
									</Text>
								</View>
							</CardHeader>
							<CardContent className="p-6">
								<View className="gap-4">
									<View>
										<Text className="font-medium text-gray-800 mb-2">
											General Support
										</Text>
										<Text className="text-lg font-bold text-blue-600">
											+254 20 2498 000
										</Text>
										<Text className="text-sm text-gray-600">
											Monday - Friday: 8:00 AM - 6:00 PM
											EAT
										</Text>
									</View>
									<Separator />
									<View>
										<Text className="font-medium text-gray-800 mb-2">
											Technical Support
										</Text>
										<Text className="text-lg font-bold text-blue-600">
											+254 20 2498 100
										</Text>
										<Text className="text-sm text-gray-600">
											24/7 Technical Emergency Line
										</Text>
									</View>
									<View className="bg-blue-50 rounded-lg p-3">
										<Text className="text-sm text-blue-800">
											<Text className="text-sm text-blue-800 font-bold">
												Tip:
											</Text>{' '}
											Have your domain name and account
											details ready when calling
										</Text>
									</View>
								</View>
							</CardContent>
						</Card>

						<Card className="overflow-hidden">
							<CardHeader className="bg-green-50">
								<View className="flex-row items-center gap-2">
									<FontAwesome
										name="envelope-o"
										size={18}
										color="#6b7280"
									/>
									<Text className="text-green-800 text-xl font-semibold">
										Email Support
									</Text>
								</View>
							</CardHeader>
							<CardContent className="p-6">
								<View className="gap-4">
									<View className="bg-gray-50 rounded-lg p-3">
										<Text className="font-medium text-gray-800">
											General Inquiries
										</Text>
										<Text className="text-green-600 font-medium">
											info@kenic.or.ke
										</Text>
										<Text className="text-xs text-gray-600">
											Response time: 24-48 hours
										</Text>
									</View>
									<View className="bg-gray-50 rounded-lg p-3">
										<Text className="font-medium text-gray-800">
											Technical Support
										</Text>
										<Text className="text-green-600 font-medium">
											support@kenic.or.ke
										</Text>
										<Text className="text-xs text-gray-600">
											Response time: 4-8 hours
										</Text>
									</View>
									<View className="bg-gray-50 rounded-lg p-3">
										<Text className="font-medium text-gray-800">
											Billing & Accounts
										</Text>
										<Text className="text-green-600 font-medium">
											billing@kenic.or.ke
										</Text>
										<Text className="text-xs text-gray-600">
											Response time: 24 hours
										</Text>
									</View>
								</View>
							</CardContent>
						</Card>

						<Card className="overflow-hidden">
							<CardHeader className="bg-purple-50">
								<View className="flex-row items-center gap-2">
									<Ionicons
										name="chatbubble-outline"
										size={18}
										color="#6b21a8"
									/>
									<Text className="text-purple-800 text-xl font-semibold">
										Live Chat
									</Text>
								</View>
							</CardHeader>
							<CardContent className="p-6">
								<View className="gap-4">
									<View className="flex-row items-center justify-between">
										<View>
											<Text className="font-medium text-gray-800">
												Chat Status
											</Text>
											<View className="flex-row items-center gap-2 mt-1">
												<View className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></View>
												<Text className="text-sm text-green-600 font-medium">
													Online
												</Text>
											</View>
										</View>
										<Button className="bg-purple-600">
											<Text className="text-white font-bold">
												Start Chat
											</Text>
										</Button>
									</View>
									<View className="bg-purple-50 rounded-lg p-3">
										<Text className="text-sm text-purple-800">
											<Text className="text-sm text-purple-800 font-bold">
												Available:
											</Text>{' '}
											Monday - Friday, 8:00 AM - 8:00 PM
											EAT
										</Text>
									</View>
								</View>
							</CardContent>
						</Card>
					</View>
					<Card className="overflow-hidden my-4">
						<CardHeader className="">
							<View className="flex-row items-center gap-2">
								<Feather
									name="send"
									size={18}
									color="#ea580c"
								/>
								<Text className="text-xl font-semibold">
									Send us a Message
								</Text>
							</View>
						</CardHeader>
						<CardContent className="p-6">
							<View className="flex-row gap-4 mb-6">
								<View className="flex-1">
									<Text className="text-lg font-bold">
										First Name
									</Text>
									<TextInput
										placeholder="John"
										value={''}
										className="border border-gray-300 rounded-md px-4 py-2"
									/>
								</View>
								<View className="flex-1">
									<Text className="text-lg font-bold">
										Last Name
									</Text>
									<TextInput
										placeholder="Doe"
										value={''}
										className="border border-gray-300 rounded-md px-4 py-2"
									/>
								</View>
							</View>
							<Text className="text-lg font-bold mb-2">
								Email
							</Text>
							<TextInput
								placeholder="john.doe@example.com"
								value={''}
								className="border border-gray-300 rounded-md px-4 py-2 mb-6"
							/>
							<Text className="text-lg font-bold mb-2">
								Subject
							</Text>
							<Select className="mb-6">
								<SelectTrigger>
									<SelectValue
										className="text-foreground text-sm native:text-lg"
										placeholder="Select a topic"
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										label="Domain Registration"
										value="domain registration"
									>
										Domain Registration
									</SelectItem>
									<SelectItem
										label="Technical Issue"
										value="technical issue"
									>
										Technical Issue
									</SelectItem>
									<SelectItem
										label="Billing Question"
										value="billing question"
									>
										Billing Question
									</SelectItem>
									<SelectItem
										label="Policy Question"
										value="policy question"
									>
										Policy Question
									</SelectItem>
									<SelectItem label="Other" value="other">
										Other
									</SelectItem>
								</SelectContent>
							</Select>
							<Text className="text-lg font-bold mb-2">
								Message
							</Text>
							<TextInput
								multiline={true}
								numberOfLines={10}
								placeholder="Describe tour question or issue"
								value={''}
								style={{
									height: 120,
									textAlignVertical: 'top',
								}}
								className="border items-start justify-start border-gray-300 rounded-md px-4 py-2 mb-6"
							/>

							<LinearGradient
								colors={[
									NAV_THEME.kenyaFlag.red.front,
									NAV_THEME.kenyaFlag.green.mid,
								]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								locations={[0, 1]}
								style={{ borderRadius: 8 }}
							>
								<Button className="flex-row bg-transparent gap-6 items-center">
									<Feather
										name="send"
										size={18}
										color="white"
									/>
									<Text className="text-white font-bold">
										Send Message
									</Text>
								</Button>
							</LinearGradient>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<View className="flex-row items-center gap-2">
								<Feather
									name="book-open"
									size={24}
									color="#2563eb"
								/>
								<Text className="font-bold text-xl">
									Frequently Asked Questions
								</Text>
							</View>
						</CardHeader>
						<CardContent className="gap-4">
							{faq.map((faq, index) => (
								<FAQ key={index} {...faq} />
							))}
							<Button
								variant="outline"
								// className="w-full bg-transparent"
							>
								<Text className="font-semibold">
									View All FAQs
								</Text>
							</Button>
						</CardContent>
					</Card>
					<View className="rounded-lg overflow-hidden mt-6">
						<LinearGradient
							colors={[
								NAV_THEME.kenyaFlag.red.front,
								NAV_THEME.kenyaFlag.green.mid,
							]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							locations={[0, 1]}
							style={{ padding: 24 }}
						>
							<View className="flex-row gap-2 items-center mb-4">
								<Feather
									name="map-pin"
									size={16}
									color="white"
								/>
								<Text className="mt-2 text-white text-lg font-bold">
									Visit Our Office
								</Text>
							</View>
							<View className="gap-2 opacity-90">
								<Text className="text-white font-bold">
									Kenya Network Information Center (KENIC)
								</Text>
								<Text className="text-white text-sm">
									Teleposta Towers, 9th Floor
								</Text>
								<Text className="text-white text-sm">
									Koinange Street
								</Text>
								<Text className="text-white text-sm">
									P.O Box 24757 - 00100
								</Text>
								<Text className="text-white text-sm">
									Nairobi, Kenya
								</Text>
							</View>
							<Separator className="my-2" />
							<Text className="text-white">
								<Text className="text-white font-bold">
									Office Hours:
								</Text>{' '}
								Monday - Friday, 8:00 AM - 5:00 PM EAST
							</Text>
						</LinearGradient>
					</View>
				</View>
			</ScrollView>
		</AppSafeView>
	);
}
