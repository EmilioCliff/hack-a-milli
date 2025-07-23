import { useRouter } from 'expo-router';
import AppSafeView from '~/components/shared/AppSafeView';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function SignInPage() {
	const router = useRouter();
	return (
		<AppSafeView>
			<Text>signin</Text>
			<Button onPress={() => router.push('/(drawer)/(tabs)')}>
				<Text>Back Home</Text>
			</Button>
		</AppSafeView>
	);
}
