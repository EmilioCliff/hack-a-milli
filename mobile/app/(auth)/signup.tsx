import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
	KeyboardAvoidingView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import ModalToLogo from '~/components/modal/ModalToLogo';
import AppControlerInput from '~/components/shared/AppControlInput';
import AppSafeView from '~/components/shared/AppSafeView';
import AppShowMessage from '~/components/shared/AppShowMessage';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { IS_IOS } from '~/constants/os';
import { SignUpFormSchema } from '~/lib/schemas';
import { SignUpFormType } from '~/lib/types';
import signUp from '~/services/signup';
import { login } from '~/store/slices/user';

export default function SignUpPage() {
	const { control, handleSubmit } = useForm<SignUpFormType>({
		resolver: zodResolver(SignUpFormSchema),
	});
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const dispatch = useDispatch();

	const mutation = useMutation({
		mutationFn: signUp,
		onSuccess: async (data) => {
			AppShowMessage({
				message: `Welcome to KeNIC ${data.data.user.full_name}`,
				type: 'success',
				position: 'top',
				icon: () => <AntDesign name="check" size={24} color="white" />,
			});
			// save it to redux if rememberMe is checked
			dispatch(login(data.data.user));
			router.replace('/(drawer)/(tabs)');
		},
		onError: (error: any) => {
			AppShowMessage({
				message: error.message,
				type: 'danger',
				position: 'top',
				icon: () => (
					<FontAwesome
						name="exclamation-triangle"
						size={24}
						color="white"
					/>
				),
			});
		},
	});

	function onSubmit(values: SignUpFormType) {
		mutation.mutate({ ...values });
	}

	function onError(errors: any) {
		console.log(errors);
	}

	return (
		<AppSafeView>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={IS_IOS ? 'padding' : 'height'}
				keyboardVerticalOffset={IS_IOS ? 90 : 0}
			>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<ModalToLogo
						title="Welcome To KeNIC"
						subtitle="Sign up for a KENIC account"
						icon={<Feather name="globe" size={32} color="white" />}
					/>

					<Card className="mx-4 p-6 mt-12">
						<View className="mb-4">
							<Text className="font-semibold text-xl">Email</Text>
							<AppControlerInput
								control={control}
								name="email"
								placeholder="john.doe@exampl.com"
							/>
						</View>
						<View className="mb-4">
							<Text className="font-semibold text-xl">
								Full Name
							</Text>
							<AppControlerInput
								control={control}
								name="full_name"
								placeholder="John Doe"
							/>
						</View>
						<View className="mb-4">
							<Text className="font-semibold text-xl">
								Phone Number
							</Text>
							<AppControlerInput
								control={control}
								name="phone_number"
								placeholder="0712345678"
							/>
						</View>
						<View className="mb-4">
							<Text className="font-semibold text-xl">
								Address{' '}
								<Text className="text-sm text-muted-foreground">
									(Optional)
								</Text>
							</Text>
							<AppControlerInput
								control={control}
								name="address"
								placeholder="Kitengela, Kajiado"
							/>
						</View>

						<Text className="font-semibold text-xl">Password</Text>
						<View className="flex-row items-center border border-gray-300 rounded-md px-2">
							<AppControlerInput
								control={control}
								name="password"
								placeholder="Enter Your Password"
								secureTextEntry={!showPassword}
								className="flex-1 border-0"
							/>
							<TouchableOpacity
								onPress={() => setShowPassword(!showPassword)}
							>
								<Feather
									name={showPassword ? 'eye-off' : 'eye'}
									size={20}
									color="gray"
								/>
							</TouchableOpacity>
						</View>

						<View className="flex-row justify-between items-center">
							<View className="flex-row items-center mt-4">
								<Checkbox
									checked={rememberMe}
									onCheckedChange={setRememberMe}
								/>
								<Text className="ml-2">Remember me</Text>
							</View>
						</View>

						<Button
							className="mt-14"
							onPress={handleSubmit(onSubmit, onError)}
							variant="default"
						>
							<Text className="text-white font-bold">
								Sign Up
							</Text>
						</Button>
						<Button
							className="mt-4"
							onPress={() => router.push('/(auth)/signin')}
							variant="outline"
						>
							<Text className="font-bold">Sign In</Text>
						</Button>
					</Card>

					<View className="flex-row items-center my-4 mx-6">
						<View className="flex-1 h-[1px] bg-gray-300" />
						<Text className="mx-2 text-gray-500">OR</Text>
						<View className="flex-1 h-[1px] bg-gray-300" />
					</View>

					<View className="flex-row gap-4 justify-center mx-6">
						<TouchableOpacity
							className="flex-row items-center justify-center flex-1 border border-gray-300 rounded-lg py-3"
							onPress={() =>
								AppShowMessage({
									message: 'Google login not implemented yet',
									type: 'info',
									position: 'top',
									icon: () => (
										<AntDesign
											name="info"
											size={24}
											color="white"
										/>
									),
								})
							}
						>
							<AntDesign
								name="google"
								size={20}
								color="#DB4437"
							/>
							<Text className="ml-2 font-semibold">Google</Text>
						</TouchableOpacity>

						<TouchableOpacity
							className="flex-row items-center justify-center flex-1 border border-gray-300 rounded-lg py-3"
							onPress={() =>
								AppShowMessage({
									message:
										'Facebook login not implemented yet',
									type: 'info',
									position: 'top',
									icon: () => (
										<AntDesign
											name="info"
											size={24}
											color="white"
										/>
									),
								})
							}
						>
							<FontAwesome
								name="facebook"
								size={20}
								color="#1877F2"
							/>
							<Text className="ml-2 font-semibold">Facebook</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</AppSafeView>
	);
}
