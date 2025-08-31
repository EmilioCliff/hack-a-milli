import React from 'react';
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/store/store';
import { useRouter } from 'expo-router';
import { closeLoginModal } from '~/store/slices/ui';

export default function LoginModal() {
	const dispatch = useDispatch();
	const router = useRouter();
	const visible = useSelector((s: RootState) => s.ui.showLoginModal);

	const goToLogin = () => {
		dispatch(closeLoginModal());
		router.push('/signin');
	};

	return (
		<Modal
			visible={visible}
			animationType="fade"
			transparent
			onRequestClose={() => dispatch(closeLoginModal())}
		>
			<View style={styles.backdrop}>
				<View style={styles.card}>
					<Text style={styles.title}>Login required</Text>
					<Text style={styles.msg}>
						You need to login to watch or bid on auctions. Would you
						like to login now?
					</Text>

					<View style={styles.actions}>
						<TouchableOpacity
							onPress={() => dispatch(closeLoginModal())}
							style={[styles.btn, styles.btnOutline]}
						>
							<Text style={styles.btnOutlineText}>Cancel</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={goToLogin}
							style={[styles.btn, styles.btnPrimary]}
						>
							<Text style={styles.btnPrimaryText}>
								Go to Login
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.45)',
		justifyContent: 'center',
		padding: 20,
	},
	card: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 20,
		elevation: 6,
		shadowColor: '#000',
		shadowOpacity: 0.15,
		shadowRadius: 12,
	},
	title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
	msg: { fontSize: 14, color: '#333', marginBottom: 18 },
	actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
	btn: {
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: 8,
		marginLeft: 8,
	},
	btnPrimary: { backgroundColor: '#CE1126' },
	btnPrimaryText: { color: 'white', fontWeight: '600' },
	btnOutline: {
		borderWidth: 1,
		borderColor: '#ccc',
		backgroundColor: 'white',
	},
	btnOutlineText: { color: '#333', fontWeight: '600' },
});
