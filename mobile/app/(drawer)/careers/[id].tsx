import {
	Dimensions,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AppSafeView from '~/components/shared/AppSafeView';
import { ScrollView } from 'react-native-gesture-handler';
import { useMutation, useQuery } from '@tanstack/react-query';
import KeNICSpinner from '~/components/shared/KeNICSpinner';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { Text } from '~/components/ui/text';
import getJobPosting from '~/services/getJobPosting';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Card } from '~/components/ui/card';
import RenderHtml from 'react-native-render-html';
import { TagsStyles } from '~/constants/sharedStyles';
import { useForm } from 'react-hook-form';
import {
	ApplicationFormSchema,
	ApplicationFormType,
} from '~/components/careers/ApplicationForm';
import { zodResolver } from '@hookform/resolvers/zod';
import AppControlerInput from '~/components/shared/AppControlInput';
import AppControlerTextArea from '~/components/shared/AppControlTextArea';
import { Button } from '~/components/ui/button';
import * as DocumentPicker from 'expo-document-picker';
import { UploadFile } from '../../../components/careers/fileUpload';
import postJobApplication from '~/services/postJobApplication';
import AppShowMessage from '~/components/shared/AppShowMessage';

const { width } = Dimensions.get('window');

export default function JobPosting() {
	const [isUploadComplete, setIsUploadComplete] = useState(true);
	const [filename, setFilename] = useState('');
	const [uploadedFile, setUploadedFile] =
		useState<DocumentPicker.DocumentPickerAsset>();
	const [tab, setTab] = useState('description');
	const { id } = useLocalSearchParams();
	const { control, handleSubmit, setValue, reset } = useForm({
		resolver: zodResolver(ApplicationFormSchema),
	});

	const { data, isLoading, error } = useQuery({
		queryKey: ['event', { id }],
		queryFn: () => getJobPosting(Number(id)),
		staleTime: 2 * 10000 * 5,
	});

	const mutation = useMutation({
		mutationFn: postJobApplication,
		onSuccess: async () => {
			AppShowMessage({
				message: 'Application Successful',
				type: 'success',
				position: 'top',
				icon: () => <AntDesign name="check" size={24} color="black" />,
			});
			reset();
			router.replace('/(drawer)/careers');
		},
		onError: (error: any) => {
			AppShowMessage({
				message: error.message,
				type: 'danger',
				position: 'top',
				icon: () => (
					<AntDesign name="warning" size={24} color="black" />
				),
			});
		},
		onSettled: () => {
			setFilename('');
			setUploadedFile(undefined);
			setIsUploadComplete(true);
		},
	});

	const onSubmit = async (formValues: ApplicationFormType) => {
		if (!uploadedFile) {
			AppShowMessage({
				message: 'Resume file missing',
				type: 'warning',
				position: 'top',
				icon: () => (
					<AntDesign name="warning" size={24} color="black" />
				),
			});

			return;
		}
		setIsUploadComplete(false);

		const file = await fetch(uploadedFile.uri);
		const fileBlob = await file.blob();

		try {
			await UploadFile(fileBlob, filename, uploadedFile.mimeType);
		} catch (err: any) {
			AppShowMessage({
				message: 'Upload Error',
				description: err,
				type: 'warning',
				position: 'top',
				icon: () => (
					<AntDesign name="warning" size={24} color="black" />
				),
			});

			setIsUploadComplete(true);

			return;
		}

		if (data?.data.id) {
			mutation.mutate({ data: formValues, id: data.data.id });
		}
	};

	const onError = (errors: any) => console.log(errors);

	const pickDocuments = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				multiple: false,
				type: 'application/pdf',
			});

			if (!result.canceled) {
				const successResult =
					result as DocumentPicker.DocumentPickerSuccessResult;

				const resumeFile = successResult.assets[0];

				if (resumeFile.size && resumeFile.size > 5 * 1024 * 1024) {
					AppShowMessage({
						message: 'File is too large',
						type: 'warning',
						position: 'top',
						icon: () => (
							<AntDesign
								name="warning"
								className="px-2"
								size={24}
								color="white"
							/>
						),
					});

					return;
				}
				const filename = `job-applications/${data?.data.id}_${resumeFile.name}_${Date.now()}`;

				setValue('resume_url', filename);
				setFilename(filename);
				setUploadedFile(resumeFile);
			} else {
				console.log('request canceled');
			}
		} catch (error) {
			AppShowMessage({
				message: 'Error picking document',
				type: 'warning',
				icon: () => (
					<AntDesign
						name="warning"
						className="px-2"
						size={24}
						color="white"
					/>
				),
			});
		}
	};

	if (isLoading || !data?.data)
		return (
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<KeNICSpinner />
			</View>
		);

	if (error) return <Ionicons name="people-sharp" size={38} color="black" />;

	return (
		<AppSafeView>
			<ScrollView
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				className="flex-1 px-4"
			>
				{isUploadComplete ? (
					<View>
						<Text className="text-center text-3xl font-extrabold mt-6">
							{data.data.title}
						</Text>
						<Text className="text-center font-semibold font-xl mb-4">
							{data.data.location} · {data.data.employment_type}
						</Text>
						<Text>
							The{' '}
							<Text className="font-bold">
								Kenya Network Information Centre (KENIC)
							</Text>{' '}
							is the organization responsible for managing and
							administering the .ke country code top-level domain
							(ccTLD). Established to ensure a reliable, secure,
							and accessible internet namespace for Kenya, KENIC
							plays a vital role in promoting Kenya’s online
							identity and digital growth. The organization works
							closely with government, industry stakeholders, and
							the global internet community to develop policies,
							enhance cybersecurity, and expand internet access.
							By fostering trust and innovation in the digital
							space, KENIC contributes to Kenya’s economic and
							social development. Joining KENIC means being part
							of a team dedicated to strengthening Kenya’s
							presence on the internet while supporting
							businesses, institutions, and individuals in their
							digital journey.
						</Text>
						<Tabs
							value={tab}
							onValueChange={setTab}
							className="w-full max-w-[400px] mx-auto gap-1.5 mt-6"
						>
							<TabsList className="flex-row w-full">
								<TabsTrigger
									value="description"
									className="flex-1"
								>
									<Text>Job Description</Text>
								</TabsTrigger>
								<TabsTrigger
									value="application"
									className="flex-1"
								>
									<Text>Apply</Text>
								</TabsTrigger>
							</TabsList>
							<TabsContent value="description">
								<Card className="p-4 mt-4">
									<Text className="text-2xl font-semibold mb-4">
										About The Role
									</Text>
									<View className="">
										<RenderHtml
											contentWidth={width - 32}
											source={{ html: data.data.content }}
											tagsStyles={TagsStyles}
										/>
									</View>
								</Card>
							</TabsContent>
							<TabsContent value="application">
								<KeyboardAvoidingView
									className="flex"
									behavior={
										Platform.OS === 'ios'
											? 'padding'
											: 'height'
									}
								>
									<Card className="p-4 my-4">
										<View className="gap-2">
											<Text className="font-semibold text-xl">
												Full Name
											</Text>
											<AppControlerInput
												control={control}
												name="full_name"
												placeholder="John Doe"
												className=""
											/>
											<Text className="font-semibold text-xl mt-4">
												Email
											</Text>
											<AppControlerInput
												control={control}
												name="email"
												placeholder="john@doe.com"
												keyboardType="email-address"
											/>
											<Text className="font-semibold text-xl mt-4">
												Phone Number
											</Text>
											<AppControlerInput
												control={control}
												name="phone_number"
												placeholder="0712345678"
												keyboardType="numeric"
											/>
											<Text className="font-semibold text-xl mt-4">
												Cover Letter
											</Text>
											<AppControlerTextArea
												control={control}
												name="cover_letter"
												placeholder="Tell us why you want to work with us"
											/>
											<Text className="font-semibold text-xl mt-4">
												Resume/CV
											</Text>
											{uploadedFile ? (
												<View className="flex-row items-center border-2 border-gray-200 rounded-md px-2 py-1">
													<View className="bg-gray-200 px-2 py-1 rounded-md">
														<Text
															className="font-bold"
															numberOfLines={1}
														>
															{uploadedFile.name}
														</Text>
													</View>
													<View className="flex-1" />
													<Pressable
														onPress={() =>
															setUploadedFile(
																undefined,
															)
														}
														className="p-1"
													>
														<AntDesign
															name="closesquareo"
															size={24}
															color="black"
														/>
													</Pressable>
												</View>
											) : (
												<Button
													variant="outline"
													className="flex-row gap-4 w-1/2"
													onPress={pickDocuments}
												>
													<Feather
														name="upload"
														size={18}
														color="black"
													/>
													<Text>Upload Resume</Text>
												</Button>
											)}
											<Text className="text-sm text-gray-500">
												Max file size 5MB
											</Text>
											<Button
												onPress={handleSubmit(
													onSubmit,
													onError,
												)}
												className="bg-primary mt-6"
											>
												<Text className="text-white font-bold text-lg">
													Submit Application
												</Text>
											</Button>
										</View>
									</Card>
								</KeyboardAvoidingView>
							</TabsContent>
						</Tabs>
					</View>
				) : (
					<KeNICSpinner />
				)}
			</ScrollView>
		</AppSafeView>
	);
}
