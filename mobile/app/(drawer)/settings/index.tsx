import { AntDesign, EvilIcons, Feather, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ModalToLogo from '~/components/modal/ModalToLogo';
import AppSafeView from '~/components/shared/AppSafeView';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { Switch } from '~/components/ui/switch';
import { Text } from '~/components/ui/text';
import {
	toggleEventsNotifications,
	toggleNewsNotifications,
	togglePolicyNotifications,
	toggleTrainingNotifications,
	toggleTwoFactorAuth,
} from '~/store/slices/preferences';
import { RootState } from '~/store/store';

export default function SettingsPage() {
	const dispatch = useDispatch();
	const preferences = useSelector((state: RootState) => state.preferences);

	return (
		<AppSafeView>
			<ScrollView
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
			>
				<View className="px-4 mb-6">
					<ModalToLogo
						title="Settings"
						subtitle="Manage your account preferences and app settings"
						icon={
							<Ionicons
								name="settings-outline"
								size={32}
								color="white"
							/>
						}
					/>
					<Card className="mt-6">
						<CardHeader>
							<View className="flex-row items-center gap-2">
								<AntDesign name="user" size={18} color="blue" />
								<Text className="text-xl font-semibold">
									Account Settings
								</Text>
							</View>
						</CardHeader>
						<CardContent>
							<Link
								href={{
									pathname: '/(drawer)/settings/[id]',
									params: { id: 1 },
								}}
								asChild
							>
								<Pressable>
									<View className="flex-row bg-blue-50 p-2 rounded-lg justify-between items-center">
										<View>
											<Text className="text-lg font-semibold">
												Profile Information
											</Text>
											<Text className="text-gray-600">
												Update tour personal details
											</Text>
										</View>
										<AntDesign
											name="arrowright"
											size={16}
											color="black"
										/>
									</View>
								</Pressable>
							</Link>
							<Link
								href={{
									pathname: '/(drawer)/settings/password',
									params: { id: 1 },
								}}
								asChild
							>
								<Pressable>
									<View className="flex-row bg-blue-50 p-2 mt-4 rounded-lg justify-between items-center">
										<View>
											<Text className="text-lg font-semibold">
												Change Password
											</Text>
											<Text className="text-gray-600">
												Update tour account password
											</Text>
										</View>
										<AntDesign
											name="arrowright"
											size={16}
											color="black"
										/>
									</View>
								</Pressable>
							</Link>
						</CardContent>
					</Card>

					<Card className="mt-6">
						<CardHeader>
							<View className="flex-row items-center gap-2">
								<EvilIcons
									name="bell"
									size={24}
									color="green"
								/>
								<Text className="text-xl font-semibold">
									Notifications
								</Text>
							</View>
						</CardHeader>
						<CardContent>
							<View className="flex-row flex-wrap bg-blue-50 p-2 rounded-lg justify-between items-center">
								<View className="flex-1 flex-shrink">
									<Text className="text-lg font-semibold">
										News Updates
									</Text>
									<Text className="text-gray-600">
										Receive latest KENIC news and updates
									</Text>
								</View>
								<Switch
									checked={preferences.newsNotification}
									onCheckedChange={() =>
										dispatch(toggleNewsNotifications())
									}
									nativeID="airplane-mode"
								/>
							</View>
							<View className="flex-row flex-wrap bg-blue-50 p-2 mt-4 rounded-lg justify-between items-center">
								<View className="flex-1 flex-shrink">
									<Text className="text-lg font-semibold">
										New Events
									</Text>
									<Text className="text-gray-600">
										Be the first to receive upcoming events
										and schedules
									</Text>
								</View>
								<Switch
									checked={preferences.eventsNotification}
									onCheckedChange={() =>
										dispatch(toggleEventsNotifications())
									}
									nativeID="airplane-mode"
								/>
							</View>
							<View className="flex-row flex-wrap bg-blue-50 p-2 mt-4 rounded-lg justify-between items-center">
								<View className="flex-1 flex-shrink">
									<Text className="text-lg font-semibold">
										New Training
									</Text>
									<Text className="text-gray-600">
										Be notified when a new training is
										available
									</Text>
								</View>
								<Switch
									checked={preferences.trainingNotification}
									onCheckedChange={() =>
										dispatch(toggleTrainingNotifications())
									}
									nativeID="airplane-mode"
								/>
							</View>
							<View className="flex-row flex-wrap bg-blue-50 p-2 mt-4 rounded-lg justify-between items-center">
								<View className="flex-1 flex-shrink">
									<Text className="text-lg font-semibold">
										Policy Changes
									</Text>
									<Text className="text-gray-600">
										Important policy and regulations updates
									</Text>
								</View>
								<Switch
									checked={preferences.policyNotifications}
									onCheckedChange={() =>
										dispatch(togglePolicyNotifications())
									}
									nativeID="airplane-mode"
								/>
							</View>
						</CardContent>
					</Card>
					<Card className="mt-6">
						<CardHeader>
							<View className="flex-row items-center gap-2">
								<Ionicons
									name="settings-outline"
									size={24}
									color="purple"
								/>
								<Text className="text-xl font-semibold">
									App Preferences
								</Text>
							</View>
						</CardHeader>
						<CardContent>
							<View className="flex-row flex-wrap bg-blue-50 p-2 rounded-lg justify-between items-center">
								<View className="flex-1 flex-shrink">
									<Text className="text-lg font-semibold">
										Language
									</Text>
									<Text className="text-gray-600">
										Choose your preferred language
									</Text>
								</View>
								<Select
									defaultValue={{
										value: 'English',
										label: 'English',
									}}
									className="w-1/2"
								>
									<SelectTrigger>
										<SelectValue
											className="text-foreground text-sm native:text-lg"
											placeholder="Select a service"
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem
											label="English"
											value="English"
										>
											English
										</SelectItem>
										<SelectItem
											label="Kiswahili"
											value="Kiswahili"
										>
											Kiswahili
										</SelectItem>
									</SelectContent>
								</Select>
							</View>
							<View className="flex-row flex-wrap bg-blue-50 p-2 mt-4 rounded-lg justify-between items-center">
								<View className="flex-1 flex-shrink">
									<Text className="text-lg font-semibold">
										Theme
									</Text>
									<Text className="text-gray-600">
										Choose your app appearance
									</Text>
								</View>
								<Select
									defaultValue={{
										value: 'Light',
										label: 'Light',
									}}
									className="w-1/2"
								>
									<SelectTrigger>
										<SelectValue
											className="text-foreground text-sm native:text-lg"
											placeholder="Select a service"
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem label="Light" value="Light">
											English
										</SelectItem>
										<SelectItem label="Dark" value="Dark">
											Dark
										</SelectItem>
										<SelectItem label="Auto" value="Auto">
											Auto
										</SelectItem>
									</SelectContent>
								</Select>
							</View>
							<View className="flex-row flex-wrap bg-blue-50 p-2 mt-4 rounded-lg justify-between items-center">
								<View className="flex-1 flex-shrink">
									<Text className="text-lg font-semibold">
										Default Search
									</Text>
									<Text className="text-gray-600">
										Default domain extension for earch
									</Text>
								</View>
								<Select
									defaultValue={{
										value: '.ke',
										label: '.ke',
									}}
									className="w-1/2"
								>
									<SelectTrigger>
										<SelectValue
											className="text-foreground text-sm native:text-lg"
											placeholder="Select a service"
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem label=".ke" value=".ke">
											.ke
										</SelectItem>
										<SelectItem
											label=".co.ke"
											value=".co.ke"
										>
											.co.ke
										</SelectItem>
										<SelectItem
											label=".or.ke"
											value=".or.ke"
										>
											.or.ke
										</SelectItem>
									</SelectContent>
								</Select>
							</View>
						</CardContent>
					</Card>
					<Card className="mt-6">
						<CardHeader>
							<View className="flex-row items-center gap-2">
								<Feather
									name="shield"
									size={24}
									color="orange"
								/>
								<Text className="text-xl font-semibold">
									Privacy & Security
								</Text>
							</View>
						</CardHeader>
						<CardContent>
							<View className="flex-row flex-wrap bg-blue-50 p-2 rounded-lg justify-between items-center">
								<View className="flex-1 flex-shrink">
									<Text className="text-lg font-semibold">
										Two-Factor Authentication
									</Text>
									<Text className="text-gray-600">
										Secure your account with 2FA
									</Text>
								</View>
								<Switch
									checked={preferences.twoFactorAuthEnabled}
									onCheckedChange={() =>
										dispatch(toggleTwoFactorAuth())
									}
									nativeID="airplane-mode"
								/>
							</View>
							<View className="flex-row flex-wrap bg-blue-50 p-2 mt-4 rounded-lg justify-between items-center">
								<View className="flex-1 flex-shrink">
									<Text className="text-lg font-semibold">
										Privacy Policy
									</Text>
									<Text className="text-gray-600">
										Review our privacy practices
									</Text>
								</View>
								<AntDesign
									name="arrowright"
									size={16}
									color="black"
								/>
							</View>
						</CardContent>
					</Card>
					<Card className="mt-6">
						<CardHeader>
							<View className="flex-row items-center gap-2">
								<Feather name="info" size={24} color="gray" />
								<Text className="text-xl font-semibold">
									App Informaton
								</Text>
							</View>
						</CardHeader>
						<CardContent>
							<View className="flex-row justify-between items-center">
								<Text className="text-gray-500 font-semibold">
									Version
								</Text>
								<Text className="font-semibold">1.0.0</Text>
							</View>
							<View className="flex-row mt-2 justify-between items-center">
								<Text className="text-gray-500 font-semibold">
									Last Updated
								</Text>
								<Text className="font-semibold">
									January 15, 2025
								</Text>
							</View>
							<View className="flex-row mt-2 justify-between items-center">
								<Text className="text-gray-500 font-semibold">
									Build
								</Text>
								<Text className="font-semibold">
									2025.01.15.001
								</Text>
							</View>
							<Separator className="my-4" />
							<View className="flex-row justify-evenly">
								<Button variant={'outline'}>
									<Text className="font-semibold">
										Terms of Service
									</Text>
								</Button>
								<Button variant={'outline'}>
									<Text className="font-semibold">
										About KENIC
									</Text>
								</Button>
							</View>
						</CardContent>
					</Card>
				</View>
			</ScrollView>
		</AppSafeView>
	);
}
