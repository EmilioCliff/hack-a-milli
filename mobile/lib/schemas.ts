import { z } from 'zod';

export const SignInFormShema = z.object({
	email: z.email('Valid email required'),
	password: z.string().min(1, 'Password required'),
});

export const SignUpFormSchema = z.object({
	email: z.email('Valid email required'),
	full_name: z.string().min(1, 'Full name required'),
	phone_number: z
		.string()
		.length(10, 'Phone must be 10 digits')
		.regex(/^[0-9]{10,}$/, 'Enter a valid phone number'),
	password: z.string().min(4, 'Password must be at least 4 characters'),
	address: z.string().optional(),
});

export const ForgotPasswordSchema = z.object({
	email: z.string('Enter a valid email').optional(),
	phone_number: z
		.string()
		.regex(/^[0-9]{10,}$/, 'Enter a valid phone number')
		.optional(),
});

export const VerifyOTPSchema = z.object({
	phone_number: z
		.string()
		.regex(/^[0-9]{10,}$/, 'Enter a valid phone number'),
	otp: z.string().length(6, 'OTP must be 6 characters'),
});

export const ResetPasswordSchema = z
	.object({
		newPassword: z
			.string()
			.min(4, 'Password must be at least 4 characters'),
		confirmPassword: z.string().min(4, 'Confirm password is required'),
		token: z.string().optional(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});
