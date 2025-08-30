import { RegistrarTableSchema } from '@/components/registrars/RegistrarTableSchema';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const registrars = [
	{
		id: 1,
		email: 'info@kendetregistrar.co.ke',
		name: 'KenDet Registrars Ltd',
		logo_url: 'https://example.com/logos/kendet.png',
		address: 'Nairobi, Kenya - Westlands',
		status: 'active',
		specialities: ['.ke domains', 'DNS management', 'Email hosting'],
		phone_number: '+254712345678',
		website_url: 'https://kendetregistrar.co.ke',
		updated_by: 1,
		created_by: 1,
		deleted_by: null,
		deleted_at: null,
		updated_at: new Date().toISOString(),
		created_at: new Date().toISOString(),
	},
	{
		id: 2,
		email: 'support@afridomains.co.ke',
		name: 'AfriDomains Kenya',
		logo_url: 'https://example.com/logos/afridomains.png',
		address: 'Mombasa Road, Nairobi',
		status: 'active',
		specialities: ['.ke domains', 'Web hosting', 'SSL certificates'],
		phone_number: '+254701234567',
		website_url: 'https://afridomains.co.ke',
		updated_by: 2,
		created_by: 2,
		deleted_by: null,
		deleted_at: null,
		updated_at: new Date().toISOString(),
		created_at: new Date().toISOString(),
	},
	{
		id: 3,
		email: 'admin@netlink.co.ke',
		name: 'NetLink Registrars',
		logo_url: 'https://example.com/logos/netlink.png',
		address: 'Kisumu, Kenya',
		status: 'inactive',
		specialities: ['.ke domains', 'Reseller services'],
		phone_number: '+254734567890',
		website_url: 'https://netlink.co.ke',
		updated_by: 1,
		created_by: 1,
		deleted_by: null,
		deleted_at: null,
		updated_at: new Date().toISOString(),
		created_at: new Date().toISOString(),
	},
	{
		id: 4,
		email: 'info@domainhub.co.ke',
		name: 'DomainHub Africa',
		logo_url: 'https://example.com/logos/domainhub.png',
		address: 'Thika Road, Nairobi',
		status: 'active',
		specialities: ['.ke domains', 'Managed hosting', 'WHOIS privacy'],
		phone_number: '+254745678901',
		website_url: 'https://domainhub.co.ke',
		updated_by: 3,
		created_by: 3,
		deleted_by: null,
		deleted_at: null,
		updated_at: new Date().toISOString(),
		created_at: new Date().toISOString(),
	},
	{
		id: 5,
		email: 'sales@proregistrar.co.ke',
		name: 'ProRegistrar Kenya',
		logo_url: 'https://example.com/logos/proregistrar.png',
		address: 'Eldoret, Uasin Gishu',
		status: 'suspended',
		specialities: ['.ke domains', 'Bulk registrations', 'Cloud hosting'],
		phone_number: '+254789012345',
		website_url: 'https://proregistrar.co.ke',
		updated_by: 2,
		created_by: 2,
		deleted_by: null,
		deleted_at: null,
		updated_at: new Date().toISOString(),
		created_at: new Date().toISOString(),
	},
];

function Registrars() {
	const navigate = useNavigate();
	return (
		<div className="space-y-6 p-4 bg-gray-100">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Registrar Management
					</h1>
					<p className="text-muted-foreground">
						Manage certified .ke domain registrars and their
						services
					</p>
				</div>
				<Button className="gradient-primary cursor-pointer hover:accent-hover shadow-glow">
					<UserPlus className="w-4 h-4 mr-2" />
					Add New Registrar
				</Button>
			</div>

			<DataTable
				data={registrars}
				columns={RegistrarTableSchema(navigate)}
				searchableColumns={[
					{
						id: 'id',
						title: 'Name, Website',
					},
					{
						id: 'Contact',
						title: 'Email, Address',
					},
				]}
			/>
		</div>
	);
}

export default Registrars;
