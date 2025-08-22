import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { TextInput, View } from 'react-native';
import AppSafeView from '~/components/shared/AppSafeView';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';

export default function PasswordPage() {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');
	const [secureCurrentTextEntry, setCurrentSecureTextEntry] = useState(true);
	const [secureNewTextEntry, setNewSecureTextEntry] = useState(true);
	const [secureConfirmTextEntry, setConfirmSecureTextEntry] = useState(true);
	return (
		<AppSafeView>
			<Card className="my-10 mx-4">
				<CardContent>
					<Text className="text-lg font-semibold mt-2">
						Current Password
					</Text>
					<View className="relative">
						<TextInput
							placeholder="Enter Current Password"
							value={currentPassword}
							onChangeText={setCurrentPassword}
							secureTextEntry={secureCurrentTextEntry}
							className="border border-gray-300 rounded-md px-4 py-2"
						/>
						<Pressable
							onPress={() =>
								setCurrentSecureTextEntry(
									!secureCurrentTextEntry,
								)
							}
							className="absolute right-3 top-1/3 transform -translate-y-1/3"
						>
							{secureCurrentTextEntry ? (
								<Ionicons name="eye" size={20} color="black" />
							) : (
								<Ionicons
									name="eye-off"
									size={20}
									color="black"
								/>
							)}
						</Pressable>
					</View>
					<Text className="text-lg font-semibold mt-2">
						New Password
					</Text>
					<View className="relative">
						<TextInput
							placeholder="Enter New Password"
							value={newPassword}
							onChangeText={setNewPassword}
							secureTextEntry={secureNewTextEntry}
							className="border border-gray-300 rounded-md px-4 py-2"
						/>
						<Pressable
							onPress={() =>
								setNewSecureTextEntry(!secureNewTextEntry)
							}
							className="absolute right-3 top-1/3 transform -translate-y-1/3"
						>
							{secureNewTextEntry ? (
								<Ionicons name="eye" size={20} color="black" />
							) : (
								<Ionicons
									name="eye-off"
									size={20}
									color="black"
								/>
							)}
						</Pressable>
					</View>
					<Text className="text-lg font-semibold mt-2">
						Confirm New Password
					</Text>
					<View className="relative">
						<TextInput
							placeholder="Confirm New Password"
							value={confirmNewPassword}
							onChangeText={setConfirmNewPassword}
							secureTextEntry={secureConfirmTextEntry}
							className="border border-gray-300 rounded-md px-4 py-2"
						/>
						<Pressable
							onPress={() =>
								setConfirmSecureTextEntry(
									!secureConfirmTextEntry,
								)
							}
							className="absolute right-3 top-1/3 transform -translate-y-1/3"
						>
							{secureConfirmTextEntry ? (
								<Ionicons name="eye" size={20} color="black" />
							) : (
								<Ionicons
									name="eye-off"
									size={20}
									color="black"
								/>
							)}
						</Pressable>
					</View>
					<View className="bg-red-100 my-6 p-2 rounded-lg">
						<Text className="font-semibold">
							Password Requirements:{' '}
						</Text>
						<Text>• At least 8 characterslong </Text>
						<Text>• Include uppercase and lowercase letters </Text>
						<Text>• Include at least one number </Text>
						<Text>• Include at least one special character</Text>
					</View>
					<Button className="bg-secondary">
						<Text className="font-bold">Change Password</Text>
					</Button>
				</CardContent>
			</Card>
		</AppSafeView>
	);
}
