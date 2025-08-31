import React, { useState } from 'react';
import { View, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';

type VerifyOTPProps = {
	visible: boolean;
	onClose: (close: boolean) => void;
	onVerify: (otp: string) => void;
	onResend: () => void;
};

const VerifyOTPOverlay: React.FC<VerifyOTPProps> = ({
	visible,
	onClose,
	onVerify,
	onResend,
}) => {
	const [otp, setOtp] = useState('');

	const handleVerify = () => {
		if (otp.length === 6) {
			onVerify(otp);
			setOtp('');
		}
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={() => onClose(false)}
		>
			<View className="flex-1 bg-black/40 justify-center items-center px-6">
				<View className="bg-white rounded-2xl p-6 w-full">
					<Text className="text-xl font-bold text-center mb-4">
						Verify OTP
					</Text>
					<Text className="text-center text-gray-600 mb-6">
						Enter the 6-digit code we sent to your phone
					</Text>

					<TextInput
						value={otp}
						onChangeText={setOtp}
						keyboardType="numeric"
						maxLength={6}
						className="border border-gray-300 rounded-lg text-center text-2xl tracking-widest p-3"
						placeholder="••••••"
					/>

					<View className="flex-row justify-between mt-6">
						<Button
							className="flex-1 mr-2"
							variant="outline"
							onPress={() => onClose(false)}
						>
							<Text className="font-bold">Cancel</Text>
						</Button>
						<Button
							className="flex-1 ml-2"
							variant="default"
							onPress={handleVerify}
							disabled={otp.length < 6}
						>
							<Text className="text-white font-bold">Verify</Text>
						</Button>
					</View>

					<TouchableOpacity
						onPress={onResend}
						className="mt-4 self-center"
					>
						<Text className="text-primary font-semibold">
							Resend Code
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

export default VerifyOTPOverlay;
