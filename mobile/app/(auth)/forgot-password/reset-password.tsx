import { useState } from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather, AntDesign, FontAwesome } from '@expo/vector-icons';

import AppSafeView from '~/components/shared/AppSafeView';
import AppControlerInput from '~/components/shared/AppControlInput';
import AppShowMessage from '~/components/shared/AppShowMessage';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { IS_IOS } from '~/constants/os';
import ModalToLogo from '~/components/modal/ModalToLogo';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import KeNICSpinnerOverlay from '~/components/shared/KeNICSpinnerOverlay';
import { z } from 'zod';
import resetPassword from '~/services/resetPassword';
import { ResetPasswordSchema } from '~/lib/schemas';
import { ResetPasswordForm } from '~/lib/types';
import { View } from 'react-native';

export default function ResetPassword() {
	const { token } = useLocalSearchParams();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setConfirmShowPassword] = useState(false);
	const { control, handleSubmit } = useForm<ResetPasswordForm>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			token: token as string,
		},
	});

	const mutation = useMutation({
		mutationFn: resetPassword,
		onSuccess: () => {
			AppShowMessage({
				message: 'Password reset successful',
				type: 'success',
				icon: () => <AntDesign name="check" size={20} color="white" />,
			});
			router.replace('/(auth)/signin');
		},
		onError: (error: any) => {
			AppShowMessage({
				message: error.message || 'Failed to reset password',
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

	const onSubmit = (values: ResetPasswordForm) => {
		mutation.mutate(values);
	};

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
					{mutation.isPending && <KeNICSpinnerOverlay />}

					<ModalToLogo
						title="Reset Password"
						subtitle="Enter your new password"
						icon={<Feather name="lock" size={32} color="white" />}
					/>

					<Card className="mx-4 p-6 mt-20">
						<Text className="text-2xl font-bold mb-6">
							Reset Password
						</Text>

						<Text className="font-semibold mb-2">New Password</Text>
						<View className="flex-row items-center border border-gray-300 rounded-md px-2">
							<AppControlerInput
								control={control}
								name="newPassword"
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

						<Text className="font-semibold mb-2 mt-4">
							Confirm Password
						</Text>
						<View className="flex-row items-center border border-gray-300 rounded-md px-2">
							<AppControlerInput
								control={control}
								name="confirmPassword"
								placeholder="Re-enter new password"
								secureTextEntry={!showConfirmPassword}
								className="flex-1 border-0"
							/>
							<TouchableOpacity
								onPress={() =>
									setConfirmShowPassword(!showConfirmPassword)
								}
							>
								<Feather
									name={showPassword ? 'eye-off' : 'eye'}
									size={20}
									color="gray"
								/>
							</TouchableOpacity>
						</View>

						<Button
							className="mt-10"
							onPress={handleSubmit(onSubmit)}
							variant="default"
						>
							<Text className="text-white font-bold">Submit</Text>
						</Button>
					</Card>
				</ScrollView>
			</KeyboardAvoidingView>
		</AppSafeView>
	);
}
