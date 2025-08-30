import { z } from 'zod';

export const OrderDetailsSchema = z.object({
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	email: z.email(),
	phone_number: z.string().min(7),
	address: z.string().min(1),
	city: z.string().min(1),
	postal_code: z.string().min(1),
	payment_method: z.string(),
});

export type OrderDetails = z.infer<typeof OrderDetailsSchema>;

export const OrderSchema = z.object({
	id: z.number().int().positive(),
	user_id: z.number().int().positive().nullable(),
	amount: z.number(),
	status: z.string(),
	payment_status: z.boolean().default(false),
	order_details: OrderDetailsSchema,
});

export type Order = z.infer<typeof OrderSchema>;

export const OrderItemSchema = z.object({
	order_id: z.number().int().positive(),
	product_id: z.number().int().positive(),
	size: z.string().min(1),
	color: z.string().min(1),
	quantity: z.number().int().positive().default(1),
	amount: z.number(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
