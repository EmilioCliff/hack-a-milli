import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
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
import { ForgotPasswordSchema } from '~/lib/schemas';
import { ForgotPasswordForm } from '~/lib/types';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import recoverPassword from '~/services/recoverPassword';
import KeNICSpinnerOverlay from '~/components/shared/KeNICSpinnerOverlay';
import VerifyOTPOverlay from '~/components/auth/VerifyOTP';
import verifyOTP from '~/services/verifyOTP';
import resendOTP from '~/services/resendOTP';

export default function ForgotPassword() {
	const [method, setMethod] = useState<'email' | 'sms' | null>(null);
	const [otpVisible, setOPTVisible] = useState(false);
	const [token, setToken] = useState('');

	const { control, handleSubmit, getValues } = useForm<ForgotPasswordForm>({
		resolver: zodResolver(ForgotPasswordSchema),
	});

	// mutation to handle password recovery
	const mutation = useMutation({
		mutationFn: recoverPassword,
		onSuccess: (data) => {
			if (method === 'email') {
				AppShowMessage({
					message: `Password reset email sent`,
					type: 'success',
					icon: () => (
						<AntDesign name="check" size={20} color="white" />
					),
				});
				router.replace('/(drawer)/(tabs)');
			} else {
				AppShowMessage({
					message: `Password reset SMS sent`,
					type: 'success',
					icon: () => (
						<AntDesign name="check" size={20} color="white" />
					),
				});
				setToken(data.data);
				setOPTVisible(true);
			}
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

	// mutation to handle OTP verification
	const verifyOTPMutation = useMutation({
		mutationFn: verifyOTP,
		onSuccess: () => {
			router.replace({
				pathname: '/(auth)/forgot-password/reset-password',
				params: { token: token },
			});
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

	// mutation to handle OTP resend
	const resendOTPMutation = useMutation({
		mutationFn: resendOTP,
		onSuccess: () => {
			// router.replace('/(auth)/forgot-password/reset-password');
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

	const onVerifyOtp = (otp: string) => {
		const phone_number = getValues('phone_number');
		if (!phone_number) {
			AppShowMessage({
				message: 'Please enter your phone number',
				type: 'danger',
				icon: () => (
					<Feather name="alert-circle" size={20} color="white" />
				),
			});
			return;
		}
		verifyOTPMutation.mutate({ phone_number, otp });
	};

	const onResendOtp = () => {
		const phone_number = getValues('phone_number');
		if (!phone_number) {
			AppShowMessage({
				message: 'Please enter your phone number',
				type: 'danger',
				icon: () => (
					<Feather name="alert-circle" size={20} color="white" />
				),
			});
			return;
		}
		resendOTPMutation.mutate(phone_number);
	};

	const onSubmit = (values: ForgotPasswordForm) => {
		if (
			(method === 'email' && values.email) ||
			(method === 'sms' && values.phone_number)
		) {
			mutation.mutate(values);
		} else {
			AppShowMessage({
				message: 'Please select a method and enter the required info',
				type: 'danger',
				icon: () => (
					<Feather name="alert-circle" size={20} color="white" />
				),
			});
		}
	};

	const onError = (errors: any) => {
		console.log(errors);
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
					{(mutation.isPending && <KeNICSpinnerOverlay />) ||
						(verifyOTPMutation.isPending && (
							<KeNICSpinnerOverlay />
						)) ||
						(resendOTPMutation.isPending && (
							<KeNICSpinnerOverlay />
						))}
					<VerifyOTPOverlay
						onVerify={onVerifyOtp}
						visible={otpVisible}
						onClose={setOPTVisible}
						onResend={onResendOtp}
					/>
					<ModalToLogo
						title="Forgot Password"
						subtitle="Choose How To Recover Your Password"
						icon={<Feather name="globe" size={32} color="white" />}
					/>
					<Card className="mx-4 p-6 mt-20">
						<Text className="text-2xl font-bold mb-6">
							Forgot Password
						</Text>

						<Text className="font-semibold mb-2">Email</Text>
						<AppControlerInput
							control={control}
							name="email"
							placeholder="john.doe@example.com"
						/>

						<Text className="font-semibold mb-2 mt-4">
							Phone Number
						</Text>
						<AppControlerInput
							control={control}
							name="phone_number"
							placeholder="0712345678"
						/>

						<View className="flex-row justify-between mt-6">
							<Button
								variant={
									method === 'email' ? 'default' : 'outline'
								}
								onPress={() => setMethod('email')}
								className="flex-1 mr-2"
							>
								<Text
									className={
										method === 'email'
											? 'text-white font-bold'
											: 'font-bold'
									}
								>
									Use Email
								</Text>
							</Button>
							<Button
								variant={
									method === 'sms' ? 'default' : 'outline'
								}
								onPress={() => setMethod('sms')}
								className="flex-1 ml-2"
							>
								<Text
									className={
										method === 'sms'
											? 'text-white font-bold'
											: 'font-bold'
									}
								>
									Use SMS
								</Text>
							</Button>
						</View>

						<Button
							className="mt-10"
							onPress={handleSubmit(onSubmit, onError)}
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
