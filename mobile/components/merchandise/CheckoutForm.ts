import { z } from 'zod';

// order item
export const OrderItemsSchema = z.object({
	product_id: z.number({ message: 'Product ID is required' }),
	size: z.string({ message: 'Size is required' }),
	color: z.string({ message: 'Color is required' }),
	quantity: z.number({ message: 'Quantity is required' }).min(1),
});

// order user details
export const UserDetailsSchema = z.object({
	first_name: z
		.string({ message: 'First Name is required' })
		.min(1, { message: 'First Name is required' }),
	last_name: z
		.string({ message: 'Last Name is required' })
		.min(1, { message: 'Last Name is required' }),
	email: z.email({ message: 'Invalid email address' }),
	phone_number: z
		.string({ message: 'Phone Number is required' })
		.min(1, { message: 'Phone Number is required' }),
	address: z
		.string({ message: 'Address is required' })
		.min(1, { message: 'Address is required' }),
	city: z
		.string({ message: 'City is required' })
		.min(1, { message: 'City is required' }),
	postal_code: z
		.string({ message: 'Postal Code is required' })
		.min(1, { message: 'Postal Code is required' }),
	payment_method: z
		.string({ message: 'Payment Method is required' })
		.min(1, { message: 'Payment Method is required' }),
});

// order payload
export const OrderPayloadSchema = z.object({
	user_id: z.number().optional(),
	status: z.string({ message: 'Status is required' }),
	payment_status: z.string({ message: 'Payment status is required' }),
	order_details: UserDetailsSchema,
	items: z.array(OrderItemsSchema, {
		message: 'At least one item is required',
	}),
});

export type OrderItemsFormType = z.infer<typeof OrderItemsSchema>;
export type UserDetailsSchemaFormType = z.infer<typeof UserDetailsSchema>;
export type OrderPayloadFormType = z.infer<typeof OrderPayloadSchema>;
