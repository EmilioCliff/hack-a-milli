import { JobPostingTableSchema } from '@/components/job postings/JobPostingTableSchema';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const jobPostings = [
	{
		id: 1,
		title: 'Software Engineer',
		department_id: 2,
		location: 'Nairobi, Kenya',
		department_name: 'Technical Operations',
		employment_type: 'full_time',
		content:
			'We are looking for a skilled software engineer to join our team.',
		salary_range: 'KES 150,000 - 200,000',
		start_date: '2025-09-01T08:00:00Z',
		end_date: '2025-09-30T17:00:00Z',
		show_case: true,
		published: true,
		published_at: '2025-08-28T10:00:00Z',
		updated_by: 1,
		created_by: 1,
		deleted_by: null,
		deleted_at: null,
		updated_at: '2025-08-28T10:00:00Z',
		created_at: '2025-08-28T09:00:00Z',
		number_of_applicants: 0,
	},
	{
		id: 2,
		title: 'Product Manager',
		department_id: 3,
		location: 'Mombasa, Kenya',
		department_name: 'Domain Registry',
		employment_type: 'full_time',
		content:
			'Seeking an experienced product manager to lead product development.',
		salary_range: 'KES 180,000 - 250,000',
		start_date: '2025-09-05T08:00:00Z',
		end_date: '2025-10-05T17:00:00Z',
		show_case: false,
		published: true,
		published_at: '2025-08-29T10:00:00Z',
		updated_by: 2,
		created_by: 2,
		deleted_by: null,
		deleted_at: null,
		updated_at: '2025-08-29T10:00:00Z',
		created_at: '2025-08-29T09:00:00Z',
		number_of_applicants: 9,
	},
	{
		id: 3,
		title: 'UX Designer',
		department_id: 4,
		department_name: 'Cybersecurity',
		location: 'Remote',
		employment_type: 'contract',
		content: 'Creative UX designer needed for short-term projects.',
		salary_range: 'KES 100,000 - 150,000',
		start_date: '2025-09-10T08:00:00Z',
		end_date: '2025-10-20T17:00:00Z',
		show_case: true,
		published: false,
		published_at: null,
		updated_by: 1,
		created_by: 3,
		deleted_by: null,
		deleted_at: null,
		updated_at: '2025-08-30T09:30:00Z',
		created_at: '2025-08-30T09:00:00Z',
		number_of_applicants: 9,
	},
	{
		id: 4,
		title: 'Data Analyst Intern',
		department_id: 5,
		department_name: 'Customer Relations',
		location: 'Kisumu, Kenya',
		employment_type: 'internship',
		content: 'Join our analytics team as an intern and grow your skills.',
		salary_range: 'Stipend - KES 30,000',
		start_date: '2025-09-15T08:00:00Z',
		end_date: '2025-11-15T17:00:00Z',
		show_case: false,
		published: true,
		published_at: '2025-08-31T11:00:00Z',
		updated_by: 4,
		created_by: 4,
		deleted_by: null,
		deleted_at: null,
		updated_at: '2025-08-31T11:00:00Z',
		created_at: '2025-08-31T09:00:00Z',
		number_of_applicants: 0,
	},
	{
		id: 5,
		title: 'Network Engineer',
		department_id: 6,
		location: 'Nairobi, Kenya',
		department_name: 'Policy & Governance',
		employment_type: 'full_time',
		content:
			'Responsible for maintaining and optimizing IT network systems.',
		salary_range: 'KES 120,000 - 170,000',
		start_date: '2025-09-20T08:00:00Z',
		end_date: '2025-10-20T17:00:00Z',
		show_case: true,
		published: false,
		published_at: null,
		updated_by: 2,
		created_by: 1,
		deleted_by: null,
		deleted_at: null,
		updated_at: '2025-09-01T08:00:00Z',
		created_at: '2025-09-01T07:00:00Z',
		number_of_applicants: 9,
	},
	{
		id: 6,
		title: 'HR Officer',
		department_id: 7,
		department_name: 'Customer Relations',
		location: 'Nakuru, Kenya',
		employment_type: 'part_time',
		content: 'Support HR operations and manage recruitment processes.',
		salary_range: 'KES 80,000 - 120,000',
		start_date: '2025-09-25T08:00:00Z',
		end_date: '2025-10-25T17:00:00Z',
		show_case: false,
		published: true,
		published_at: '2025-09-02T10:00:00Z',
		updated_by: 3,
		created_by: 3,
		deleted_by: null,
		deleted_at: null,
		updated_at: '2025-09-02T10:00:00Z',
		created_at: '2025-09-02T09:00:00Z',
		number_of_applicants: 9,
	},
	{
		id: 7,
		title: 'Marketing Specialist',
		department_id: 8,
		location: 'Remote',
		department_name: 'Policy & Governance',
		employment_type: 'contract',
		content:
			'Help us drive marketing campaigns and improve brand visibility.',
		salary_range: 'KES 90,000 - 140,000',
		start_date: '2025-09-30T08:00:00Z',
		end_date: '2025-11-15T17:00:00Z',
		show_case: true,
		published: true,
		published_at: '2025-09-03T12:00:00Z',
		updated_by: 2,
		created_by: 4,
		deleted_by: null,
		deleted_at: null,
		updated_at: '2025-09-03T12:00:00Z',
		created_at: '2025-09-03T10:00:00Z',
		number_of_applicants: 0,
	},
];

const employemntType = [
	{
		value: 'full_time',
		label: 'Full Time',
	},
	{
		value: 'part_time',
		label: 'Part Time',
	},
	{
		value: 'contract',
		label: 'Contract',
	},
	{
		value: 'internship',
		label: 'Internship',
	},
];

const status = [
	{
		value: 'Active',
		label: 'Active',
	},
	{
		value: 'Closed',
		label: 'Closed',
	},
	{
		value: 'Draft',
		label: 'Draft',
	},
];

function JobPostings() {
	const navigate = useNavigate();
	return (
		<div className="space-y-6 p-4 bg-gray-100">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Job Postings
					</h1>
					<p className="text-muted-foreground">
						Manage job openings and recruitment
					</p>
				</div>
				<Button className="gradient-primary cursor-pointer hover:accent-hover shadow-glow">
					<UserPlus className="w-4 h-4 mr-2" />
					Create Job Postings
				</Button>
			</div>

			<DataTable
				data={jobPostings}
				columns={JobPostingTableSchema(navigate)}
				searchableColumns={[
					{
						id: 'title',
						title: 'Position',
					},
					{
						id: 'department_name',
						title: 'Department',
					},
				]}
				facetedFilterColumns={[
					{
						id: 'employment_type',
						title: 'Type',
						options: employemntType,
					},
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

export default JobPostings;
