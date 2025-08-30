import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Product } from './ProductSchema';

// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';

interface ProductCardProps {
	product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
	const [open, setOpen] = useState(false);

	return (
		<Card className="relative max-w-sm rounded-2xl shadow-md">
			<Swiper
				modules={[Pagination]}
				spaceBetween={10}
				slidesPerView={1}
				pagination={{ clickable: true }}
				className="rounded-t-2xl"
			>
				{product.image_url.map((img, idx) => (
					<SwiperSlide key={idx}>
						<img
							src={img}
							alt={`${product.name}-${idx}`}
							className="w-full h-56 object-cover rounded-t-2xl"
						/>
					</SwiperSlide>
				))}
			</Swiper>

			<div className="px-4 pt-6 mb-2">
				<p className="text-2xl font-semibold">{product.name}</p>
				<div className="absolute top-2 right-2 z-20">
					<DropdownMenu open={open} onOpenChange={setOpen}>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<MoreVertical className="h-5 w-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="z-50 absolute right-0" // manual position
							sideOffset={0}
						>
							<DropdownMenuItem
								onClick={() => console.log('View Product')}
							>
								View Product
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => console.log('Edit Product')}
							>
								Edit Product
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => console.log('Delete Product')}
							>
								Delete Product
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="space-y-2 px-4 pb-4">
				<p className="text-sm text-gray-600">{product.description}</p>
				<div className="flex justify-between items-center">
					<span className="font-bold text-lg text-green-700">
						KES {product.price}
					</span>
					<span className="text-sm text-gray-500">
						{product.category_name}
					</span>
				</div>
			</div>
		</Card>
	);
}
