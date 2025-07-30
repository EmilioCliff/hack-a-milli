import { View } from 'react-native';
import { Text } from '../ui/text';

interface FAQProps {
	question: string;
	answer: string;
}

export default function FAQ(props: FAQProps) {
	return (
		<View className="border border-border rounded-lg p-4">
			<Text className="font-medium text-gray-800 mb-2">
				{props.question}
			</Text>
			<Text className="text-sm text-gray-600">{props.answer}</Text>
		</View>
	);
}
