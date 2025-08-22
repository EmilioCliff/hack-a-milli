import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Input } from '../ui/input';
import { Text } from '../ui/text';
import { appControlerInputProps } from './AppControlInput';
import { Textarea } from '../ui/textarea';

const AppControlerTextArea = <T extends FieldValues>({
	control,
	name,
	rules,
	placeholder,
	secureTextEntry,
	keyboardType,
	className,
}: appControlerInputProps<T>) => {
	return (
		<Controller
			control={control}
			name={name}
			rules={rules}
			render={({
				field: { onChange, value },
				fieldState: { error },
			}: {
				field: {
					onChange: (value: any) => void;
					value: any;
				};
				fieldState: {
					error?: { message?: string };
				};
			}) => {
				return (
					<>
						<Textarea
							placeholder={placeholder}
							onChangeText={onChange}
							value={value}
							secureTextEntry={secureTextEntry}
							keyboardType={keyboardType}
							className={`${className ?? ''} ${
								error ? 'border-destructive' : ''
							}`}
						/>
						{error && (
							<Text className="text-sm font-medium text-destructive">
								{error.message}
							</Text>
						)}
					</>
				);
			}}
		/>
	);
};

export default AppControlerTextArea;
