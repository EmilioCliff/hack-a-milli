import NewsLetterStats from '@/components/news letters/NewsLetterStats';
import { NewsLetterTableSchema } from '@/components/news letters/NewsLetterTableSchema';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const newsLetters = [
	{
		id: 1,
		title: 'Tech Innovations Weekly',
		author: 'Jane Doe',
		downloads: 120,
		file_size: 2048,
		description:
			'A deep dive into the latest trends in AI and cloud computing.',
		storage_path: '/storage/newsletters/2025/tech-innovations-weekly.pdf',
		pdf_url:
			'https://cdn.example.com/newsletters/tech-innovations-weekly.pdf',
		date: '2025-08-01T10:00:00Z',
		published: true,
		published_at: '2025-08-01T12:00:00Z',
	},
	{
		id: 2,
		title: 'Cybersecurity Insights',
		author: 'Jane Doe',
		downloads: 85,
		file_size: 3072,
		description:
			'Monthly roundup of security threats and mitigation strategies.',
		storage_path: '/storage/newsletters/2025/cybersecurity-insights.pdf',
		pdf_url:
			'https://cdn.example.com/newsletters/cybersecurity-insights.pdf',
		date: '2025-08-15T09:30:00Z',
		published: false,
		published_at: null,
	},
	{
		id: 3,
		title: 'Startups & Funding Report',
		author: 'Jane Doe',
		downloads: 200,
		file_size: 4096,
		description:
			'Quarterly insights into venture capital and startup ecosystems.',
		storage_path: '/storage/newsletters/2025/startup-funding-report.pdf',
		pdf_url:
			'https://cdn.example.com/newsletters/startup-funding-report.pdf',
		date: '2025-07-01T11:00:00Z',
		published: true,
		published_at: '2025-07-01T11:15:00Z',
	},
	{
		id: 4,
		title: 'Healthcare Technology Digest',
		author: 'Jane Doe',
		downloads: 150,
		file_size: 2560,
		description:
			'Exploring innovations in medtech, biotech, and health AI.',
		storage_path: '/storage/newsletters/2025/healthcare-digest.pdf',
		pdf_url: 'https://cdn.example.com/newsletters/healthcare-digest.pdf',
		date: '2025-06-20T08:00:00Z',
		published: true,
		published_at: '2025-06-20T08:30:00Z',
	},
	{
		id: 5,
		title: 'Green Energy Spotlight',
		author: 'Jane Doe',
		downloads: 95,
		file_size: 3500,
		description:
			'Tracking renewable energy projects and policies across Africa.',
		storage_path: '/storage/newsletters/2025/green-energy-spotlight.pdf',
		pdf_url:
			'https://cdn.example.com/newsletters/green-energy-spotlight.pdf',
		date: '2025-05-10T15:00:00Z',
		published: false,
		published_at: null,
	},
];

const newsLetterPublished = [
	{ value: 'published', label: 'Published' },
	{ value: 'draft', label: 'Draft' },
];

function NewsLetters() {
	const navigate = useNavigate();
	return (
		<div className="space-y-6 p-4 bg-gray-100">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						News Letter
					</h1>
					<p className="text-muted-foreground">
						Manage KENIC newsletters and publications
					</p>
				</div>
				<Button className="gradient-primary cursor-pointer hover:accent-hover shadow-glow">
					<FileText className="w-4 h-4 mr-2" />
					Create News Letter
				</Button>
			</div>

			<NewsLetterStats />

			<DataTable
				data={newsLetters}
				columns={NewsLetterTableSchema(navigate)}
				searchableColumns={[
					{
						id: 'id',
						title: 'Title',
					},
					{
						id: 'author',
						title: 'Author',
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

export default NewsLetters;
