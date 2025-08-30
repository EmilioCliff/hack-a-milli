import { z } from 'zod';

// Auction schema
export const auctionSchema = z.object({
	id: z.number().int().positive(),
	domain: z.string().min(3).max(255),
	category: z.string().min(3).max(50),
	description: z.string().min(10),
	current_bid: z.number().nonnegative(),
	start_price: z.number().positive(),
	start_time: z.iso.datetime(),
	end_time: z.iso.datetime(),
	watchers: z.number().int().nonnegative().default(0),
	bids_count: z.number().int().nonnegative().default(0),
	status: z.string().default('active'),
	created_by: z.number().int().positive(),
	created_at: z.iso.datetime(),
	updated_by: z.number().int().positive(),
	updated_at: z.iso.datetime(),
});

export type Auction = z.infer<typeof auctionSchema>;

// Bid schema
export const bidSchema = z.object({
	id: z.number().int().positive(),
	user_id: z.number().int().positive(),
	auction_id: z.number().int().positive(),
	user_identifier: z.string().min(3).max(50),
	amount: z.number().positive(),
	created_at: z.iso.datetime(),
});

export type Bid = z.infer<typeof bidSchema>;

// Watcher schema
export const watcherSchema = z.object({
	id: z.number().int().positive(),
	user_id: z.number().int().positive(),
	auction_id: z.number().int().positive(),
	status: z.enum(['active', 'inactive']).default('active'),
	created_at: z.iso.datetime(),
});

export type Watcher = z.infer<typeof watcherSchema>;

export const auctionFormSchema = z.object({
	domain: z
		.string()
		.min(3, { message: 'Domain must be at least 3 characters' })
		.max(255),
	category: z.enum(['gold', 'silver', 'platinum']),
	description: z.string().min(10, { message: 'Description is too short' }),
	start_price: z
		.number()
		.positive({ message: 'Start price must be greater than 0' }),
	start_time: z.iso.datetime(),
	end_time: z.iso.datetime(),
});

export type AuctionFormType = z.infer<typeof auctionFormSchema>;
