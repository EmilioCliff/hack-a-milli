import BlogCard from '@/components/blogs/BlogCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const blogs = [
	{
		id: 1,
		title: "Kenya's Digital Infrastructure: The Role of .ke Domains",
		topic: 'Digital Infrastructure',
		author: 'Grace Wanjiku',
		coverImage: '/blog-covers/digital-infrastructure.jpg',
		minReadTime: 8,
		publishedAt: '2024-01-15T10:00:00Z',
		status: 'published',
		excerpt:
			"Exploring how .ke domains are driving Kenya's digital transformation and supporting local businesses in the digital economy.",
	},
	{
		id: 2,
		title: 'KENIC Summit 2024: Key Highlights and Announcements',
		topic: 'Events',
		author: 'John Kiprotich',
		coverImage: '/blog-covers/summit-2024.jpg',
		minReadTime: 6,
		publishedAt: '2024-01-12T14:30:00Z',
		status: 'published',
		excerpt:
			"A comprehensive recap of the KENIC Summit 2024, featuring new initiatives, partnerships, and the future of Kenya's internet landscape.",
	},
	{
		id: 3,
		title: 'Cybersecurity Best Practices for .ke Domain Owners',
		topic: 'Security',
		author: 'David Mwangi',
		coverImage: '/blog-covers/cybersecurity.jpg',
		minReadTime: 12,
		publishedAt: null,
		status: 'draft',
		excerpt:
			'Essential security measures every .ke domain owner should implement to protect their online presence and business operations.',
	},
	{
		id: 4,
		title: "Supporting Local Startups: KENIC's New Domain Incentive Program",
		topic: 'Programs',
		author: 'Sarah Achieng',
		coverImage: '/blog-covers/startup-program.jpg',
		minReadTime: 5,
		publishedAt: '2024-01-10T09:15:00Z',
		status: 'published',
		excerpt:
			'Introducing our new initiative to support Kenyan startups with affordable domain registration and technical resources.',
	},
	{
		id: 5,
		title: 'The Future of Internet Governance in East Africa',
		topic: 'Policy',
		author: 'Grace Wanjiku',
		coverImage: '/blog-covers/internet-governance.jpg',
		minReadTime: 10,
		publishedAt: null,
		status: 'review',
		excerpt:
			"An analysis of emerging trends in internet governance and KENIC's role in shaping regional digital policy frameworks.",
	},
];

function Blogs() {
	return (
		<div className="space-y-6 p-4 bg-gray-100">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Blog Management
					</h1>
					<p className="text-muted-foreground">
						Create, edit, and publish blog posts for the KENIC
						website
					</p>
				</div>
				<Button className="gradient-primary cursor-pointer hover:accent-hover shadow-glow">
					<Plus className="w-4 h-4 mr-2" />
					Create News Post
				</Button>
			</div>
			<BlogCard blog={blogs[0]} />
		</div>
	);
}

export default Blogs;
