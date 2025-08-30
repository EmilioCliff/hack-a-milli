import { z } from 'zod';

export const ProductSchema = z.object({
	id: z.number().int().optional(),
	category_id: z.number().int(),
	category_name: z.string().optional(),
	name: z.string().min(1),
	price: z.number().min(0),
	image_url: z.array(z.url()).default([]),
	description: z.string().optional().nullable(),
	items_sold: z.number().int().default(0),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductFormSchema = ProductSchema.pick({
	category_id: true,
	name: true,
	price: true,
	image_url: true,
	description: true,
});

export type ProductForm = z.infer<typeof ProductFormSchema>;

export const ProductCategorySchema = z.object({
	id: z.number().int().optional(),
	name: z.string().min(1, 'Category name is required'),
	description: z.string().optional().nullable(),
});

export type ProductCategory = z.infer<typeof ProductCategorySchema>;

export const ProductCategoryFormSchema = ProductCategorySchema.pick({
	name: true,
	description: true,
});

export type ProductCategoryForm = z.infer<typeof ProductCategoryFormSchema>;
