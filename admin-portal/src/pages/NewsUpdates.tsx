import { NewsUpdateTableSchema } from '@/components/news updates/NewsUpdateTableSchema';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const dummyNewsUpdates = [
	{
		id: 1,
		title: "Kenya's Digital Transformation in 2025",
		topic: 'Technology',
		author: 'Emilio Cliff',
		date: '2025-08-28T10:00:00Z',
		min_read: 5,
		excerpt: 'Kenya is rapidly advancing its digital infrastructure...',
		content: "Full content about Kenya's digital transformation...",
		cover_img: 'https://via.placeholder.com/150',
		published: true,
		published_at: '2025-08-28T12:00:00Z',
	},
	{
		id: 2,
		title: 'New Policies for Domain Registrations',
		topic: 'Policy',
		author: 'Jane Doe',
		date: '2025-08-27T14:30:00Z',
		min_read: 3,
		excerpt:
			'The government has announced new domain registration policies...',
		content: 'Detailed content about new policies...',
		cover_img: 'https://via.placeholder.com/150',
		published: false,
		published_at: null,
	},
	{
		id: 3,
		title: 'Upcoming Tech Conferences in Nairobi',
		topic: 'Events',
		author: 'John Smith',
		date: '2025-08-25T09:00:00Z',
		min_read: 4,
		excerpt:
			'Several tech conferences are scheduled this fall in Nairobi...',
		content:
			'Full details about tech conferences, speakers, and schedules...',
		cover_img: 'https://via.placeholder.com/150',
		published: true,
		published_at: '2025-08-25T10:00:00Z',
	},
];

const newsLetterPublished = [
	{ value: 'published', label: 'Published' },
	{ value: 'draft', label: 'Draft' },
];

function NewsUpdates() {
	const navigate = useNavigate();
	return (
		<div className="space-y-6 p-4 bg-gray-100">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						News Updates
					</h1>
					<p className="text-muted-foreground">
						Manage news articles and press releases
					</p>
				</div>
				<Button className="gradient-primary cursor-pointer hover:accent-hover shadow-glow">
					<Plus className="w-4 h-4 mr-2" />
					Create News Article
				</Button>
			</div>

			<DataTable
				data={dummyNewsUpdates}
				columns={NewsUpdateTableSchema(navigate)}
				searchableColumns={[
					{
						id: 'title',
						title: 'Title',
					},
					{
						id: 'topic',
						title: 'Topic',
					},
				]}
				facetedFilterColumns={[
					{
						id: 'published',
						title: 'Published',
						options: newsLetterPublished,
					},
				]}
			/>
		</div>
	);
}

export default NewsUpdates;
