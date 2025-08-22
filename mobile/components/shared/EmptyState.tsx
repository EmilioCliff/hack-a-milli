import { View } from 'react-native';
import { Text } from '../ui/text';

type EmptyStateProps = {
	title: string;
	subtitle: string;
	icon?: React.ReactNode;
};

const EmptyState = ({ title, subtitle, icon }: EmptyStateProps) => {
	return (
		<View className="flex-1 items-center justify-center p-6">
			{icon}
			<Text className="text-lg font-semibold text-gray-800">{title}</Text>
			<Text className="text-gray-500 mt-1 text-center">{subtitle}</Text>
		</View>
	);
};

export default EmptyState;
