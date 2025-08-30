import { JobApplicationTableSchema } from '@/components/job applications/JobApplicationTableSchema';
import { DataTable } from '@/components/table/data-table';
import { useNavigate } from 'react-router-dom';

const jobApplications = [
	{
		id: 1,
		job_id: 1,
		full_name: 'Alice Mwangi',
		email: 'alice@example.com',
		phone_number: '0712345678',
		cover_letter:
			'I am passionate about software development and eager to join your team.',
		resume_url: 'https://example.com/resumes/alice.pdf',
		status: 'pending',
		comment: null,
		submitted_at: '2025-09-01T09:00:00Z',
		updated_by: null,
		updated_at: '2025-09-01T09:00:00Z',
		created_at: '2025-09-01T09:00:00Z',
	},
	{
		id: 2,
		job_id: 1,
		full_name: 'Brian Otieno',
		email: 'brian@example.com',
		phone_number: '0723456789',
		cover_letter:
			'Excited to apply my backend skills to this software engineering role.',
		resume_url: 'https://example.com/resumes/brian.pdf',
		status: 'reviewed',
		comment: 'Strong technical background',
		submitted_at: '2025-09-02T08:00:00Z',
		updated_by: 1,
		updated_at: '2025-09-02T09:00:00Z',
		created_at: '2025-09-02T08:00:00Z',
	},
	{
		id: 3,
		job_id: 2,
		full_name: 'Cynthia Wairimu',
		email: 'cynthia@example.com',
		phone_number: '0734567890',
		cover_letter:
			'Experienced in product management with a focus on agile delivery.',
		resume_url: 'https://example.com/resumes/cynthia.pdf',
		status: 'shortlisted',
		comment: 'Good leadership skills',
		submitted_at: '2025-09-03T10:00:00Z',
		updated_by: 2,
		updated_at: '2025-09-03T11:00:00Z',
		created_at: '2025-09-03T10:00:00Z',
	},
	{
		id: 4,
		job_id: 3,
		full_name: 'Daniel Kamau',
		email: 'daniel@example.com',
		phone_number: '0745678901',
		cover_letter:
			'Creative designer with a portfolio of UX-focused projects.',
		resume_url: 'https://example.com/resumes/daniel.pdf',
		status: 'pending',
		comment: null,
		submitted_at: '2025-09-04T09:00:00Z',
		updated_by: null,
		updated_at: '2025-09-04T09:00:00Z',
		created_at: '2025-09-04T09:00:00Z',
	},
	{
		id: 5,
		job_id: 4,
		full_name: 'Evelyn Njeri',
		email: 'evelyn@example.com',
		phone_number: '0756789012',
		cover_letter:
			'Looking forward to gaining experience as a Data Analyst Intern.',
		resume_url: 'https://example.com/resumes/evelyn.pdf',
		status: 'pending',
		comment: null,
		submitted_at: '2025-09-05T08:30:00Z',
		updated_by: null,
		updated_at: '2025-09-05T08:30:00Z',
		created_at: '2025-09-05T08:30:00Z',
	},
	{
		id: 6,
		job_id: 5,
		full_name: 'Frankline Odhiambo',
		email: 'frankline@example.com',
		phone_number: '0767890123',
		cover_letter: 'Skilled network engineer with Cisco certification.',
		resume_url: 'https://example.com/resumes/frankline.pdf',
		status: 'reviewed',
		comment: 'Good certifications',
		submitted_at: '2025-09-06T10:00:00Z',
		updated_by: 1,
		updated_at: '2025-09-06T10:30:00Z',
		created_at: '2025-09-06T10:00:00Z',
	},
	{
		id: 7,
		job_id: 6,
		full_name: 'Grace Achieng',
		email: 'grace@example.com',
		phone_number: '0778901234',
		cover_letter:
			'Enthusiastic HR professional ready to support HR operations.',
		resume_url: 'https://example.com/resumes/grace.pdf',
		status: 'hired',
		comment: 'Hired for HR role',
		submitted_at: '2025-09-07T09:00:00Z',
		updated_by: 2,
		updated_at: '2025-09-07T09:30:00Z',
		created_at: '2025-09-07T09:00:00Z',
	},
];

const status = [
	{
		value: 'pending',
		label: 'Pending',
	},
	{
		value: 'reviewed',
		label: 'Reviewed',
	},
	{
		value: 'shortlisted',
		label: 'Shortlisted',
	},
	{
		value: 'rejected',
		label: 'Rejected',
	},
	{
		value: 'hired',
		label: 'Hired',
	},
];

function JobApplications() {
	const navigate = useNavigate();
	return (
		<div className="space-y-6 p-4 bg-gray-100">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Job Applications
					</h1>
					<p className="text-muted-foreground">
						Manage job applications
					</p>
				</div>
			</div>

			<DataTable
				data={jobApplications}
				columns={JobApplicationTableSchema(navigate)}
				searchableColumns={[
					{
						id: 'full_name',
						title: 'Name, Email, Phone Number',
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

export default JobApplications;
