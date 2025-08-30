import ProductCard from '@/components/merchandise/ProductCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/table/data-table';
import { CategoryTableSchema } from '@/components/merchandise/CategoryTableSchema';

const productCategories = [
	{
		id: 1,
		name: 'Crochet Bags',
		description: 'Handmade crochet bags of various styles and colors',
	},
	{
		id: 2,
		name: 'Crochet Clothes',
		description: 'Stylish crochet tops, sweaters, and dresses',
	},
	{
		id: 3,
		name: 'Crochet Home Decor',
		description: 'Beautiful crochet items for home decoration',
	},
	{
		id: 4,
		name: 'Crochet Accessories',
		description: 'Small handmade items like hats, scarves, and jewelry',
	},
];

const products = [
	{
		id: 1,
		category_id: 1,
		category_name: 'Crochet Bags',
		name: 'Handmade Tote Bag',
		price: 35.99,
		image_url: [
			'https://picsum.photos/500/300',
			'https://picsum.photos/500/300',
		],
		description:
			'A large handmade crochet tote bag perfect for shopping or daily use.',
		items_sold: 12,
	},
	{
		id: 2,
		category_id: 2,
		category_name: 'Crochet Clothes',
		name: 'Crochet Summer Top',
		price: 25.0,
		image_url: [
			'https://picsum.photos/500/300',
			'https://picsum.photos/500/300',
		],
		description: 'Lightweight crochet top perfect for summer wear.',
		items_sold: 30,
	},
	{
		id: 3,
		category_id: 3,
		category_name: 'Crochet Home Decor',
		name: 'Crochet Table Runner',
		price: 18.5,
		image_url: [
			'https://picsum.photos/500/300',
			'https://picsum.photos/500/300',
		],
		description:
			'Elegant handmade crochet table runner for dining and living rooms.',
		items_sold: 5,
	},
	{
		id: 4,
		category_id: 4,
		category_name: 'Crochet Accessories',
		name: 'Crochet Beanie',
		price: 15.0,
		image_url: ['https://picsum.photos/500/300'],
		description: 'Warm crochet beanie available in multiple colors.',
		items_sold: 20,
	},
];

function Merchandise() {
	return (
		<div className="space-y-6 p-4 min-h-full bg-gray-100">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Merchandise & Categories
					</h1>
					<p className="text-muted-foreground">
						Manage your merch and its categories
					</p>
				</div>
			</div>

			<Tabs className="space-y-6" defaultValue="products">
				<TabsList>
					<TabsTrigger value="products">Products</TabsTrigger>
					<TabsTrigger value="categories">Categories</TabsTrigger>
				</TabsList>
				<TabsContent value="products">
					<Button className="gradient-primary mb-4 cursor-pointer hover:accent-hover shadow-glow">
						<Plus className="w-4 h-4 mr-2" />
						Create New Product
					</Button>
					<Card>
						<CardContent className="p-6">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
								<Input
									placeholder="Search products by name or category..."
									className="pl-10"
								/>
							</div>
						</CardContent>
					</Card>
					<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
					<div className="flex justify-center mt-4">
						<Button variant="outline">Load More</Button>
					</div>
				</TabsContent>
				<TabsContent value="categories">
					<Button className="gradient-primary mb-4 cursor-pointer hover:accent-hover shadow-glow">
						<Plus className="w-4 h-4 mr-2" />
						Create New Category
					</Button>
					<DataTable
						data={productCategories}
						columns={CategoryTableSchema}
						searchableColumns={[
							{
								id: 'name',
								title: 'Name',
							},
						]}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default Merchandise;
