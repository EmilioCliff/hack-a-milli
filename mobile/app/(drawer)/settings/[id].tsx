import { EvilIcons, Feather, FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { TextInput } from 'react-native';
import { Pressable, ScrollView, View } from 'react-native';
import AppSafeView from '~/components/shared/AppSafeView';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';

interface userProfileProps {
	profileUrl: string;
	role: string;
	fullName: string;
	email: string;
	phoneNumber: string;
	address: string;
	joinDate: string;
}

const data = {
	profileUrl: '',
	role: 'Guest',
	fullName: 'John Doe',
	email: 'john@example.com',
	phoneNumber: '+2547123456789',
	address: '123 Sales Avenue, Lagos',
	joinDate: '6/15/2023',
};

export default function UserProfile() {
	const [editMode, setEditMode] = useState(false);
	return (
		<AppSafeView>
			<ScrollView
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
			>
				<View className="px-4 mb-6">
					<View className="mx-auto items-center mb-6">
						<View className="relative bg-secondary rounded-full p-1 w-[80] h-[80] mb-2 shadow-[2px_3px_4px_rgba(0,0,0,0.25)]">
							<Avatar className="w-full h-full" alt="User Avatar">
								<AvatarImage
									source={{ uri: data.profileUrl }}
								/>
								<AvatarFallback>
									<Text>
										{data.fullName
											.split(' ')
											.map((word) => word.charAt(0))
											.join('')
											.toUpperCase()}
									</Text>
								</AvatarFallback>
							</Avatar>
							{editMode && (
								<View className="absolute -right-2 bottom-2 p-2 bg-primary rounded-full">
									<Feather
										name="camera"
										size={14}
										color="white"
									/>
								</View>
							)}
						</View>
						<Text className="text-xl font-extrabold">
							{data.fullName}
						</Text>
						<Text className="text-xl font-semibold">
							{data.role}
						</Text>
						<Text className="text-sm text-gray-500">
							{data.joinDate}
						</Text>
					</View>
					<View>
						{editMode ? (
							<Card>
								<CardHeader>
									<View className="flex-row justify-between items-center">
										<CardTitle>
											Personal Information
										</CardTitle>
										<Pressable
											onPress={() =>
												setEditMode(!editMode)
											}
										>
											<Feather
												name="save"
												size={18}
												color="black"
											/>
										</Pressable>
									</View>
								</CardHeader>
								<CardContent>
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
										Phone Number
									</Text>
									<TextInput
										placeholder="+234 812 345 6789"
										value={''}
										className="border border-gray-300 rounded-md px-4 py-2 mb-6"
									/>
									<Text className="text-lg font-bold">
										Address
									</Text>
									<TextInput
										placeholder="123 Sales Avenue, Lagos"
										value={''}
										className="border border-gray-300 rounded-md px-4 py-2 mb-6"
									/>
									<Button>
										<Text className="text-lg font-bold">
											Update Info
										</Text>
									</Button>
								</CardContent>
							</Card>
						) : (
							<Card>
								<CardHeader>
									<View className="flex-row justify-between items-center">
										<CardTitle>
											Personal Information
										</CardTitle>
										<Pressable
											onPress={() =>
												setEditMode(!editMode)
											}
										>
											<Feather
												name="edit"
												size={18}
												color="black"
											/>
										</Pressable>
									</View>
								</CardHeader>
								<CardContent>
									<View className="flex-row gap-3 mb-4">
										<Feather
											name="user"
											size={24}
											color="black"
										/>
										<View>
											<Text className="text-lg font-semibold">
												Full Name
											</Text>
											<Text>{data.fullName}</Text>
										</View>
									</View>
									<View className="flex-row gap-3 mb-4">
										<FontAwesome
											name="envelope-o"
											size={24}
											color="black"
										/>
										<View>
											<Text className="text-lg font-semibold">
												Email
											</Text>
											<Text>{data.email}</Text>
										</View>
									</View>
									<View className="flex-row gap-3 mb-4">
										<Feather
											name="phone"
											size={24}
											color="black"
										/>
										<View>
											<Text className="text-lg font-semibold">
												Phone
											</Text>
											<Text>{data.phoneNumber}</Text>
										</View>
									</View>
									<View className="flex-row gap-3 mb-4">
										<Feather
											name="map-pin"
											size={24}
											color="black"
										/>
										<View>
											<Text className="text-lg font-semibold">
												Address
											</Text>
											<Text>{data.address}</Text>
										</View>
									</View>
								</CardContent>
							</Card>
						)}
					</View>
				</View>
			</ScrollView>
		</AppSafeView>
	);
}
