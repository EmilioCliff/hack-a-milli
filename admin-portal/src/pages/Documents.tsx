import { DocumentTableSchema } from '@/components/documents/DocumentTableSchema';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const docs = [
	{
		id: 1,
		title: 'Annual Report 2024',
		description: 'Comprehensive overview of the year 2024',
		content:
			'Full annual report for the year 2024. This document covers all financial and operational highlights.',
		is_public: true,
		status: 'published',
		min_read: 3500,
		created_at: '2025-01-15T09:00:00Z',
		updated_at: '2025-02-01T10:00:00Z',
		deleted_at: null,
	},
	{
		id: 2,
		title: 'Employee Handbook',
		description: 'Comprehensive overview of the year 2024',
		content:
			'Guidelines and policies for all employees. Please read carefully.',
		is_public: false,
		status: 'published',
		min_read: 2200,
		created_at: '2025-02-10T10:30:00Z',
		updated_at: '2025-02-15T12:00:00Z',
		deleted_at: null,
	},
	{
		id: 3,
		title: 'Marketing Strategy Q1',
		description: 'Comprehensive overview of the year 2024',
		content:
			'Marketing plans and strategy for Q1. Includes campaign ideas and budget.',
		is_public: true,
		status: 'draft',
		min_read: 1500,
		created_at: '2025-03-05T14:20:00Z',
		updated_at: '2025-03-06T09:00:00Z',
		deleted_at: null,
	},
	{
		id: 4,
		title: 'Board Meeting Minutes',
		description: 'Comprehensive overview of the year 2024',
		content: 'Minutes from the latest board meeting. Confidential.',
		is_public: false,
		status: 'archived',
		min_read: 900,
		created_at: '2025-04-12T16:00:00Z',
		updated_at: '2025-04-13T08:00:00Z',
		deleted_at: null,
	},
	{
		id: 5,
		title: 'Product Launch Brochure',
		description: 'Comprehensive overview of the year 2024',
		content:
			'Brochure for the new product launch. Contains product features and pricing.',
		is_public: true,
		status: 'published',
		min_read: 1200,
		created_at: '2025-05-01T08:45:00Z',
		updated_at: '2025-05-02T11:00:00Z',
		deleted_at: null,
	},
	{
		id: 6,
		title: 'IT Security Policy',
		description: 'Comprehensive overview of the year 2024',
		content: 'Company IT security guidelines. All staff must comply.',
		is_public: false,
		status: 'draft',
		min_read: 800,
		created_at: '2025-06-18T11:15:00Z',
		updated_at: '2025-06-19T09:30:00Z',
		deleted_at: null,
	},
];

const status = [
	{ label: 'Published', value: 'published' },
	{ label: 'Draft', value: 'draft' },
	{ label: 'Archived', value: 'archived' },
];

function Documents() {
	const navigate = useNavigate();
	return (
		<div className="space-y-6 p-4 bg-gray-100">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Document Management
					</h1>
					<p className="text-muted-foreground">
						Manage company documents, policies, and training
						materials
					</p>
				</div>
				<Button className="gradient-primary cursor-pointer hover:accent-hover shadow-glow">
					<UserPlus className="w-4 h-4 mr-2" />
					Create Document
				</Button>
			</div>

			<DataTable
				data={docs}
				columns={DocumentTableSchema(navigate)}
				searchableColumns={[
					{
						id: 'title',
						title: 'Title',
					},
				]}
				facetedFilterColumns={[
					{
						id: 'status',
						title: 'Status',
						options: status,
					},
				]}
			/>
		</div>
	);
}

export default Documents;
