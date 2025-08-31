import { DepartmentTableSchema } from '@/components/departments/DepartmentTableSchema';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const departments = [
	{
		id: 1,
		name: 'Information Technology',
		description: 'Handles all tech-related tasks and infrastructure',
		status: 'active',
		staff_count: 18,
	},
	{
		id: 2,
		name: 'Human Resources',
		description: 'Handles all tech-related tasks and infrastructure',
		status: 'active',
		staff_count: 12,
	},
	{
		id: 3,
		name: 'Finance',
		description: 'Handles all tech-related tasks and infrastructure',
		status: 'active',
		staff_count: 9,
	},
	{
		id: 4,
		name: 'Marketing',
		description: 'Handles all tech-related tasks and infrastructure',
		status: 'inactive',
		staff_count: 6,
	},
	{
		id: 5,
		name: 'Customer Support',
		description: 'Handles all tech-related tasks and infrastructure',
		status: 'active',
		staff_count: 14,
	},
	{
		id: 6,
		name: 'Research & Development',
		description: 'Handles all tech-related tasks and infrastructure',
		status: 'active',
		staff_count: 7,
	},
];

const status = [
	{ label: 'Active', value: 'active' },
	{ label: 'Inactive', value: 'inactive' },
];

function Departments() {
	const navigate = useNavigate();
	return (
		<div className="space-y-6 p-4 bg-gray-100">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Departments
					</h1>
					<p className="text-muted-foreground">
						Manage organizational departments and structure
					</p>
				</div>
				<Button className="gradient-primary cursor-pointer hover:accent-hover shadow-glow">
					<Plus className="w-4 h-4 mr-2" />
					Add Department
				</Button>
			</div>

			<DataTable
				data={departments}
				columns={DepartmentTableSchema(navigate)}
				searchableColumns={[
					{
						id: 'name',
						title: 'Department Name',
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

export default Departments;
