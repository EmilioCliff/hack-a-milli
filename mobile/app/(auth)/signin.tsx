import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { Redirect, router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { View, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import ModalToLogo from '~/components/modal/ModalToLogo';
import AppControlerInput from '~/components/shared/AppControlInput';
import AppSafeView from '~/components/shared/AppSafeView';
import AppShowMessage from '~/components/shared/AppShowMessage';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { SignInFormType } from '~/lib/types';
import { Checkbox } from '~/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInFormShema } from '~/lib/schemas';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '~/store/slices/user';
import signIn from '~/services/signin';
import { IS_IOS } from '~/constants/os';
import { ScrollView } from 'react-native';
import { RootState } from '~/store/store';
import { saveRefreshToken, setAccessToken } from '~/lib/auth';

export default function RegisterScreen() {
	const { control, handleSubmit } = useForm<SignInFormType>({
		resolver: zodResolver(SignInFormShema),
	});
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const dispatch = useDispatch();
	const isAuthenticated = useSelector((state: RootState) => {
		return state.user.isAuthenticated;
	});

	const mutation = useMutation({
		mutationFn: signIn,
		onSuccess: async (data) => {
			AppShowMessage({
				message: `Welcome ${data.data.user.full_name}`,
				type: 'success',
				position: 'top',
				icon: () => <AntDesign name="check" size={24} color="white" />,
			});
			setAccessToken(data.data.auth.access_token);
			saveRefreshToken(data.data.auth.refresh_token!);
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

	function onSubmit(values: SignInFormType) {
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
						title="Welcome Back"
						subtitle="Sign in to your KENIC account"
						icon={<Feather name="globe" size={32} color="white" />}
					/>

					<Card className="mx-4 p-6 mt-12">
						<View className="mb-4">
							<Text className="font-semibold text-xl">Email</Text>
							<AppControlerInput
								control={control}
								name="email"
								placeholder="Enter Your Email"
							/>
						</View>

						<Text className="font-semibold text-xl mt-4">
							Password
						</Text>
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
							<TouchableOpacity
								className="mt-2 self-end"
								onPress={() =>
									router.push('/(auth)/forgot-password')
								}
							>
								<Text className="text-primary font-semibold">
									Forgot Password?
								</Text>
							</TouchableOpacity>
						</View>

						<Button
							className="gap-6 mt-14"
							onPress={handleSubmit(onSubmit, onError)}
							variant="default"
						>
							<Text className="text-white font-bold">
								Sign In
							</Text>
						</Button>
						<Button
							className="mt-4"
							onPress={() => router.push('/(auth)/signup')}
							variant="outline"
						>
							<Text className="font-bold">Sign Up</Text>
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
