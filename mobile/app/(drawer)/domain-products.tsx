import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, ScrollView } from 'react-native';
import ModalToLogo from '~/components/modal/ModalToLogo';
import AppSafeView from '~/components/shared/AppSafeView';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { NAV_THEME } from '~/constants/colors';

export default function Products() {
	return (
		<AppSafeView>
			<ScrollView
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
			>
				<View className="px-4">
					<ModalToLogo
						title=".ke Domain Products"
						subtitle="Choose the perfect .ke domain for your needs"
						icon={<Feather name="globe" size={32} color="white" />}
					/>
					<Card className="overflow-hidden my-6">
						<CardHeader className="bg-primary">
							<CardTitle className="flex-row items-center">
								<Feather
									name="shield"
									size={18}
									color="white"
								/>
								<Text> </Text>
								<Text className="text-white ml-2">
									Second Level Domains (.ke)
								</Text>
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							<View className="space-y-4">
								<View className="bg-red-50 rounded-lg p-4">
									<Text className="font-semibold text-xl text-red-800 mb-2">
										Direct .ke Registration
									</Text>
									<Text className="text-gray-700 mb-3">
										Register your domain directly under .ke
										for maximum brand recognition and
										simplicity.
									</Text>

									<View className="gap-4 mb-4">
										<View>
											<Text className="font-medium text-lg text-gray-800 mb-2">
												✅ Benefits:
											</Text>
											<Text className="text-sm text-gray-600 mb-1">
												• Short and memorable
											</Text>
											<Text className="text-sm text-gray-600 mb-1">
												• Premium brand positioning
											</Text>
											<Text className="text-sm text-gray-600 mb-1">
												• Direct association with Kenya
											</Text>
											<Text className="text-sm text-gray-600 mb-1">
												• SEO advantages
											</Text>
										</View>
										<View>
											<Text className="font-medium text-lg text-gray-800 mb-2">
												📋 Requirements:
											</Text>
											<Text className="text-sm text-gray-600 mb-1">
												• Valid identification
											</Text>
											<Text className="text-sm text-gray-600 mb-1">
												• Kenyan presence preferred
											</Text>
											<Text className="text-sm text-gray-600 mb-1">
												• Business registration (if
												applicable)
											</Text>
											<Text className="text-sm text-gray-600 mb-1">
												• Contact verification
											</Text>
										</View>
									</View>

									<View className="flex-row flex-wrap items-center gap-1 justify-between">
										<Text className="text-xl flex-shrink flex-1 font-bold text-green-600">
											KES 2,500/year
										</Text>
										<Button className="bg-primary hover:bg-red-700">
											<Text className="text-white font-bold">
												Register .ke Domain
											</Text>
										</Button>
									</View>
								</View>

								<View className="bg-gray-50 rounded-lg p-4 mt-4">
									<Text className="font-bold text-gray-800 mb-2">
										📄 Policies & Terms:
									</Text>
									<View className="items-start">
										<Button variant="link">
											<Text className="text-red-600 text-start text-base font-bold">
												→ .ke Domain Registration Policy
											</Text>
										</Button>
										<Button variant="link">
											<Text className="text-red-600 text-start text-base font-bold">
												→ Terms and Conditions
											</Text>
										</Button>
										<Button variant="link">
											<Text className="text-red-600 text-start text-base font-bold">
												→ Dispute Resolution Policy
											</Text>
										</Button>
									</View>
								</View>
							</View>
						</CardContent>
					</Card>
					<Card className="overflow-hidden">
						<CardHeader className="bg-secondary">
							<CardTitle className="flex-row items-center">
								<MaterialCommunityIcons
									name="factory"
									size={18}
									color="white"
								/>
								<Text> </Text>
								<Text className="text-white ml-2">
									Third Level Domains
								</Text>
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							<View className="gap-6">
								<View className="rounded-lg border border-border shadow-sm shadow-foreground/10 p-4">
									<View className="flex-row flex-wrap items-start justify-between mb-3">
										<Text className="font-semibold text-xl text-gray-800 flex-shrink flex-1 mr-2">
											.co.ke - Commercial
										</Text>
										<Badge className="bg-blue-100 text-blue-800">
											<Text className="font-semibold">
												Open Registration
											</Text>
										</Badge>
									</View>
									<Text className="mb-3 text-lg">
										Perfect for businesses, e-commerce
										sites, and commercial entities operating
										in Kenya.
									</Text>

									<View className="gap-4 mb-4">
										<View>
											<Text className="font-medium text-gray-700 mb-2 text-lg">
												Suitable for:
											</Text>
											<Text className="text-sm text-gray-600">
												• Businesses & Companies
											</Text>
											<Text className="text-sm text-gray-600">
												• E-commerce platforms
											</Text>
											<Text className="text-sm text-gray-600">
												• Professional services
											</Text>
											<Text className="text-sm text-gray-600">
												• Startups
											</Text>
										</View>
										<View>
											<Text className="font-medium text-gray-700 mb-2">
												Requirements:
											</Text>
											<Text className="text-sm text-gray-600">
												• Basic registration info
											</Text>
											<Text className="text-sm text-gray-600">
												• Valid contact details
											</Text>
											<Text className="text-sm text-gray-600">
												• No special documentation
											</Text>
										</View>
									</View>

									<View className="flex-row flex-wrap items-center gap-1 justify-between">
										<Text className="text-xl flex-shrink flex-1 font-bold text-green-600">
											KES 1,800/year
										</Text>
										<Button variant="outline">
											<Text className="font-bold">
												Register .co.ke
											</Text>
										</Button>
									</View>
								</View>

								{/* Organization Domains */}
								<View className="rounded-lg border border-border shadow-sm shadow-foreground/10 p-4">
									<View className="flex-row flex-wrap items-start justify-between mb-3">
										<Text className="font-semibold text-xl text-gray-800 flex-shrink flex-1 mr-2">
											.or.ke - Organizations
										</Text>
										<Badge className="bg-green-100 text-green-800">
											<Text className="font-semibold">
												Open Registration
											</Text>
										</Badge>
									</View>
									<View className="text-gray-600 mb-3">
										<Text>
											Ideal for non-profit organizations,
											NGOs, community groups, and
											associations.
										</Text>
									</View>

									<View className="gap-4 mb-4">
										<View>
											<Text className="font-medium text-lg text-gray-700 mb-2">
												Suitable for:
											</Text>
											<Text className="text-sm text-gray-600">
												• Non-profit organizations
											</Text>
											<Text className="text-sm text-gray-600">
												• NGOs & Charities
											</Text>
											<Text className="text-sm text-gray-600">
												• Community groups
											</Text>
											<Text className="text-sm text-gray-600">
												• Professional associations
											</Text>
										</View>
										<View>
											<Text className="font-medium text-lg text-gray-700 mb-2">
												Requirements:
											</Text>
											<Text className="text-sm text-gray-600">
												• Organization details
											</Text>
											<Text className="text-sm text-gray-600">
												• Contact information
											</Text>
											<Text className="text-sm text-gray-600">
												• Purpose statement
											</Text>
										</View>
									</View>

									<View className="flex-row flex-wrap items-center gap-1 justify-between">
										<Text className="text-xl flex-shrink flex-1 font-bold text-green-600">
											KES 1,800/year
										</Text>
										<Button variant="outline">
											<Text className="font-bold">
												Register .or.ke
											</Text>
										</Button>
									</View>
								</View>

								{/* Academic Domains */}
								<View className="rounded-lg border border-border shadow-sm shadow-foreground/10 p-4">
									<View className="flex-row flex-wrap items-start justify-between mb-3">
										<Text className="font-semibold text-xl text-gray-800 flex-shrink flex-1 mr-2">
											.ac.ke - Academic
										</Text>
										<Badge className="bg-yellow-100 text-yellow-800">
											<Text className="font-semibold">
												Restricted
											</Text>
										</Badge>
									</View>
									<Text className="mb-3 text-lg">
										Reserved for accredited educational
										institutions in Kenya.
									</Text>

									<View className="gap-4 mb-4">
										<View>
											<Text className="font-medium text-lg text-gray-700 mb-2">
												Eligible institutions:
											</Text>
											<Text className="text-sm text-gray-600">
												• Universities
											</Text>
											<Text className="text-sm text-gray-600">
												• Colleges
											</Text>
											<Text className="text-sm text-gray-600">
												• Research institutions
											</Text>
											<Text className="text-sm text-gray-600">
												• Educational organizations
											</Text>
										</View>
										<View>
											<Text className="font-medium text-lg text-gray-700 mb-2">
												Required documents:
											</Text>
											<Text className="text-sm text-gray-600">
												• Accreditation certificate
											</Text>
											<Text className="text-sm text-gray-600">
												• Institution registration
											</Text>
											<Text className="text-sm text-gray-600">
												• Authorization letter
											</Text>
											<Text className="text-sm text-gray-600">
												• Contact verification
											</Text>
										</View>
									</View>

									<View className="flex-row flex-wrap items-center gap-1 justify-between">
										<Text className="text-xl flex-shrink flex-1 font-bold text-green-600">
											KES 2,200/year
										</Text>
										<Button variant="outline">
											<Text className="font-bold">
												Apply for .ac.ke
											</Text>
										</Button>
									</View>
								</View>

								{/* Government Domains */}
								<View className="rounded-lg bg-red-50 border border-border shadow-sm shadow-foreground/10 p-4">
									<View className="flex-row flex-wrap items-start justify-between mb-3">
										<Text className="font-semibold text-xl text-gray-800 flex-shrink flex-1 mr-2">
											.go.ke - Government
										</Text>
										<Badge className="bg-red-100 text-red-800">
											<Text className="font-semibold">
												Highly Restricted
											</Text>
										</Badge>
									</View>
									<Text className="mb-3 text-lg">
										Exclusively for official Kenyan
										government entities and departments.
									</Text>

									<View className="gap-4 mb-4">
										<View>
											<Text className="font-medium text-lg text-gray-700 mb-2">
												Eligible entities:
											</Text>
											<Text className="text-sm text-gray-600">
												• Government ministries
											</Text>
											<Text className="text-sm text-gray-600">
												• State departments
											</Text>
											<Text className="text-sm text-gray-600">
												• Government agencies
											</Text>
											<Text className="text-sm text-gray-600">
												• County governments
											</Text>
										</View>
										<View>
											<Text className="font-medium text-lg text-gray-700 mb-2">
												Required documents:
											</Text>
											<Text className="text-sm text-gray-600">
												• Official government letter
											</Text>
											<Text className="text-sm text-gray-600">
												• Department authorization
											</Text>
											<Text className="text-sm text-gray-600">
												• Legal entity proof
											</Text>
											<Text className="text-sm text-gray-600">
												• Authorized signatory
											</Text>
										</View>
									</View>

									<View className="flex-row flex-wrap items-center gap-1 justify-between">
										<Text className="text-xl flex-shrink flex-1 font-bold text-green-600">
											KES 3,000/year
										</Text>
										<Button variant="outline">
											<Text className="font-bold">
												Apply for .go.ke
											</Text>
										</Button>
									</View>
								</View>

								{/* Network Domains */}
								<View className="rounded-lg border border-border shadow-sm shadow-foreground/10 p-4">
									<View className="flex-row flex-wrap items-start justify-between mb-3">
										<Text className="font-semibold text-xl text-gray-800 flex-shrink flex-1 mr-2">
											.ne.ke - Network
										</Text>
										<Badge className="bg-purple-100 text-purple-800">
											<Text className="font-semibold">
												Technical
											</Text>
										</Badge>
									</View>
									<Text className="mb-3 text-lg">
										For network infrastructure, ISPs, and
										technical service providers.
									</Text>

									<View className="gap-4 mb-4">
										<View>
											<Text className="font-medium text-lg text-gray-700 mb-2">
												Suitable for:
											</Text>
											<Text className="text-sm text-gray-600">
												• Internet Service Providers
											</Text>
											<Text className="text-sm text-gray-600">
												• Network operators
											</Text>
											<Text className="text-sm text-gray-600">
												• Technical infrastructure
											</Text>
											<Text className="text-sm text-gray-600">
												• Hosting providers
											</Text>
										</View>
										<View>
											<Text className="font-medium text-lg text-gray-700 mb-2">
												Requirements:
											</Text>
											<Text className="text-sm text-gray-600">
												• Technical justification
											</Text>
											<Text className="text-sm text-gray-600">
												• Business registration
											</Text>
											<Text className="text-sm text-gray-600">
												• Network documentation
											</Text>
										</View>
									</View>

									<View className="flex-row flex-wrap items-center gap-1 justify-between">
										<Text className="text-xl flex-shrink flex-1 font-bold text-green-600">
											KES 2,000/year
										</Text>
										<Button variant="outline">
											<Text className="font-bold">
												Register .ne.ke
											</Text>
										</Button>
									</View>
								</View>

								{/* Mobile Domains */}
								<View className="rounded-lg border border-border shadow-sm shadow-foreground/10 p-4">
									<View className="flex-row flex-wrap items-start justify-between mb-3">
										<Text className="font-semibold text-xl text-gray-800 flex-shrink flex-1 mr-2">
											.mobi.ke - Mobile
										</Text>
										<Badge className="bg-indigo-100 text-indigo-800">
											<Text className="font-semibold">
												Specialized
											</Text>
										</Badge>
									</View>
									<Text className="mb-3 text-lg">
										Designed for mobile-optimized websites
										and mobile service providers.
									</Text>

									<View className="gap-4 mb-4">
										<View>
											<Text className="font-medium text-lg text-gray-700 mb-2">
												Perfect for:
											</Text>
											<Text className="text-sm text-gray-600">
												• Mobile applications
											</Text>
											<Text className="text-sm text-gray-600">
												• Mobile service providers
											</Text>
											<Text className="text-sm text-gray-600">
												• Mobile-first websites
											</Text>
											<Text className="text-sm text-gray-600">
												• App developers
											</Text>
										</View>
										<View>
											<Text className="font-medium text-lg text-gray-700 mb-2">
												Requirements:
											</Text>
											<Text className="text-sm text-gray-600">
												• Mobile compliance
											</Text>
											<Text className="text-sm text-gray-600">
												• Technical specifications
											</Text>
											<Text className="text-sm text-gray-600">
												• Service description
											</Text>
										</View>
									</View>

									<View className="flex-row flex-wrap items-center gap-1 justify-between">
										<Text className="text-xl flex-shrink flex-1 font-bold text-green-600">
											KES 2,500/year
										</Text>
										<Button variant="outline">
											<Text className="font-bold">
												Register .mobi.ke
											</Text>
										</Button>
									</View>
								</View>
							</View>
						</CardContent>
					</Card>
					{/* Registration Process */}
					<Card className=" my-6">
						<CardHeader>
							<CardTitle className="flex-row items-center space-x-2">
								<Feather
									name="book-open"
									size={18}
									color="black"
								/>
								<Text> </Text>
								<Text className=" ml-2">
									Registration Process
								</Text>
							</CardTitle>
						</CardHeader>
						<CardContent className="gap-4">
							<View className="gap-4">
								<View className="text-center p-4 bg-blue-50 rounded-lg">
									<Text className="bg-blue-600 text-white rounded-full w-8 h-8 text-center mx-auto mb-2 text-sm font-extrabold pt-1">
										1
									</Text>
									<Text className="text-center text-xl font-medium mb-2">
										Choose Domain
									</Text>
									<Text className="text-center text-sm text-gray-600">
										Select your preferred domain extension
										and check availability
									</Text>
								</View>
								<View className="text-center p-4 bg-green-50 rounded-lg">
									<Text className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-extrabold pt-1 text-center">
										2
									</Text>
									<Text className="text-center text-xl font-medium mb-2">
										Submit Documents
									</Text>
									<Text className="text-center text-sm text-gray-600">
										Provide required documentation based on
										domain type
									</Text>
								</View>
								<View className="text-center p-4 bg-red-50 rounded-lg">
									<Text className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-extrabold pt-1 text-center">
										3
									</Text>
									<Text className="text-center text-xl font-medium mb-2">
										Complete Registration
									</Text>
									<Text className="text-center text-sm text-gray-600">
										Pay fees and activate your domain
										through a registrar
									</Text>
								</View>
							</View>
						</CardContent>
					</Card>

					{/* Important Notes */}
					<Card className="border-l-4 border-l-yellow-500">
						<CardContent className="p-6">
							<View className="mb-3 flex-row items-center">
								<Feather
									name="info"
									size={24}
									color="#eab308"
								/>
								<Text> </Text>
								<Text className="font-bold text-lg text-gray-800">
									Important Information
								</Text>
							</View>
							<View className="gap-2">
								<Text className=" text-sm text-gray-600">
									• All domain registrations must be done
									through KENIC-accredited registrars
								</Text>
								<Text className=" text-sm text-gray-600">
									• Domain names are registered on a
									first-come, first-served basis
								</Text>
								<Text className=" text-sm text-gray-600">
									• Renewal fees may vary depending on the
									registrar chosen
								</Text>
								<Text className=" text-sm text-gray-600">
									• Some domains require annual verification
									of eligibility
								</Text>
								<Text className=" text-sm text-gray-600">
									• Transfer between registrars is possible
									after 60 days of registration
								</Text>
							</View>
						</CardContent>
					</Card>

					{/* Contact Support */}
					<Card className=" text-white my-4 overflow-hidden">
						<LinearGradient
							colors={[
								NAV_THEME.kenyaFlag.red.front,
								NAV_THEME.kenyaFlag.green.mid,
							]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							locations={[0, 1]}
						>
							<CardContent className="p-6 ">
								<Text className="text-center text-white font-semibold text-xl mb-2">
									Need Help Choosing?
								</Text>
								<Text className="text-center text-white mb-4 opacity-90">
									Our domain experts are here to help you
									select the perfect .ke domain
								</Text>
								<View className="gap-3 justify-center">
									<Button
										variant="secondary"
										className="bg-white flex-row gap-6 text-gray-800"
									>
										<Feather
											name="phone"
											size={18}
											color="black"
										/>
										<Text className="text-base font-semibold">
											Call Support
										</Text>
									</Button>
									<Button
										variant="secondary"
										className="bg-white flex-row gap-6 text-gray-800"
									>
										<Ionicons
											name="chatbubble-outline"
											size={18}
											color="black"
										/>
										<Text className="text-base font-semibold">
											Live Chat
										</Text>
									</Button>
								</View>
							</CardContent>
						</LinearGradient>
					</Card>
				</View>
			</ScrollView>
		</AppSafeView>
	);
}
