import { z } from 'zod';

export const PaymentSchema = z.object({
	id: z.number().int().positive(),
	order_id: z.number().int().positive(),
	user_id: z.number().int().positive().nullable(),
	payment_method: z.string(),
	amount: z.number().nonnegative().max(99999999.99),
	status: z.boolean(),
	updated_by: z.number().int().positive().nullable(),
	created_by: z.number().int().positive().nullable(),
	updated_at: z.iso.datetime(),
	created_at: z.iso.datetime(),
});

export type Payment = z.infer<typeof PaymentSchema>;

export const PaymentFormSchema = z.object({
	order_id: z.string().min(1, 'Order ID is required'),
	user_id: z.string().optional().nullable(),
	payment_method: z.string(),
	amount: z
		.string()
		.min(1, 'Amount is required')
		.regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format')
		.transform((val) => parseFloat(val)),
	status: z.boolean().default(false),
	created_by: z.string().optional().nullable(),
	updated_by: z.string().optional().nullable(),
});

export type PaymentFormInput = z.infer<typeof PaymentFormSchema>;
