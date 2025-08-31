import BlogCard from '@/components/blogs/BlogCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const blogs = [
	{
		id: 1,
		title: 'Getting Started with Microservices in Go',
		author: 'John Doe',
		cover_img: 'https://picsum.photos/500/300',
		topic: 'Software Engineering',
		description:
			'An introduction to building scalable microservices with Golang.',
		content: `
		<h1>Microservices in Go</h1>
		<p>Go is a great language for building fast, scalable microservices.</p>
	  `,
		views: 124,
		min_read: 7,
		published: true,
		published_at: '2025-08-20T10:00:00Z',
		updated_by: 101,
		created_by: 101,
		deleted_by: null,
		deleted_at: null,
		updated_at: '2025-08-25T15:45:00Z',
		created_at: '2025-08-18T09:30:00Z',
	},
	{
		id: 9,
		title: 'Getting Started with Microservices in Go',
		author: 'John Doe',
		cover_img: '',
		topic: 'Software Engineering',
		description:
			'An introduction to building scalable microservices with Golang.',
		content: `
		<h1>Microservices in Go</h1>
		<p>Go is a great language for building fast, scalable microservices.</p>
	  `,
		views: 124,
		min_read: 7,
		published: true,
		published_at: '2025-08-20T10:00:00Z',
		updated_by: 101,
		created_by: 101,
		deleted_by: null,
		deleted_at: null,
		updated_at: '2025-08-25T15:45:00Z',
		created_at: '2025-08-18T09:30:00Z',
	},
	{
		id: 2,
		title: '10 Tips for Writing Clean Go Code',
		author: 'John Doe',
		cover_img: 'https://example.com/images/clean-code.png',
		topic: 'Programming',
		description: 'Learn how to write cleaner, more maintainable Go code.',
		content: `
		<h2>Tip 1: Use gofmt</h2>
		<p>Always format your code with gofmt or gofumpt.</p>
	  `,
		views: 89,
		min_read: 5,
		published: false,
		published_at: null,
		updated_by: 102,
		created_by: 102,
		deleted_by: null,
		deleted_at: null,
		updated_at: '2025-08-26T11:00:00Z',
		created_at: '2025-08-19T14:10:00Z',
	},
	{
		id: 3,
		title: 'Mastering RabbitMQ for Distributed Systems',
		author: 'John Doe',
		cover_img: 'https://example.com/images/rabbitmq.png',
		topic: 'Messaging',
		description:
			"Understand how RabbitMQ works and why it's powerful for microservices.",
		content: `
		<h2>Why RabbitMQ?</h2>
		<p>RabbitMQ enables reliable communication between distributed services.</p>
	  `,
		views: 205,
		min_read: 9,
		published: true,
		published_at: '2025-08-15T09:00:00Z',
		updated_by: 103,
		created_by: 103,
		deleted_by: null,
		deleted_at: null,
		updated_at: '2025-08-25T10:30:00Z',
		created_at: '2025-08-10T13:45:00Z',
	},
	{
		id: 4,
		title: 'Scaling Databases with PostgreSQL',
		author: 'John Doe',
		cover_img: 'https://example.com/images/postgresql.png',
		topic: 'Databases',
		description: 'Best practices for scaling PostgreSQL in production.',
		content: `
		<h2>Connection Pooling</h2>
		<p>Always use a connection pooler like PgBouncer for scaling.</p>
	  `,
		views: 310,
		min_read: 8,
		published: true,
		published_at: '2025-08-10T08:15:00Z',
		updated_by: 104,
		created_by: 104,
		deleted_by: null,
		deleted_at: null,
		updated_at: '2025-08-22T12:20:00Z',
		created_at: '2025-08-05T16:00:00Z',
	},
	{
		id: 5,
		title: 'React + TypeScript: Building Safer UIs',
		author: 'John Doe',
		cover_img: 'https://example.com/images/react-ts.png',
		topic: 'Frontend',
		description:
			'How TypeScript makes building React applications safer and faster.',
		content: `
		<h2>Why TypeScript?</h2>
		<p>TypeScript helps prevent bugs by catching errors at compile time.</p>
	  `,
		views: 152,
		min_read: 6,
		published: false,
		published_at: null,
		updated_by: 105,
		created_by: 105,
		deleted_by: null,
		deleted_at: null,
		updated_at: '2025-08-29T09:40:00Z',
		created_at: '2025-08-21T07:15:00Z',
	},
	{
		id: 6,
		title: 'API Security with JWT and OAuth2',
		author: 'John Doe',
		cover_img: 'https://example.com/images/jwt-oauth.png',
		topic: 'Security',
		description: 'Learn how to secure your APIs using JWT and OAuth2.',
		content: `
		<h2>JWT Basics</h2>
		<p>JWT allows secure transmission of claims between two parties.</p>
	  `,
		views: 430,
		min_read: 10,
		published: true,
		published_at: '2025-08-12T18:30:00Z',
		updated_by: 106,
		created_by: 106,
		deleted_by: null,
		deleted_at: null,
		updated_at: '2025-08-28T12:10:00Z',
		created_at: '2025-08-09T11:20:00Z',
	},
];

function Blogs() {
	const [search, setSearch] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('all');
	const [isFiltered, setIsFiltered] = useState(false);

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
			<Card>
				<CardContent className="p-6">
					<div className="flex gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
							<Input
								placeholder="Filter by title or topic"
								value={search}
								onChange={(event) => {
									setSearch(event.target.value);
									setIsFiltered(
										event.target.value.length > 0,
									);
								}}
								className="pl-10"
							/>
						</div>

						<Select
							value={selectedStatus}
							onValueChange={(value) => {
								setSelectedStatus(value);
								setIsFiltered(value !== 'all');
							}}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select Type" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="all">Both</SelectItem>
									<SelectItem value="published">
										Published
									</SelectItem>
									<SelectItem value="draft">Draft</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
						{isFiltered && (
							<Button
								variant="ghost"
								onClick={() => {
									setSearch('');
									setSelectedStatus('all');
									setIsFiltered(false);
								}}
								className="h-8 px-2 lg:px-3"
							>
								Reset
								<X />
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{blogs.map((blog) => (
					<BlogCard key={blog.id} blog={blog} />
				))}
			</div>
			<div className="flex justify-center mt-4">
				<Button variant="outline">Load More</Button>
			</div>
		</div>
	);
}

export default Blogs;
