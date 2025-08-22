import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Progress } from '~/components/ui/progress';
import { X } from 'lucide-react-native';

export default function DownloadOverlayDemo() {
	const [downloadProgress, setDownloadProgress] = useState(0);
	const [isDownloading, setIsDownloading] = useState(false);
	let intervalRef: ReturnType<typeof setInterval>;

	const startDownload = () => {
		setIsDownloading(true);
		setDownloadProgress(0);

		intervalRef = setInterval(() => {
			setDownloadProgress((prev) => {
				if (prev >= 100) {
					clearInterval(intervalRef);
					return 100;
				}
				return prev + 5;
			});
		}, 300);
	};

	const handleCancel = () => {
		clearInterval(intervalRef);
		setIsDownloading(false);
		setDownloadProgress(0);
	};

	useEffect(() => {
		// auto start download for demo
		startDownload();
		return () => clearInterval(intervalRef);
	}, []);

	return (
		<View className="flex-1 items-center justify-center bg-gray-100">
			{!isDownloading ? (
				<TouchableOpacity
					onPress={startDownload}
					className="bg-blue-500 px-4 py-2 rounded-lg"
				>
					<Text className="text-white font-bold">Start Download</Text>
				</TouchableOpacity>
			) : (
				<View className="absolute left-0 right-0 top-0 bottom-0 z-50 bg-black/60 items-center justify-center p-6">
					<View className="bg-white p-6 rounded-2xl w-11/12 max-w-md items-center">
						<Text className="text-lg font-bold mb-4">
							Downloading File...
						</Text>
						<Progress
							value={downloadProgress}
							className="w-full h-3 mb-3 bg-gray-200"
						/>
						<Text className="mb-4">{downloadProgress}%</Text>

						<TouchableOpacity
							onPress={handleCancel}
							className="flex-row items-center bg-red-500 px-4 py-2 rounded-lg"
						>
							<X color="white" size={18} />
							<Text className="text-white font-bold ml-2">
								Cancel
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</View>
	);
}
